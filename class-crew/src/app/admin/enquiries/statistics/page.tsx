"use client";

import { useState, useEffect } from "react";
import { getEnquiryStats } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

interface EnquiryStats {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    byCategory: Array<{
        category: string;
        count: number;
    }>;
    recentEnquiries: Array<{
        _id: string;
        name: string;
        category: string;
        subject: string;
        createdAt: string;
        status: string;
    }>;
}

export default function EnquiryStatistics() {
    const [stats, setStats] = useState<EnquiryStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await getEnquiryStats();

            if (response.success && response.data) {
                setStats(response.data as EnquiryStats);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("통계를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "in progress":
                return "bg-blue-100 text-blue-800";
            case "resolved":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "대기중";
            case "in progress":
                return "처리중";
            case "resolved":
                return "완료";
            default:
                return status;
        }
    };

    const getCategoryText = (category: string) => {
        switch (category) {
            case "General Question":
                return "일반문의";
            case "Technical Support":
                return "기술지원";
            case "Program Inquiry":
                return "프로그램문의";
            case "Payment Issue":
                return "결제문제";
            case "Partnership":
                return "제휴문의";
            case "Other":
                return "기타";
            default:
                return category;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    문의 통계
                </h1>
                <p className="text-gray-600">문의 현황을 확인하세요.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="ml-2 text-gray-600">로딩 중...</p>
                </div>
            ) : stats ? (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            전체
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        전체 문의
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats.total}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            대기
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        대기중
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats.pending}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            처리
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        처리중
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats.inProgress}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            완료
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        완료
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats.resolved}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Stats */}
                    {stats.byCategory && stats.byCategory.length > 0 && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    카테고리별 문의
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {stats.byCategory.map((category, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-sm font-medium text-gray-700">
                                                {getCategoryText(
                                                    category.category
                                                )}
                                            </span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {category.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Enquiries */}
                    {stats.recentEnquiries &&
                        stats.recentEnquiries.length > 0 && (
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        최근 문의
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    이름
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    카테고리
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    제목
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    상태
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    문의일
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {stats.recentEnquiries.map(
                                                (enquiry) => (
                                                    <tr
                                                        key={enquiry._id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {enquiry.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {getCategoryText(
                                                                enquiry.category
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                            {enquiry.subject}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enquiry.status)}`}
                                                            >
                                                                {getStatusText(
                                                                    enquiry.status
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(
                                                                enquiry.createdAt
                                                            ).toLocaleDateString(
                                                                "ko-KR"
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">
                        통계 데이터를 불러올 수 없습니다.
                    </p>
                </div>
            )}
        </div>
    );
}
