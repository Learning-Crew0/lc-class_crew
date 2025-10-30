"use client";

import { useState } from "react";

interface LectureFile {
  id: number;
  course: string;
  lecture: string;
  process: string;
  fileName: string;
}

export default function CourseFilesPage() {
  const [course, setCourse] = useState("");
  const [lecture, setLecture] = useState("");
  const [process, setProcess] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<LectureFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !lecture || !process || !file) {
      alert("Please fill all fields and upload a file");
      return;
    }

    const newFile: LectureFile = {
      id: Date.now(),
      course,
      lecture,
      process,
      fileName: file.name,
    };

    setFiles((prev) => [...prev, newFile]);

    // reset
    setCourse("");
    setLecture("");
    setProcess("");
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-extrabold mb-10 text-center">
         Course Lecture Files
      </h1>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white border-2 border-black rounded-2xl shadow-lg p-8 space-y-6"
      >
        <div>
          <label className="block font-semibold mb-2">Course</label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full border-2 border-black rounded-xl px-4 py-3"
            placeholder="Enter course name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Lecture</label>
          <input
            type="text"
            value={lecture}
            onChange={(e) => setLecture(e.target.value)}
            className="w-full border-2 border-black rounded-xl px-4 py-3"
            placeholder="Enter lecture name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Process</label>
          <input
            type="text"
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            className="w-full border-2 border-black rounded-xl px-4 py-3"
            placeholder="Enter process name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Upload File</label>
          <input
            type="file"
            accept=".pdf,.xlsx,.xls"
            onChange={handleFileChange}
            className="w-full border-2 border-dashed border-black rounded-xl px-4 py-3 cursor-pointer"
          />
          {file && (
            <p className="mt-2 text-sm font-medium italic">
              Selected: {file.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-black hover:border-2 hover:border-black transition"
        >
          Upload File
        </button>
      </form>

      {/* Uploaded Files Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6">Uploaded Files</h2>
        {files.length === 0 ? (
          <p className="text-gray-500 italic">No files uploaded yet.</p>
        ) : (
          <div className="space-y-6">
            {files.map((f) => (
              <div
                key={f.id}
                className="border-2 border-black rounded-xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{f.course}</h3>
                <p className="font-medium">Lecture: {f.lecture}</p>
                <p className="font-medium">Process: {f.process}</p>
                <p className="mt-2 italic">📄 {f.fileName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
