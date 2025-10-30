"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    bulkUploadCourses,
    bulkUploadInstructors,
    bulkUploadCurriculum,
    bulkUploadNotices,
    bulkUploadPromotions,
    bulkUploadReviews,
    bulkUploadTrainingSchedules,
    downloadCoursesTemplate,
    downloadInstructorsTemplate,
    downloadCurriculumTemplate,
    downloadNoticesTemplate,
    downloadPromotionsTemplate,
    downloadReviewsTemplate,
    downloadTrainingSchedulesTemplate
} from "@/utils/api";

interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

interface BulkUploadItem<TUpload = unknown> {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    uploadFunction: (file: File) => Promise<ApiResponse<TUpload>>;
    templateFunction: (format?: string) => Promise<void>;
}
export default function BulkUploadPage() {
    const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});
    const [downloadingStates, setDownloadingStates] = useState<Record<string, boolean>>({});

    const bulkUploadItems: BulkUploadItem[] = [
        {
            id: 'courses',
            title: 'Courses Bulk Upload',
            description: 'Upload multiple courses at once using CSV or XLSX file',
            icon: '📚',
            color: 'bg-blue-500',
            uploadFunction: bulkUploadCourses,
            templateFunction: downloadCoursesTemplate
        },
        {
            id: 'instructors',
            title: 'Instructors Bulk Upload',
            description: 'Upload multiple instructors at once using CSV or XLSX file',
            icon: '👨‍🏫',
            color: 'bg-green-500',
            uploadFunction: bulkUploadInstructors,
            templateFunction: downloadInstructorsTemplate
        },
        {
            id: 'curriculum',
            title: 'Curriculum Bulk Upload',
            description: 'Upload curriculum data for courses using CSV or XLSX file',
            icon: '📋',
            color: 'bg-purple-500',
            uploadFunction: bulkUploadCurriculum,
            templateFunction: downloadCurriculumTemplate
        },
        {
            id: 'notices',
            title: 'Notices Bulk Upload',
            description: 'Upload course notices and announcements using CSV or XLSX file',
            icon: '📢',
            color: 'bg-yellow-500',
            uploadFunction: bulkUploadNotices,
            templateFunction: downloadNoticesTemplate
        },
        {
            id: 'promotions',
            title: 'Promotions Bulk Upload',
            description: 'Upload promotional content and offers using CSV or XLSX file',
            icon: '🎯',
            color: 'bg-red-500',
            uploadFunction: bulkUploadPromotions,
            templateFunction: downloadPromotionsTemplate
        },
        {
            id: 'reviews',
            title: 'Reviews Bulk Upload',
            description: 'Upload course reviews and ratings using CSV or XLSX file',
            icon: '⭐',
            color: 'bg-indigo-500',
            uploadFunction: bulkUploadReviews,
            templateFunction: downloadReviewsTemplate
        },
        {
            id: 'training-schedules',
            title: 'Training Schedules Bulk Upload',
            description: 'Upload training schedules for courses using CSV or XLSX file',
            icon: '📅',
            color: 'bg-teal-500',
            uploadFunction: bulkUploadTrainingSchedules,
            templateFunction: downloadTrainingSchedulesTemplate
        }
    ];

    const handleFileUpload = async (item: BulkUploadItem, file: File) => {
        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        // Validate file type
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a CSV or XLSX file');
            return;
        }

        setUploadingStates(prev => ({ ...prev, [item.id]: true }));

        try {
            const response = await item.uploadFunction(file);

            if (response.success) {
                toast.success(`${item.title} completed successfully!`);
                console.log(`${item.title} Response:`, response);
            } else {
                toast.error(response.message || `${item.title} failed`);
            }
        } catch (error) {
            console.error(`${item.title} Error:`, error);
            toast.error(`Error during ${item.title.toLowerCase()}`);
        } finally {
            setUploadingStates(prev => ({ ...prev, [item.id]: false }));
        }
    };

    const handleTemplateDownload = async (item: BulkUploadItem, format: string = 'csv') => {
        setDownloadingStates(prev => ({ ...prev, [item.id]: true }));

        try {
            let templateUrl = '';
            let downloadFileName = '';

            // Use static files for all templates
            if (item.id === 'courses') {
                templateUrl = '/templates/sample_courses_filled.xlsx';
                downloadFileName = 'sample_courses_filled.xlsx';
            } else if (item.id === 'instructors') {
                templateUrl = '/templates/instructor_bulk_uploads_template.xlsx';
                downloadFileName = 'instructor_bulk_uploads_template.xlsx';
            } else if (item.id === 'curriculum') {
                templateUrl = '/templates/curriculum_bulk_uploads_template.xlsx';
                downloadFileName = 'curriculum_bulk_uploads_template.xlsx';
            } else if (item.id === 'notices') {
                templateUrl = '/templates/notice_bulk_uploads_template.xlsx';
                downloadFileName = 'notice_bulk_uploads_template.xlsx';
            } else if (item.id === 'promotions') {
                templateUrl = '/templates/promotin_bulk_uploads_template.xlsx';
                downloadFileName = 'promotin_bulk_uploads_template.xlsx';
            } else if (item.id === 'reviews') {
                templateUrl = '/templates/review_bulk_uploads_template.xlsx';
                downloadFileName = 'review_bulk_uploads_template.xlsx';
            } else if (item.id === 'training-schedules') {
                templateUrl = '/templates/test_training_schedule.xlsx';
                downloadFileName = 'test_training_schedule.xlsx';
            } else {
                // Fallback to backend API if template not found
                const baseUrl = process.env.NEXT_PUBLIC_BASE_API || 'https://classcrew.onrender.com/api';
                templateUrl = `${baseUrl}/courses/bulk-upload/template?format=${format}`;
                downloadFileName = `${item.id}_template.${format}`;
            }

            // Create a temporary link and click it
            const a = document.createElement('a');
            a.href = templateUrl;
            a.download = downloadFileName;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.success(`${item.title} template download started!`);
        } catch (error) {
            console.error('Template Download Error:', error);
            toast.error('Error downloading template');
        } finally {
            setDownloadingStates(prev => ({ ...prev, [item.id]: false }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-[var(--primary)] mb-4">
                    Bulk Upload Management
                </h1>
                <p className="text-center text-gray-600 mb-12 text-lg">
                    Upload multiple records at once using CSV or XLSX files
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bulkUploadItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border-2 border-[var(--primary)] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-3xl mb-4 mx-auto`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[var(--primary)] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {item.description}
                                </p>
                            </div>

                            {/* File Upload Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--primary)] mb-2">
                                        Select File (CSV or XLSX)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleFileUpload(item, file);
                                            }
                                        }}
                                        className="w-full border-2 border-[var(--primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-blue-700"
                                        disabled={uploadingStates[item.id]}
                                    />
                                </div>

                                {/* Upload Status */}
                                {uploadingStates[item.id] && (
                                    <div className="flex items-center justify-center py-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--primary)]"></div>
                                        <span className="ml-2 text-sm text-[var(--primary)]">Uploading...</span>
                                    </div>
                                )}

                                {/* Template Download */}
                                <div className="border-t pt-4">
                                    <p className="text-xs text-gray-500 mb-2">
                                        Need a template? Download sample file:
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTemplateDownload(item, 'csv')}
                                            disabled={downloadingStates[item.id]}
                                            className="flex-1 bg-gray-500 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-gray-600 transition disabled:bg-gray-400"
                                        >
                                            {downloadingStates[item.id] ? 'Downloading...' : 'CSV Template'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-red-500 mt-1">
                                        Download template first and follow the exact column names!
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instructions Section */}
                <div className="mt-12 bg-white border-2 border-[var(--primary)] rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-[var(--primary)] mb-6 text-center">
                        Bulk Upload Instructions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
                                How to Use Bulk Upload
                            </h3>
                            <ol className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="bg-[var(--primary)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                                    Download the template file (CSV or XLSX format)
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-[var(--primary)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                                    Fill in your data following the template structure
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-[var(--primary)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                                    Save the file and upload it using the file selector
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-[var(--primary)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                                    Wait for the upload to complete and check the results
                                </li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
                                Important Notes
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Only CSV and XLSX files are supported
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Follow the exact column names in templates
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Required fields must not be empty
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Large files may take longer to process
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Check console for detailed error messages
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}