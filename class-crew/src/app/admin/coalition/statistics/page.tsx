"use client";

import { useState, useEffect } from "react";
import { getCoalitionStats } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

interface CoalitionStats {
    total: number;
    byStatus: {
        [key: string]: number;
    };
    byField: Array<{
        _id: string;
        count: number;
    }>;
}

export default function CoalitionStatistics() {
    const [stats, setStats] = useState<CoalitionStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await getCoalitionStats();

            if (response.success && response.data) {
                setStats(response.data as CoalitionStats);
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
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "대기중";
            case "approved":
                return "승인됨";
            case "rejected":
                return "거부됨";
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    제휴 신청 통계
                </h1>
                <p className="text-gray-600">제휴 신청 현황을 확인하세요.</p>
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
                                        전체 신청서
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
                                        {stats.byStatus?.pending || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            승인
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        승인됨
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats.byStatus?.approved || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            거부
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        거부됨
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats.byStatus?.rejected || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Applications section removed - backend doesn't provide this data */}
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
