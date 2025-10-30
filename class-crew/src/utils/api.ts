const getBaseUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_BASE_API;
    const fallbackUrl = "https://classcrew.onrender.com/api";

    const baseUrl = envUrl || fallbackUrl;

    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

const BASE_URL = getBaseUrl();

interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    token?: string;
    user?: Record<string, unknown>;
    admin?: Record<string, unknown>;
    categories?: T;
    category?: Record<string, unknown>;
    products?: T;
    product?: Record<string, unknown>;
    banners?: T;
    banner?: Record<string, unknown>;
    courses?: T;
    course?: Record<string, unknown>;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalProducts: number;
        totalCourses?: number;
        totalBanners?: number;
        limit: number;
    };
    summary?: {
        totalProcessed: number;
        created: number;
        skipped: number;
        failed: number;
    };
    details?: Record<string, unknown>;
    validation?: Record<string, unknown>;
}

export const apiCall = async <T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = 2
): Promise<ApiResponse<T>> => {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const fullUrl = `${BASE_URL}${cleanEndpoint}`;

    console.log(`API Call: ${options.method || "GET"} ${fullUrl}`);

    // Check if body is FormData - if so, don't set Content-Type (let browser handle it)
    const isFormData = options.body instanceof FormData;
    const defaultHeaders: HeadersInit = isFormData
        ? { Accept: "application/json" }
        : { "Content-Type": "application/json", Accept: "application/json" };

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(fullUrl, {
                headers: {
                    ...defaultHeaders,
                    ...(options.headers as Record<string, string>),
                },
                mode: "cors",
                credentials: "omit",
                ...options,
            });

            console.log(
                `API Response Status: ${response.status} for ${fullUrl} (attempt ${attempt + 1})`
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error: ${response.status} - ${errorText}`);

                if (response.status >= 500 && attempt < retries) {
                    console.log(`Retrying in ${(attempt + 1) * 1000}ms...`);
                    await new Promise((resolve) =>
                        setTimeout(resolve, (attempt + 1) * 1000)
                    );
                    continue;
                }

                throw new Error(
                    `API request failed: ${response.status} - ${errorText}`
                );
            }

            const data = (await response.json()) as ApiResponse<T>;
            console.log(`API Response Data:`, data);

            return data;
        } catch (error) {
            console.error(`API Call Error (attempt ${attempt + 1}):`, error);

            if (
                attempt < retries &&
                (error instanceof TypeError ||
                    (error as Error).name === "NetworkError")
            ) {
                console.log(
                    `Network error, retrying in ${(attempt + 1) * 1000}ms...`
                );
                await new Promise((resolve) =>
                    setTimeout(resolve, (attempt + 1) * 1000)
                );
                continue;
            }

            throw error instanceof Error
                ? error
                : new Error("Unknown error occurred");
        }
    }

    throw new Error("All retry attempts failed");
};

export const registerUser = async (userData: {
    email: string;
    username: string;
    password: string;
    fullName: string;
    gender: string;
    memberType: string;
    phone: string;
    dob: string;
    agreements: {
        termsOfService: boolean;
        privacyPolicy: boolean;
        marketingConsent?: boolean;
    };
}) => {
    return apiCall("/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

export const loginUser = async (credentials: {
    emailOrUsername: string;
    password: string;
}) => {
    return apiCall("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
};

export const loginAdmin = async (credentials: {
    email?: string;
    username?: string;
    password: string;
}) => {
    return apiCall("/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
};

// Admin API functions
export const getAdminProfile = async (token: string) => {
    return apiCall("/admin/profile", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateAdminPassword = async (
    token: string,
    passwordData: {
        currentPassword: string;
        newPassword: string;
    }
) => {
    return apiCall("/admin/password", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
    });
};

export const createAdmin = async (
    token: string,
    adminData: {
        username: string;
        email: string;
        password: string;
        role?: string;
    }
) => {
    return apiCall("/admin", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
    });
};

export const getAllAdmins = async (
    token: string,
    page: number = 1,
    limit: number = 10
) => {
    return apiCall(`/admin?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateAdminStatus = async (
    token: string,
    adminId: string,
    isActive: boolean
) => {
    return apiCall(`/admin/${adminId}/status`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
    });
};

export const deleteAdmin = async (token: string, adminId: string) => {
    return apiCall(`/admin/${adminId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// Training Schedule API functions
export const getCourseTrainingSchedules = async (courseId: string) => {
    return apiCall(`/courses/${courseId}/training-schedules`);
};

export const addTrainingSchedule = async (
    token: string,
    courseId: string,
    scheduleData: {
        scheduleName: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        availableSeats?: number;
    }
) => {
    return apiCall(`/courses/${courseId}/training-schedules`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
    });
};

export const updateTrainingSchedule = async (
    token: string,
    courseId: string,
    scheduleId: string,
    updates: Record<string, unknown>
) => {
    return apiCall(`/courses/${courseId}/training-schedules/${scheduleId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });
};

export const deleteTrainingSchedule = async (
    token: string,
    courseId: string,
    scheduleId: string
) => {
    return apiCall(`/courses/${courseId}/training-schedules/${scheduleId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const enrollInSchedule = async (
    token: string,
    courseId: string,
    scheduleId: string
) => {
    return apiCall(
        `/courses/${courseId}/training-schedules/${scheduleId}/enroll`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// Category API functions
export const getAllCategories = async () => {
    return apiCall("/category");
};

export const getActiveCategories = async () => {
    return apiCall("/category?isActive=true");
};

export const getCategoryById = async (id: string) => {
    return apiCall(`/category/${id}`);
};

export const getCategoryWithCourses = async (id: string) => {
    return apiCall(`/category/${id}/courses`);
};

export const createCategory = async (categoryData: {
    title: string;
    description?: string;
    isActive?: boolean;
}) => {
    return apiCall("/category", {
        method: "POST",
        body: JSON.stringify(categoryData),
    });
};

export const updateCategory = async (
    id: string,
    categoryData: {
        title?: string;
        description?: string;
        isActive?: boolean;
    }
) => {
    return apiCall(`/category/${id}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
    });
};

