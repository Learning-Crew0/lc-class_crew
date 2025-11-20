const trainingScheduleService = require("../services/trainingSchedule.service");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Get all training schedules for calendar view
 * GET /api/v1/training-schedules/calendar
 */
const getCalendarSchedules = asyncHandler(async (req, res) => {
    const { startDate, endDate, status, categorySlug, isActive } = req.query;

    const filters = {
        startDate,
        endDate,
        status,
        categorySlug,
        isActive: isActive !== undefined ? isActive === "true" : true,
    };

    const result = await trainingScheduleService.getCalendarSchedules(filters);

    res.status(200).json({
        success: true,
        status: "success",
        data: result,
    });
});

/**
 * Export annual schedule to Excel and/or PDF
 * POST /api/v1/admin/training-schedules/export/annual
 */
const exportAnnualSchedule = asyncHandler(async (req, res) => {
    const { year, format = "both" } = req.body;

    if (!year || year < 2000 || year > 2100) {
        throw ApiError.badRequest("Valid year is required (2000-2100)");
    }

    // Get schedule data
    const scheduleData =
        await trainingScheduleService.getAnnualScheduleData(year);

    if (scheduleData.length === 0) {
        throw ApiError.notFound(`No schedules found for year ${year}`);
    }

    const uploadDir = path.join(__dirname, "../../uploads/schedules");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const result = {};

    // Generate Excel file
    if (format === "excel" || format === "both") {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${year}년 교육일정`);

        // Add title
        worksheet.mergeCells("A1:K1");
        const titleCell = worksheet.getCell("A1");
        titleCell.value = `${year}년 연간 교육일정`;
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4472C4" },
        };
        titleCell.font = { ...titleCell.font, color: { argb: "FFFFFFFF" } };
        worksheet.getRow(1).height = 30;

        // Add headers
        const headers = [
            "대분류",
            "중분류",
            "과정명",
            "교육일정",
            "시작일",
            "종료일",
            "교육시간",
            "교육장소",
            "정원",
            "현재신청",
            "상태",
        ];
        worksheet.addRow(headers);

        const headerRow = worksheet.getRow(2);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE7E6E6" },
        };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };
        headerRow.height = 25;

        // Add data
        scheduleData.forEach((schedule) => {
            worksheet.addRow([
                schedule.대분류,
                schedule.중분류,
                schedule.과정명,
                schedule.교육일정,
                schedule.시작일,
                schedule.종료일,
                schedule.교육시간,
                schedule.교육장소,
                schedule.정원,
                schedule.현재신청,
                schedule.상태,
            ]);
        });

        // Auto-fit columns
        worksheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value
                    ? cell.value.toString().length
                    : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = Math.min(maxLength + 2, 50);
        });

        // Add borders
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

        // Save Excel file
        const excelFileName = `${year}_annual_schedule.xlsx`;
        const excelFilePath = path.join(uploadDir, excelFileName);
        await workbook.xlsx.writeFile(excelFilePath);

        result.excelUrl = `/uploads/schedules/${excelFileName}`;
    }

    // Generate PDF file
    if (format === "pdf" || format === "both") {
        const pdfFileName = `${year}_annual_schedule.pdf`;
        const pdfFilePath = path.join(uploadDir, pdfFileName);
        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        doc.pipe(fs.createWriteStream(pdfFilePath));

        // Register Korean font (you may need to add a Korean font file)
        // For now, using default font
        doc.fontSize(20).text(`${year}년 연간 교육일정`, { align: "center" });
        doc.moveDown();

        // Add table headers
        const tableTop = 100;
        const tableLeft = 50;
        const colWidths = [60, 60, 120, 80, 60, 60, 50, 80, 40, 40, 50];
        const rowHeight = 30;

        doc.fontSize(10);
        const headers = [
            "대분류",
            "중분류",
            "과정명",
            "교육일정",
            "시작일",
            "종료일",
            "시간",
            "장소",
            "정원",
            "신청",
            "상태",
        ];

        let y = tableTop;
        headers.forEach((header, i) => {
            const x =
                tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
            doc.rect(x, y, colWidths[i], rowHeight).stroke();
            doc.text(header, x + 5, y + 10, {
                width: colWidths[i] - 10,
                align: "center",
            });
        });

        // Add data rows
        scheduleData.slice(0, 20).forEach((schedule, rowIndex) => {
            // Limit to 20 rows for PDF
            y = tableTop + (rowIndex + 1) * rowHeight;
            const rowData = [
                schedule.대분류,
                schedule.중분류,
                schedule.과정명.substring(0, 15),
                schedule.교육일정.substring(0, 10),
                schedule.시작일,
                schedule.종료일,
                schedule.교육시간,
                schedule.교육장소.substring(0, 10),
                schedule.정원.toString(),
                schedule.현재신청.toString(),
                schedule.상태,
            ];

            rowData.forEach((data, i) => {
                const x =
                    tableLeft +
                    colWidths.slice(0, i).reduce((a, b) => a + b, 0);
                doc.rect(x, y, colWidths[i], rowHeight).stroke();
                doc.fontSize(8).text(data || "", x + 3, y + 10, {
                    width: colWidths[i] - 6,
                    align: "center",
                });
            });
        });

        if (scheduleData.length > 20) {
            doc.moveDown(2)
                .fontSize(10)
                .text(`총 ${scheduleData.length}개 일정 중 20개만 표시됩니다.`);
        }

        doc.end();

        result.pdfUrl = `/uploads/schedules/${pdfFileName}`;
    }

    result.generatedAt = new Date();
    result.totalSchedules = scheduleData.length;

    res.status(200).json({
        success: true,
        status: "success",
        data: result,
        message: `${year}년 교육일정이 성공적으로 생성되었습니다`,
    });
});

/**
 * Download bulk upload template
 * GET /api/v1/admin/training-schedules/bulk-upload/template
 */
const downloadBulkUploadTemplate = asyncHandler(async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("교육일정 업로드 템플릿");

    // Add instructions
    worksheet.mergeCells("A1:F1");
    const instructionCell = worksheet.getCell("A1");
    instructionCell.value =
        "교육일정 대량 등록 템플릿 - 아래 양식에 맞춰 데이터를 입력해주세요";
    instructionCell.font = { size: 14, bold: true };
    instructionCell.alignment = { horizontal: "center", vertical: "middle" };
    instructionCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
    };
    instructionCell.font = {
        ...instructionCell.font,
        color: { argb: "FFFFFFFF" },
    };
    worksheet.getRow(1).height = 30;

    // Add headers
    const headers = [
        "과정ID*",
        "일정명*",
        "시작일* (YYYY-MM-DD)",
        "종료일* (YYYY-MM-DD)",
        "정원*",
        "상태 (upcoming/ongoing/completed/cancelled)",
    ];
    worksheet.addRow(headers);

    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE7E6E6" },
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 25;

    // Add example data
    worksheet.addRow([
        "691c1f07ec62752caec78e49",
        "2025년 3월 정기과정",
        "2025-03-15",
        "2025-03-16",
        "30",
        "upcoming",
    ]);
    worksheet.addRow([
        "691815c4a897128ee4d04db0",
        "2025년 4월 특별과정",
        "2025-04-20",
        "2025-04-21",
        "25",
        "upcoming",
    ]);

    // Set column widths
    worksheet.columns = [
        { width: 30 },
        { width: 25 },
        { width: 20 },
        { width: 20 },
        { width: 10 },
        { width: 35 },
    ];

    // Add borders
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) {
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        }
    });

    // Set response headers
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=training_schedule_upload_template.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
});

/**
 * Bulk upload training schedules from Excel
 * POST /api/v1/admin/training-schedules/bulk-upload
 */
const bulkUploadSchedules = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest("Excel file is required");
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.worksheets[0];
    const schedulesData = [];

    // Parse Excel data (skip first 2 rows - title and headers)
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 2) {
            const [
                courseId,
                scheduleName,
                startDate,
                endDate,
                availableSeats,
                status,
            ] = row.values.slice(1); // slice(1) to skip the first empty cell

            // Validate required fields
            if (!courseId || !scheduleName || !startDate || !endDate) {
                return; // Skip invalid rows
            }

            schedulesData.push({
                courseId: courseId.toString().trim(),
                scheduleName: scheduleName.toString().trim(),
                startDate: startDate.toString().trim(),
                endDate: endDate.toString().trim(),
                availableSeats: parseInt(availableSeats) || 30,
                status: status ? status.toString().trim() : "upcoming",
            });
        }
    });

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    if (schedulesData.length === 0) {
        throw ApiError.badRequest("No valid schedule data found in Excel file");
    }

    // Process bulk creation
    const result =
        await trainingScheduleService.bulkCreateSchedules(schedulesData);

    res.status(200).json({
        success: true,
        status: "success",
        data: result,
        message: `${result.summary.created}개 일정이 생성되고 ${result.summary.updated}개 일정이 업데이트되었습니다`,
    });
});

module.exports = {
    getCalendarSchedules,
    exportAnnualSchedule,
    downloadBulkUploadTemplate,
    bulkUploadSchedules,
};
