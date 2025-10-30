"use client";

import { useState, useEffect } from "react";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

interface Enquiry {
    _id: string;
    name: string;
    contact: {
        countryCode: string;
        phone: string;
    };
    email: string;
    category: string;
    subject: string;
    message: string;
    status: string;
    agreeToTerms: boolean;
    attachment?: string;
    company?: string;
    createdAt: string;
}

interface EnquiryResponse {
    enquiries: Enquiry[];
    pagination?: {
        totalPages: number;
    };
}

export default function ViewEnquiries() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("");

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await getEnquiries(currentPage, 10, statusFilter);

            if (response.success && response.data) {
                const data = response.data as { enquiries?: Enquiry[]; pagination?: { totalPages: number } };
                setEnquiries(data.enquiries || []);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages);
                }
            }
        } catch (error) {
            console.error("Error fetching enquiries:", error);
            toast.error("문의를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, [currentPage, statusFilter]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await updateEnquiryStatus(id, newStatus);

            if (response.success) {
                toast.success("상태가 업데이트되었습니다.");
                fetchEnquiries(); // Refresh the list
            } else {
                toast.error(
                    response.message || "상태 업데이트에 실패했습니다."
                );
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("상태 업데이트 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말로 이 문의를 삭제하시겠습니까?")) {
            return;
        }

        try {
            const response = await deleteEnquiry(id);

            if (response.success) {
                toast.success("문의가 삭제되었습니다.");
                fetchEnquiries(); // Refresh the list
            } else {
                toast.error(response.message || "삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error deleting enquiry:", error);
            toast.error("삭제 중 오류가 발생했습니다.");
        }
    };

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
                    문의 관리
                </h1>
                <p className="text-gray-600">
                    사용자 문의를 확인하고 관리하세요.
                </p>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                        상태 필터:
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">전체</option>
                        <option value="pending">대기중</option>
                        <option value="in progress">처리중</option>
                        <option value="resolved">완료</option>
                    </select>
                </div>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-gray-600">로딩 중...</p>
                    </div>
                ) : enquiries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        문의가 없습니다.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        이름
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        연락처
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        이메일
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        문의구분
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        액션
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {enquiries.map((enquiry) => (
                                    <tr
                                        key={enquiry._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {enquiry.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {enquiry.contact.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {enquiry.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getCategoryText(enquiry.category)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {enquiry.subject}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enquiry.status)}`}
                                            >
                                                {getStatusText(enquiry.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                                enquiry.createdAt
                                            ).toLocaleDateString("ko-KR")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={enquiry.status}
                                                    onChange={(e) =>
                                                        handleStatusUpdate(
                                                            enquiry._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="pending">
                                                        대기중
                                                    </option>
                                                    <option value="in progress">
                                                        처리중
                                                    </option>
                                                    <option value="resolved">
                                                        완료
                                                    </option>
                                                </select>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            enquiry._id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900 text-xs"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() =>
                                    setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                이전
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(totalPages, currentPage + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                다음
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    페이지{" "}
                                    <span className="font-medium">
                                        {currentPage}
                                    </span>{" "}
                                    /{" "}
                                    <span className="font-medium">
                                        {totalPages}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(1, currentPage - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        이전
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages,
                                                    currentPage + 1
                                                )
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        다음
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