export const deleteCategory = async (id: string) => {
    return apiCall(`/category/${id}`, {
        method: "DELETE",
    });
};

export const bulkUploadCategories = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiCall("/categories/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {},
    });
};

export const downloadCategoryTemplate = () => {
    window.location.href = `${BASE_URL}/categories/bulk-upload/template?format=csv`;
};

export const getCategoryUploadInstructions = async () => {
    return apiCall("/categories/bulk-upload/instructions");
};

export const getAllCourses = async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    search?: string;
}) => {
    const queryString = params
        ? new URLSearchParams(params as Record<string, string>).toString()
        : "";
    return apiCall(`/courses${queryString ? "?" + queryString : ""}`);
};

export const getCourseById = async (id: string) => {
    return apiCall(`/courses/${id}`);
};

export const createCourse = async (courseData: FormData) => {
    return apiCall("/courses", {
        method: "POST",
        body: courseData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const updateCourse = async (id: string, courseData: FormData) => {
    return apiCall(`/courses/${id}`, {
        method: "PUT",
        body: courseData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const deleteCourse = async (id: string) => {
    return apiCall(`/courses/${id}`, {
        method: "DELETE",
    });
};

// Curriculum API functions
export const getCourseCurriculum = async (courseId: string) => {
    return apiCall(`/courses/${courseId}/curriculum`);
};

export const upsertCourseCurriculum = async (
    courseId: string,
    curriculumData: {
        keywords: string[];
        modules: Array<{
            name: string;
            content: string;
        }>;
    }
) => {
    return apiCall(`/courses/${courseId}/curriculum`, {
        method: "POST",
        body: JSON.stringify(curriculumData),
    });
};

// Instructor API functions
export const getCourseInstructor = async (courseId: string) => {
    return apiCall(`/courses/${courseId}/instructor`);
};

export const upsertCourseInstructor = async (
    courseId: string,
    instructorData: {
        name: string;
        bio?: string;
        professionalField?: string;
        certificates?: string[];
        attendanceHistory?: string[];
    }
) => {
    return apiCall(`/courses/${courseId}/instructor`, {
        method: "POST",
        body: JSON.stringify(instructorData),
    });
};

// Promotion API functions
export const getCoursePromotions = async (courseId: string) => {
    return apiCall(`/courses/${courseId}/promotions`);
};

export const addCoursePromotions = async (
    courseId: string,
    promotionData: FormData
) => {
    return apiCall(`/courses/${courseId}/promotions`, {
        method: "POST",
        body: promotionData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const deleteCoursePromotion = async (
    courseId: string,
    promotionId: string,
    imageUrl?: string
) => {
    const queryString = imageUrl
        ? `?imageUrl=${encodeURIComponent(imageUrl)}`
        : "";
    return apiCall(
        `/courses/${courseId}/promotions/${promotionId}${queryString}`,
        {
            method: "DELETE",
        }
    );
};

// Review API functions (for recommendations)
export const getCourseReviews = async (courseId: string) => {
    return apiCall(`/courses/${courseId}/reviews`);
};

export const addCourseReview = async (
    courseId: string,
    reviewData: {
        reviewerName: string;
        avatar?: string;
        text: string;
    }
) => {
    return apiCall(`/courses/${courseId}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewData),
    });
};

export const deleteCourseReview = async (
    courseId: string,
    reviewId: string
) => {
    return apiCall(`/courses/${courseId}/reviews/${reviewId}`, {
        method: "DELETE",
    });
};

// Notice API functions
export const addOrUpdateCourseNotice = async (
    courseId: string,
    noticeData: FormData
) => {
    return apiCall(`/courses/${courseId}/notice`, {
        method: "POST",
        body: noticeData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

// Product Category API functions
export const getAllProductCategories = async () => {
    return apiCall("/product-categories");
};

export const getProductCategoryById = async (id: string) => {
    return apiCall(`/product-categories/${id}`);
};

export const createProductCategory = async (categoryData: {
    title: string;
    description?: string;
    order?: number;
    isActive?: boolean;
}) => {
    return apiCall("/product-categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
    });
};

export const updateProductCategory = async (
    id: string,
    categoryData: {
        title?: string;
        description?: string;
        order?: number;
        isActive?: boolean;
    }
) => {
    return apiCall(`/product-categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
    });
};

export const deleteProductCategory = async (id: string) => {
    return apiCall(`/product-categories/${id}`, {
        method: "DELETE",
    });
};

// Product API functions
export const getAllProducts = async (params?: {
    category?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}) => {
    const queryString = params
        ? new URLSearchParams(params as Record<string, string>).toString()
        : "";
    return apiCall(`/products${queryString ? "?" + queryString : ""}`);
};

export const getProductById = async (id: string) => {
    return apiCall(`/products/${id}`);
};

export const getProductsByCategory = async (
    categoryId: string,
    params?: {
        page?: number;
        limit?: number;
    }
) => {
    const queryString = params
        ? new URLSearchParams(params as Record<string, string>).toString()
        : "";
    return apiCall(
        `/products/category/${categoryId}${queryString ? "?" + queryString : ""}`
    );
};

export const createProduct = async (productData: FormData) => {
    return apiCall("/products", {
        method: "POST",
        body: productData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const updateProduct = async (id: string, productData: FormData) => {
    return apiCall(`/products/${id}`, {
        method: "PUT",
        body: productData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const deleteProduct = async (id: string) => {
    return apiCall(`/products/${id}`, {
        method: "DELETE",
    });
};

// Banner API functions
export const getAllBanners = async () => {
    return apiCall("/banner");
};

export const getActiveBanners = async () => {
    return apiCall("/banner?isActive=true");
};

export const getBannerById = async (id: string) => {
    return apiCall(`/banner/${id}`);
};

export const createBanner = async (bannerData: FormData) => {
    return apiCall("/banner", {
        method: "POST",
        body: bannerData,
        headers: {},
    });
};

export const updateBanner = async (id: string, bannerData: FormData) => {
    return apiCall(`/banner/${id}`, {
        method: "PUT",
        body: bannerData,
        headers: {},
    });
};

export const deleteBanner = async (id: string) => {
    return apiCall(`/banner/${id}`, {
        method: "DELETE",
    });
};

// Cart API functions
export const getCart = async (userId?: string) => {
    const queryString = userId ? `?userId=${userId}` : "";
    return apiCall(`/cart${queryString}`);
};

export const getCartSummary = async (userId?: string) => {
    const queryString = userId ? `?userId=${userId}` : "";
    return apiCall(`/cart/summary${queryString}`);
};

export const addToCart = async (cartData: {
    userId: string;
    productId: string;
    quantity: number;
}) => {
    return apiCall("/cart/add", {
        method: "POST",
        body: JSON.stringify(cartData),
    });
};

export const updateCartItem = async (
    productId: string,
    cartData: {
        userId: string;
        quantity: number;
    }
) => {
    return apiCall(`/cart/update/${productId}`, {
        method: "PUT",
        body: JSON.stringify(cartData),
    });
};

export const removeFromCart = async (
    productId: string,
    cartData: {
        userId: string;
    }
) => {
    return apiCall(`/cart/remove/${productId}`, {
        method: "DELETE",
        body: JSON.stringify(cartData),
    });
};

export const clearCart = async (cartData: { userId: string }) => {
    return apiCall("/cart/clear", {
        method: "DELETE",
        body: JSON.stringify(cartData),
    });
};

export const cleanCart = async (cartData: { userId: string }) => {
    return apiCall("/cart/clean", {
        method: "POST",
        body: JSON.stringify(cartData),
    });
};

export const bulkUploadCourses = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall("/courses/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const bulkUploadInstructors = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall("/instructors/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const bulkUploadCurriculum = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall("/curriculums/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const bulkUploadNotices = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall("/notices/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const bulkUploadPromotions = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall("/promotions/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const bulkUploadReviews = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall("/reviews/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const bulkUploadTrainingSchedules = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiCall("/training-schedules/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

// Template download functions - Using static files from public/templates
export const downloadCoursesTemplate = async (format: string = "csv") => {
    const templateUrl = '/templates/sample_courses_filled.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'sample_courses_filled.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadInstructorsTemplate = async (format: string = "csv") => {
    const templateUrl = '/templates/instructor_bulk_uploads_template.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'instructor_bulk_uploads_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadCurriculumTemplate = async (format: string = "csv") => {
    const templateUrl = '/templates/curriculum_bulk_uploads_template.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'curriculum_bulk_uploads_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadNoticesTemplate = async (format: string = "csv") => {
    const templateUrl = '/templates/notice_bulk_uploads_template.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'notice_bulk_uploads_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadPromotionsTemplate = async (format: string = "csv") => {
    const templateUrl = '/templates/promotin_bulk_uploads_template.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'promotin_bulk_uploads_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadReviewsTemplate = async (format: string = "csv") => {
    const templateUrl = '/templates/review_bulk_uploads_template.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'review_bulk_uploads_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadTrainingSchedulesTemplate = async (format: string = "csv") => {
    const templateUrl = '/templates/test_training_schedule.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'test_training_schedule.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



// Coalition API functions
export const createCoalitionApplication = async (
    formData: FormData
): Promise<ApiResponse> => {
    return apiCall("/coalitions", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const getCoalitionApplications = async (
    page: number = 1,
    limit: number = 10
): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall(`/coalitions?page=${page}&limit=${limit}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const getCoalitionApplicationById = async (
    id: string
): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall(`/coalitions/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const updateCoalitionStatus = async (
    id: string,
    status: string
): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall(`/coalitions/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status }),
    });
};

export const deleteCoalitionApplication = async (
    id: string
): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall(`/coalitions/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const getCoalitionStats = async (): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall("/coalitions/stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

// Enquiry API functions
export const createEnquiry = async (
    formData: FormData
): Promise<ApiResponse> => {
    return apiCall("/enquiries", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
    });
};

export const getEnquiries = async (
    page: number = 1,
    limit: number = 10,
    status?: string
): Promise<ApiResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (status) params.append("status", status);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall(`/enquiries?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const getEnquiryById = async (id: string): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall(`/enquiries/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const updateEnquiryStatus = async (
    id: string,
    status: string
): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall(`/enquiries/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status }),
    });
};

export const deleteEnquiry = async (id: string): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall(`/enquiries/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const getEnquiryStats = async (): Promise<ApiResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiCall("/enquiries/stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const getMyEnquiries = async (
    page: number = 1,
    limit: number = 10,
    status?: string
): Promise<ApiResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (status) params.append("status", status);

    return apiCall(`/enquiries/my-enquiries?${params.toString()}`);
};
