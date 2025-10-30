"use client";
import { useEffect, useState } from 'react';

interface ApiCourse {
    _id: string;
    title: string;
    category?: {
        title?: string;
    };
    price: number;
    isActive: boolean;
    mainImage?: string;
    curriculum?: {
        keywords?: string[];
        modules?: unknown[];
    };
}

interface ApiResponse {
    success: boolean;
    courses: ApiCourse[];
}

export default function TestApiPage() {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const testApi = async () => {
            try {
                console.log('Testing API...');
                console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_API);

                const url = `${process.env.NEXT_PUBLIC_BASE_API}/courses?limit=3&page=1`;
                console.log('Fetching from:', url);

                const response = await fetch(url);
                console.log('Response status:', response.status);

                const result = await response.json();
                console.log('Response data:', result);

                setData(result);
            } catch (err) {
                console.error('API Error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        testApi();
    }, []);

    if (loading) return <div className="p-8">Loading API test...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
            <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold mb-2">Raw API Response:</h2>
                <pre className="bg-white p-4 rounded overflow-auto text-sm max-h-96">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>

            {data?.courses && Array.isArray(data.courses) && (
                <div className="mt-4 bg-blue-50 p-4 rounded">
                    <h2 className="font-bold mb-2">Courses Summary:</h2>
                    <p>Total courses: {data.courses.length}</p>
                    {data.courses.map((course: ApiCourse, index: number) => (
                        <div key={index} className="mt-2 p-2 bg-white rounded">
                            <p><strong>Title:</strong> {course.title || 'N/A'}</p>
                            <p><strong>ID:</strong> {course._id || 'N/A'}</p>
                            <p><strong>Category:</strong> {course.category?.title || 'N/A'}</p>
                            <p><strong>Price:</strong> {course.price || 'N/A'}</p>
                            <p><strong>Active:</strong> {course.isActive ? 'Yes' : 'No'}</p>
                            <p><strong>Main Image:</strong> {course.mainImage ? 'Yes' : 'No'}</p>
                            {course.curriculum && (
                                <div className="mt-2 p-2 bg-green-50 rounded">
                                    <p><strong>Curriculum:</strong></p>
                                    <p>Keywords: {course.curriculum.keywords?.join(', ') || 'None'}</p>
                                    <p>Modules: {course.curriculum.modules?.length || 0}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}