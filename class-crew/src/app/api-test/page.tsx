"use client";

import { useState, useEffect } from 'react';
import { debugApiConfig, testApiConnection } from '@/utils/debug';
import { getAllCourses, getActiveBanners } from '@/utils/api';

export default function ApiTestPage() {
    const [results, setResults] = useState<Record<string, unknown>>({});
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        const testResults: Record<string, unknown> = {};

        try {
            // Test 1: Debug configuration
            console.log('=== Running API Tests ===');
            testResults.config = debugApiConfig();

            // Test 2: Connection test
            testResults.connection = await testApiConnection();

            // Test 3: Courses API
            try {
                const coursesResponse = await getAllCourses({ limit: 5, page: 1 });
                const coursesData = (coursesResponse as unknown as { courses?: unknown[] }).courses;
                testResults.courses = {
                    success: true,
                    data: coursesResponse,
                    count: Array.isArray(coursesData) ? coursesData.length : 0
                };
            } catch (error) {
                testResults.courses = {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }

            // Test 4: Banners API
            try {
                const bannersResponse = await getActiveBanners();
                const bannersData = (bannersResponse as unknown as { banners?: unknown[] }).banners;
                testResults.banners = {
                    success: true,
                    data: bannersResponse,
                    count: Array.isArray(bannersData) ? bannersData.length : 0
                };
            } catch (error) {
                testResults.banners = {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }

            setResults(testResults);
        } catch (error) {
            console.error('Test suite failed:', error);
            testResults.error = error instanceof Error ? error.message : 'Unknown error';
            setResults(testResults);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runTests();
    }, []);

    const connectionResult = results.connection as { success?: boolean } | undefined;
    const coursesResult = results.courses as { success?: boolean; count?: number } | undefined;
    const bannersResult = results.banners as { success?: boolean; count?: number } | undefined;
    const errorResult = results.error as string | undefined;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">API Test Page</h1>

            <button
                onClick={runTests}
                disabled={loading}
                className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? 'Running Tests...' : 'Run Tests Again'}
            </button>

            <div className="space-y-6">
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">Configuration</h2>
                    <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(results.config, null, 2)}
                    </pre>
                </div>

                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">Connection Test</h2>
                    <div className={`p-2 rounded ${connectionResult?.success ? 'bg-green-200' : 'bg-red-200'}`}>
                        Status: {connectionResult?.success ? 'SUCCESS' : 'FAILED'}
                    </div>
                    <pre className="text-sm overflow-x-auto mt-2">
                        {JSON.stringify(results.connection, null, 2)}
                    </pre>
                </div>

                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">Courses API Test</h2>
                    <div className={`p-2 rounded ${coursesResult?.success ? 'bg-green-200' : 'bg-red-200'}`}>
                        Status: {coursesResult?.success ? 'SUCCESS' : 'FAILED'}
                        {coursesResult?.count && ` (${coursesResult.count} courses)`}
                    </div>
                    <pre className="text-sm overflow-x-auto mt-2 max-h-64">
                        {JSON.stringify(results.courses, null, 2)}
                    </pre>
                </div>

                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">Banners API Test</h2>
                    <div className={`p-2 rounded ${bannersResult?.success ? 'bg-green-200' : 'bg-red-200'}`}>
                        Status: {bannersResult?.success ? 'SUCCESS' : 'FAILED'}
                        {bannersResult?.count && ` (${bannersResult.count} banners)`}
                    </div>
                    <pre className="text-sm overflow-x-auto mt-2 max-h-64">
                        {JSON.stringify(results.banners, null, 2)}
                    </pre>
                </div>

                {errorResult && (
                    <div className="bg-red-100 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2 text-red-800">Test Suite Error</h2>
                        <p className="text-red-700">{errorResult}</p>
                    </div>
                )}
            </div>
        </div>
    );
}