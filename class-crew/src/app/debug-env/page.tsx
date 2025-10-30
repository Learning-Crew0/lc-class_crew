"use client";

export default function DebugEnvPage() {
    const envVars = {
        NEXT_PUBLIC_BASE_API: process.env.NEXT_PUBLIC_BASE_API,
        NODE_ENV: process.env.NODE_ENV,
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Environment Debug</h1>

            <div className="bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
                <pre className="text-sm">
                    {JSON.stringify(envVars, null, 2)}
                </pre>
            </div>

            <div className="mt-6 bg-blue-100 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Runtime Check</h2>
                <p>Current time: {new Date().toISOString()}</p>
                <p>Window available: {typeof window !== 'undefined' ? 'Yes' : 'No'}</p>
            </div>

            <div className="mt-6 bg-green-100 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">API URL Test</h2>
                <p>Base URL: {process.env.NEXT_PUBLIC_BASE_API || 'NOT SET'}</p>
                <p>Full courses URL: {(process.env.NEXT_PUBLIC_BASE_API || 'NOT SET') + '/courses'}</p>
                <p>Full banners URL: {(process.env.NEXT_PUBLIC_BASE_API || 'NOT SET') + '/banner?isActive=true'}</p>
            </div>
        </div>
    );
}