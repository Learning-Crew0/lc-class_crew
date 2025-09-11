


"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Navbar from "@/components/layout/navbar/page"; 

import "./calendar-custom.css";

export default function CalendarPage() {
  const [events] = useState([
    {
      title: "[중분류] 과정명",
      start: "2025-09-08",
      end: "2025-09-10",
      color: "#93c5fd",
    },
    {
      title: "[중분류] 과정명",
      start: "2025-09-09",
      end: "2025-09-11",
      color: "#86efac",
    },
    {
      title: "[중분류] 과정명",
      start: "2025-07-17",
      color: "#facc15",
    },
  ]);

  return (
    <>
    <Navbar/>
         <main className="w-[1270px] mx-auto mt-16 flex flex-col items-center mb-10">
      <div className=" w-full bg-white rounded-2xl  p-6 ">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          buttonText={{
            today: "오늘",
            month: "월",
            week: "주",
          }}
          events={events}
          editable={true}
          selectable={true}
          height="auto"
        />
      </div>
    </main>
    </>
  );
}
