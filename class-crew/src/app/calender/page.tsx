"use client";

import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import Navbar from "@/components/layout/navbar/page";
import Footer from "@/components/layout/footer/page";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import "./calendar-custom.css";

export default function CalendarPage() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [events] = useState([
    {
      id: "1",
      title: "[중분류] 과정명",
      start: "2025-10-08",
      end: "2025-10-09",
      backgroundColor: "#B8E6F5",
      borderColor: "transparent",
    },
    {
      id: "2",
      title: "[중분류] 과정명",
      start: "2025-10-09",
      end: "2025-10-15",
      backgroundColor: "#FFE4B5",
      borderColor: "opaque",
    },
    {
      id: "3",
      title: "[중분류] 과정명",
      start: "2025-07-11",
      backgroundColor: "#C8E6C9",
      borderColor: "transparent",
    },
    {
      id: "4",
      title: "[중분류] 과정명",
      start: "2025-07-12",
      backgroundColor: "#F8BBD0",
      borderColor: "transparent",
    },
    {
      id: "5",
      title: "[중분류] 과정명",
      start: "2025-07-17",
      backgroundColor: "#FFF9C4",
      borderColor: "transparent",
    },
    {
      id: "6",
      title: "[중분류] 과정명",
      start: "2025-07-17",
      end: "2025-07-18",
      backgroundColor: "#B8E6F5",
      borderColor: "transparent",
    },
    {
      id: "7",
      title: "[중분류] 과정명",
      start: "2025-07-18",
      backgroundColor: "#E1BEE7",
      borderColor: "transparent",
    },
  ]);

  const handleDownload = async () => {
    if (!calendarRef.current) return;

    try {
      // Get only the calendar element (without navbar/footer)
      const calendarElement = calendarRef.current.querySelector('.fc') as HTMLElement;
      if (!calendarElement) return;

      // Show loading message
      const loadingToast = document.createElement("div");
      loadingToast.textContent = "PDF 생성 중...";
      loadingToast.style.cssText = "position: fixed; top: 20px; right: 20px; background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; z-index: 9999; font-family: sans-serif;";
      document.body.appendChild(loadingToast);

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture only the calendar
      const canvas = await html2canvas(calendarElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: calendarElement.offsetWidth,
        height: calendarElement.offsetHeight,
      });

      // Create PDF with appropriate size
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // Add image to PDF
      if (imgHeight <= pageHeight) {
        // Fits in one page
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages needed
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      // Generate filename with current year-month
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const filename = `연간일정_${year}-${month}.pdf`;

      // Save PDF
      pdf.save(filename);

      // Remove loading message
      document.body.removeChild(loadingToast);

      // Show success message
      const successToast = document.createElement("div");
      successToast.textContent = "PDF 다운로드 완료!";
      successToast.style.cssText = "position: fixed; top: 20px; right: 20px; background: #10b981; color: #fff; padding: 12px 24px; border-radius: 8px; z-index: 9999; font-family: sans-serif;";
      document.body.appendChild(successToast);
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast);
        }
      }, 3000);

    } catch (error) {
      console.error("PDF 생성 중 오류:", error);
      alert("PDF 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-[1270px] mx-auto mt-24 flex flex-col items-center mb-10">
        <div ref={calendarRef} className="w-full bg-white rounded-2xl p-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={koLocale}
            headerToolbar={{
              left: "",
              center: "prev title next",
              right: "customDownload",
            }}
            customButtons={{
              customDownload: {
                text: "연간일정 ⬇",
                click: handleDownload,
              },
            }}
            events={events}
            editable={false}
            selectable={true}
            height="auto"
            dayMaxEvents={3}
            eventDisplay="block"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
