"use client";

import { useState } from "react";
import { createCoalitionApplication } from "@/utils/api";

export default function TestCoalition() {
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const testAPI = async () => {
        setLoading(true);
        setResult("Testing...");

        try {
            // Create test FormData
            const formData = new FormData();
            formData.append("name", "Test User");
            formData.append("affiliation", "Test Organization");
            formData.append("field", "Test Field");
            formData.append("contact", "01012345678");
            formData.append("email", "test@example.com");

            // Create a dummy file
            const dummyFile = new File(["test content"], "test.txt", { type: "text/plain" });
            formData.append("file", dummyFile);

            console.log("Sending test data to coalition API...");

            const response = await createCoalitionApplication(formData);

            setResult(JSON.stringify(response, null, 2));
            console.log("Coalition API Response:", response);

        } catch (error) {
            console.error("Coalition API Error:", error);
            setResult(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testDirectFetch = async () => {
        setLoading(true);
        setResult("Testing direct fetch...");

        try {
            const formData = new FormData();
            formData.append("name", "Test User Direct");
            formData.append("affiliation", "Test Organization Direct");
            formData.append("field", "Test Field Direct");
            formData.append("contact", "01012345678");
            formData.append("email", "testdirect@example.com");

            const dummyFile = new File(["test content direct"], "test-direct.txt", { type: "text/plain" });
            formData.append("file", dummyFile);

            console.log("Testing direct fetch to API...");

            const response = await fetch("https://classcrew.onrender.com/api/coalitions", {
                method: "POST",
                body: formData,
                mode: "cors",
                credentials: "omit"
            });

            const data = await response.json();

            setResult(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
            console.log("Direct fetch response:", { status: response.status, data });

        } catch (error) {
            console.error("Direct fetch error:", error);
            setResult(`Direct fetch error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Coalition API Test</h1>

            <div className="space-y-4">
                <button
                    onClick={testAPI}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Testing..." : "Test Coalition API (via utils/api)"}
                </button>

                <button
                    onClick={testDirectFetch}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
                >
                    {loading ? "Testing..." : "Test Direct Fetch"}
                </button>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Result:</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                    {result || "No test run yet"}
                </pre>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Environment Info:</h2>
                <pre className="bg-gray-100 p-4 rounded">
                    {`API Base URL: ${process.env.NEXT_PUBLIC_BASE_API || 'Not set'}
Current URL: ${typeof window !== 'undefined' ? window.location.origin : 'Server side'}`}
                </pre>
            </div>
        </div>
    );
}