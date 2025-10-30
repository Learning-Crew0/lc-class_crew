"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
  getAllCourses,
  getCourseById,
  getCourseCurriculum,
  upsertCourseCurriculum,
  getCourseInstructor,
  upsertCourseInstructor,
  getCoursePromotions,
  addCoursePromotions,
  getCourseReviews,
  addCourseReview,
  deleteCourseReview,
  addOrUpdateCourseNotice
} from "@/utils/api";

interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: {
    _id: string;
    title: string;
  };
  price?: number;
  discountedPrice?: number;
  duration?: string;
  level?: string;
  language?: string;
  mainImage?: string;
  whatYouWillLearn?: string[];
  requirements?: string[];
  isActive?: boolean;
}





interface Promotion {
  _id?: string;
  courseId: string;
  images: string[];
  description?: string;
}

interface Review {
  _id?: string;
  courseId: string;
  reviewerName: string;
  avatar?: string;
  text: string;
  createdAt?: string;
}

const CoursePage = () => {
  const searchParams = useSearchParams();
  const courseIdFromUrl = searchParams.get("courseId");

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseIdFromUrl || "");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [promotions, setPromotions] = useState<Promotion | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Form states
  const [curriculumForm, setCurriculumForm] = useState({
    keywords: [""],
    modules: [{ name: "", content: "" }],
  });

  const [instructorForm, setInstructorForm] = useState({
    name: "",
    bio: "",
    professionalField: "",
    certificates: [""],
    attendanceHistory: [""],
  });

  const [promotionForm, setPromotionForm] = useState({
    description: "",
    images: null as FileList | null,
  });

  const [reviewForm, setReviewForm] = useState({
    reviewerName: "",
    avatar: "",
    text: "",
  });

  const [noticeForm, setNoticeForm] = useState({
    description: "",
    image: null as File | null,
  });

  // Utility functions for array manipulation
  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<{
    name: string;
    bio: string;
    professionalField: string;
    certificates: string[];
    attendanceHistory: string[];
  }>>, fieldName: keyof typeof instructorForm) => {
    setter((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] as string[]), ""]
    }));
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<{
    name: string;
    bio: string;
    professionalField: string;
    certificates: string[];
    attendanceHistory: string[];
  }>>, fieldName: keyof typeof instructorForm, index: number) => {
    setter((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] as string[]).filter((_, idx) => idx !== index)
    }));
  };

  const updateArrayItem = (setter: React.Dispatch<React.SetStateAction<{
    name: string;
    bio: string;
    professionalField: string;
    certificates: string[];
    attendanceHistory: string[];
  }>>, fieldName: keyof typeof instructorForm, index: number, value: string) => {
    setter((prev) => {
      const newArray = [...(prev[fieldName] as string[])];
      newArray[index] = value;
      return {
        ...prev,
        [fieldName]: newArray
      };
    });
  };

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load course data when course is selected
  useEffect(() => {
    if (selectedCourseId) {
      loadCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId]);

  const loadCourses = async () => {
    try {
      const response = await getAllCourses();
      console.log("Courses API response:", response); // Debug log
      if (response.success) {
        // Handle different response structures
        const coursesData = (response.data as { courses?: Course[] })?.courses || (response as { courses?: Course[] }).courses || [];
        console.log("Courses data:", coursesData); // Debug log
        setCourses(coursesData);
      } else {
        toast.error(response.message || "Failed to load courses");
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    }
  };

  const loadCourseData = async () => {
    if (!selectedCourseId) return;

    try {
      setIsLoading(true);

      // Load course details
      const courseResponse = await getCourseById(selectedCourseId);
      if (courseResponse.success && courseResponse.data) {
        setSelectedCourse(courseResponse.data as Course);
      }

      // Load curriculum
      const curriculumResponse = await getCourseCurriculum(selectedCourseId);
      if (curriculumResponse.success && curriculumResponse.data) {
        const curriculumData = curriculumResponse.data as { keywords?: string[]; modules?: { name: string; content: string }[] };
        setCurriculumForm({
          keywords: curriculumData.keywords || [""],
          modules: curriculumData.modules || [{ name: "", content: "" }],
        });
      }

      // Load instructor
      const instructorResponse = await getCourseInstructor(selectedCourseId);
      if (instructorResponse.success && instructorResponse.data) {
        const instructorData = instructorResponse.data as {
          name?: string;
          bio?: string;
          professionalField?: string;
          certificates?: string[];
          attendanceHistory?: string[];
        };
        setInstructorForm({
          name: instructorData.name || "",
          bio: instructorData.bio || "",
          professionalField: instructorData.professionalField || "",
          certificates: instructorData.certificates || [""],
          attendanceHistory: instructorData.attendanceHistory || [""],
        });
      }

      // Load promotions
      const promotionsResponse = await getCoursePromotions(selectedCourseId);
      if (promotionsResponse.success && promotionsResponse.data) {
        setPromotions(promotionsResponse.data as Promotion);
      }

      // Load reviews
      const reviewsResponse = await getCourseReviews(selectedCourseId);
      if (reviewsResponse.success && reviewsResponse.data) {
        setReviews((reviewsResponse.data as Review[]) || []);
      }

    } catch (error) {
      console.error("Error loading course data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form handlers
  const handleCurriculumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    try {
      setIsLoading(true);
      const response = await upsertCourseCurriculum(selectedCourseId, curriculumForm);
      if (response.success) {
        toast.success("Curriculum saved successfully!");
        loadCourseData(); // Reload data
      } else {
        toast.error(response.message || "Failed to save curriculum");
      }
    } catch (error) {
      console.error("Error saving curriculum:", error);
      toast.error("Failed to save curriculum");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstructorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    try {
      setIsLoading(true);
      const response = await upsertCourseInstructor(selectedCourseId, instructorForm);
      if (response.success) {
        toast.success("Instructor saved successfully!");
        loadCourseData(); // Reload data
      } else {
        toast.error(response.message || "Failed to save instructor");
      }
    } catch (error) {
      console.error("Error saving instructor:", error);
      toast.error("Failed to save instructor");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("description", promotionForm.description);

      if (promotionForm.images) {
        Array.from(promotionForm.images).forEach((file) => {
          formData.append("promotions", file);
        });
      }

      const response = await addCoursePromotions(selectedCourseId, formData);
      if (response.success) {
        toast.success("Promotion added successfully!");
        setPromotionForm({ description: "", images: null });
        loadCourseData(); // Reload data
      } else {
        toast.error(response.message || "Failed to add promotion");
      }
    } catch (error) {
      console.error("Error adding promotion:", error);
      toast.error("Failed to add promotion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    try {
      setIsLoading(true);
      const response = await addCourseReview(selectedCourseId, reviewForm);
      if (response.success) {
        toast.success("Review added successfully!");
        setReviewForm({ reviewerName: "", avatar: "", text: "" });
        loadCourseData(); // Reload data
      } else {
        toast.error(response.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("description", noticeForm.description);

      if (noticeForm.image) {
        formData.append("noticeImage", noticeForm.image);
      }

      const response = await addOrUpdateCourseNotice(selectedCourseId, formData);
      if (response.success) {
        toast.success("Notice saved successfully!");
        setNoticeForm({ description: "", image: null });
      } else {
        toast.error(response.message || "Failed to save notice");
      }
    } catch (error) {
      console.error("Error saving notice:", error);
      toast.error("Failed to save notice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!selectedCourseId || !confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await deleteCourseReview(selectedCourseId, reviewId);
      if (response.success) {
        toast.success("Review deleted successfully!");
        loadCourseData(); // Reload data
      } else {
        toast.error(response.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };



  // Render forms
  const renderForm = () => {
    const commonFormClasses = "max-w-4xl mx-auto bg-gray-50 border-2 border-[var(--primary)] rounded-2xl shadow-lg p-8 space-y-6";
    const inputClasses = "border-2 border-[var(--primary)] rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition";
    const buttonClasses = "bg-[var(--primary)] text-white py-3 px-6 rounded-xl font-bold hover:bg-white hover:text-[var(--primary)] hover:border-2 hover:border-[var(--primary)] transition disabled:bg-gray-400";

    switch (activeTab) {
      case "curriculum":
        return (
          <form className={commonFormClasses} onSubmit={handleCurriculumSubmit}>
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">Manage Curriculum</h2>

            {/* Keywords Section */}
            <div>
              <label className="block font-semibold mb-3 text-[var(--primary)]">Keywords:</label>
              {curriculumForm.keywords.map((keyword, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className={inputClasses}
                    value={keyword}
                    onChange={(e) => {
                      const newKeywords = [...curriculumForm.keywords];
                      newKeywords[idx] = e.target.value;
                      setCurriculumForm({ ...curriculumForm, keywords: newKeywords });
                    }}
                    placeholder="Enter keyword"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newKeywords = curriculumForm.keywords.filter((_, i) => i !== idx);
                      setCurriculumForm({ ...curriculumForm, keywords: newKeywords });
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold"
                    disabled={curriculumForm.keywords.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCurriculumForm({ ...curriculumForm, keywords: [...curriculumForm.keywords, ""] })}
                className="text-[var(--primary)] hover:underline font-semibold"
              >
                + Add Keyword
              </button>
            </div>

            {/* Modules Section */}
            <div>
              <label className="block font-semibold mb-3 text-[var(--primary)]">Modules:</label>
              {curriculumForm.modules.map((module, idx) => (
                <div key={idx} className="border-2 border-[var(--primary)] rounded-xl p-4 mb-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-[var(--primary)]">Module {idx + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newModules = curriculumForm.modules.filter((_, i) => i !== idx);
                        setCurriculumForm({ ...curriculumForm, modules: newModules });
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                      disabled={curriculumForm.modules.length === 1}
                    >
                      Remove Module
                    </button>
                  </div>
                  <input
                    type="text"
                    className={`${inputClasses} mb-3`}
                    value={module.name}
                    onChange={(e) => {
                      const newModules = [...curriculumForm.modules];
                      newModules[idx] = { ...module, name: e.target.value };
                      setCurriculumForm({ ...curriculumForm, modules: newModules });
                    }}
                    placeholder="Module name"
                  />
                  <textarea
                    className={inputClasses}
                    value={module.content}
                    onChange={(e) => {
                      const newModules = [...curriculumForm.modules];
                      newModules[idx] = { ...module, content: e.target.value };
                      setCurriculumForm({ ...curriculumForm, modules: newModules });
                    }}
                    placeholder="Module content"
                    rows={4}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCurriculumForm({ ...curriculumForm, modules: [...curriculumForm.modules, { name: "", content: "" }] })}
                className="text-[var(--primary)] hover:underline font-semibold"
              >
                + Add Module
              </button>
            </div>

            <button className={buttonClasses} type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Curriculum"}
            </button>
          </form>
        );

      case "instructor":
        return (
          <form className={commonFormClasses} onSubmit={handleInstructorSubmit}>
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">Manage Instructor</h2>

            <div>
              <label className="block font-semibold mb-2 text-[var(--primary)]">Instructor Name:</label>
              <input
                type="text"
                className={inputClasses}
                value={instructorForm.name}
                onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                placeholder="Enter instructor name"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-[var(--primary)]">Bio:</label>
              <textarea
                className={inputClasses}
                value={instructorForm.bio}
                onChange={(e) => setInstructorForm({ ...instructorForm, bio: e.target.value })}
                placeholder="Enter instructor bio"
                rows={4}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-[var(--primary)]">Professional Field:</label>
              <input
                type="text"
                className={inputClasses}
                value={instructorForm.professionalField}
                onChange={(e) => setInstructorForm({ ...instructorForm, professionalField: e.target.value })}
                placeholder="Enter professional field"
              />
            </div>

            {/* Certificates Section */}
            <div>
              <label className="block font-semibold mb-3 text-[var(--primary)]">Certificates:</label>
              {instructorForm.certificates.map((cert, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className={inputClasses}
                    value={cert}
                    onChange={(e) => {
                      const newCertificates = [...instructorForm.certificates];
                      newCertificates[idx] = e.target.value;
                      setInstructorForm({ ...instructorForm, certificates: newCertificates });
                    }}
                    placeholder="Enter certificate"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(setInstructorForm, "certificates", idx)}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold"
                    disabled={instructorForm.certificates.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(setInstructorForm, "certificates")}
                className="text-[var(--primary)] hover:underline font-semibold"
              >
                + Add Certificate
              </button>
            </div>

            {/* Attendance History Section */}
            <div>
              <label className="block font-semibold mb-3 text-[var(--primary)]">Attendance History:</label>
              {instructorForm.attendanceHistory.map((record, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className={inputClasses}
                    value={record}
                    onChange={(e) => updateArrayItem(setInstructorForm, "attendanceHistory", idx, e.target.value)}
                    placeholder="Enter attendance record"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(setInstructorForm, "attendanceHistory", idx)}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold"
                    disabled={instructorForm.attendanceHistory.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(setInstructorForm, "attendanceHistory")}
                className="text-[var(--primary)] hover:underline font-semibold"
              >
                + Add Record
              </button>
            </div>

            <button className={buttonClasses} type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Instructor"}
            </button>
          </form>
        );

      case "promotion":
        return (
          <div className={commonFormClasses}>
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">Manage Promotions</h2>

            {/* Add New Promotion Form */}
            <form onSubmit={handlePromotionSubmit} className="space-y-4 border-b border-[var(--primary)] pb-6 mb-6">
              <h3 className="text-lg font-semibold text-[var(--primary)]">Add New Promotion</h3>

              <div>
                <label className="block font-semibold mb-2 text-[var(--primary)]">Description:</label>
                <textarea
                  className={inputClasses}
                  value={promotionForm.description}
                  onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
                  placeholder="Enter promotion description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-[var(--primary)]">Images:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className={inputClasses}
                  onChange={(e) => setPromotionForm({ ...promotionForm, images: e.target.files })}
                />
                <p className="text-sm text-gray-500 mt-1">Select multiple images (max 8)</p>
              </div>

              <button className={buttonClasses} type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Promotion"}
              </button>
            </form>

            {/* Existing Promotions */}
            {promotions && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">Current Promotions</h3>
                <div className="border-2 border-[var(--primary)] rounded-xl p-4 bg-white">
                  <p className="text-gray-600 mb-3">{promotions.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {promotions.images.map((image, idx) => (
                      <div key={idx} className="relative w-full h-24">
                        <Image
                          src={image}
                          alt={`Promotion ${idx + 1}`}
                          fill
                          className="object-cover rounded-lg border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "recommended":
        return (
          <div className={commonFormClasses}>
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">Manage Reviews</h2>

            {/* Add New Review Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 border-b border-[var(--primary)] pb-6 mb-6">
              <h3 className="text-lg font-semibold text-[var(--primary)]">Add New Review</h3>

              <div>
                <label className="block font-semibold mb-2 text-[var(--primary)]">Reviewer Name:</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={reviewForm.reviewerName}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                  placeholder="Enter reviewer name"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-[var(--primary)]">Avatar URL (optional):</label>
                <input
                  type="url"
                  className={inputClasses}
                  value={reviewForm.avatar}
                  onChange={(e) => setReviewForm({ ...reviewForm, avatar: e.target.value })}
                  placeholder="Enter avatar URL"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-[var(--primary)]">Review Text:</label>
                <textarea
                  className={inputClasses}
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  placeholder="Enter review text"
                  rows={4}
                  required
                />
              </div>

              <button className={buttonClasses} type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Review"}
              </button>
            </form>

            {/* Existing Reviews */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">Current Reviews ({reviews.length})</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-2 border-[var(--primary)] rounded-xl p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {review.avatar && (
                            <div className="relative w-10 h-10">
                              <Image
                                src={review.avatar}
                                alt={review.reviewerName}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                          )}
                          <h4 className="font-semibold text-[var(--primary)]">{review.reviewerName}</h4>
                        </div>
                        <p className="text-gray-600">{review.text}</p>
                        {review.createdAt && (
                          <p className="text-sm text-gray-400 mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review._id!)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                )}
              </div>
            </div>
          </div>
        );

      case "notice":
        return (
          <form className={commonFormClasses} onSubmit={handleNoticeSubmit}>
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">Manage Notice</h2>

            <div>
              <label className="block font-semibold mb-2 text-[var(--primary)]">Notice Description:</label>
              <textarea
                className={inputClasses}
                value={noticeForm.description}
                onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                placeholder="Enter notice description"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-[var(--primary)]">Notice Image (optional):</label>
              <input
                type="file"
                accept="image/*"
                className={inputClasses}
                onChange={(e) => setNoticeForm({ ...noticeForm, image: e.target.files?.[0] || null })}
              />
            </div>

            <button className={buttonClasses} type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Notice"}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[var(--primary)] mb-8">
          Course Content Management
        </h1>

        {/* Course Selection */}
        <div className="bg-gray-50 border-2 border-[var(--primary)] rounded-2xl shadow-lg p-6 mb-8">
          <label className="block font-semibold mb-3 text-[var(--primary)]">Select Course:</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full border-2 border-[var(--primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">Choose a course...</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>

          {selectedCourse && (
            <div className="mt-4 p-4 bg-white border-2 border-[var(--primary)] rounded-xl">
              <h3 className="font-bold text-lg text-[var(--primary)]">{selectedCourse.title}</h3>
              <p className="text-gray-600">{selectedCourse.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>Level: {selectedCourse.level}</span>
                <span>Duration: {selectedCourse.duration}</span>
                <span>Price: ₹{selectedCourse.discountedPrice || selectedCourse.price}</span>
              </div>
            </div>
          )}
        </div>

        {selectedCourseId && (
          <>
            {/* Tab Navigation */}
            <div className="bg-gray-50 border-2 border-[var(--primary)] rounded-t-2xl shadow-lg">
              <div className="flex border-b border-[var(--primary)]">
                {[
                  { key: 'curriculum', label: 'Curriculum' },
                  { key: 'instructor', label: 'Instructor' },
                  { key: 'promotion', label: 'Promotions' },
                  { key: 'recommended', label: 'Reviews' },
                  { key: 'notice', label: 'Notice' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-4 px-6 font-semibold transition ${activeTab === tab.key
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--primary)] hover:bg-white'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 border-2 border-t-0 border-[var(--primary)] rounded-b-2xl shadow-lg">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-[var(--primary)]">Loading...</div>
                </div>
              ) : (
                renderForm()
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Wrapper component with Suspense boundary
export default function CoursePageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <CoursePage />
    </Suspense>
  );
}