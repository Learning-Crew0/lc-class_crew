// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";

// export default function BannerPage() {
//   const [form, setForm] = useState({
//     headline: "",
//     subText: "",
//     mainText: "",
//     buttonText: "",
//     linkUrl: "",
//     displayStart: "",
//     displayEnd: "",
//     order: "",
//   });
//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const router = useRouter();

//   const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const isValidUrl = (url: string) => {
//     try {
//       if (!url) return true; // optional field
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const isValidISODate = (dateStr: string) => !isNaN(Date.parse(dateStr));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Required fields validation
//     if (!form.headline.trim()) return toast.error("Headline is required.");
//     if (!form.mainText.trim()) return toast.error("Main Text is required.");
//     if (!form.buttonText.trim()) return toast.error("Button Text is required.");
//     if (!form.displayStart.trim() || !isValidISODate(form.displayStart))
//       return toast.error("Valid Display Start date is required (ISO format).");
//     if (!form.displayEnd.trim() || !isValidISODate(form.displayEnd))
//       return toast.error("Valid Display End date is required (ISO format).");
//     if (!image) return toast.error("Banner Image is required.");
//     if (!form.order.trim() || isNaN(Number(form.order)))
//       return toast.error("Order must be a valid number.");
//     if (!isValidUrl(form.linkUrl)) return toast.error("Link URL must be valid.");

//     const formData = new FormData();
//     formData.append("headline", form.headline);
//     formData.append("subText", form.subText);
//     formData.append("mainText", form.mainText);
//     formData.append("buttonText", form.buttonText);
//     formData.append("linkUrl", form.linkUrl);
//     formData.append("displayPeriod[start]", form.displayStart);
//     formData.append("displayPeriod[end]", form.displayEnd);
//     formData.append("order", form.order);
//     formData.append("image", image);

//     try {
//       const res = await fetch(`${BASE_URL}banner`, {
//         method: "POST",
//         body: formData,
//       });

//       if (res.ok) {
//         toast.success("Banner created successfully!");
//         setForm({
//           headline: "",
//           subText: "",
//           mainText: "",
//           buttonText: "",
//           linkUrl: "",
//           displayStart: "",
//           displayEnd: "",
//           order: "",
//         });
//         setImage(null);
//         setPreview(null);
//         router.refresh();
//       } else {
//         toast.error("Error while saving banner.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black p-10">
//       <Toaster position="top-right" reverseOrder={false} />
//       <h1 className="text-4xl font-extrabold tracking-tight mb-10 text-center">
//         Create Banner
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="max-w-3xl mx-auto bg-white border-2 border-black rounded-2xl shadow-lg p-8 space-y-6 hover:shadow-2xl transition duration-300"
//       >
//         {/* Text Fields */}
//         {[
//           { name: "headline", label: "Headline", placeholder: "Enter the main title" },
//           { name: "subText", label: "Sub Text", placeholder: "Supporting text (optional)" },
//           { name: "mainText", label: "Main Text", placeholder: "Main content or description" },
//           { name: "buttonText", label: "Button Text", placeholder: "Text for the button" },
//           { name: "linkUrl", label: "Link URL", placeholder: "Button URL (optional)" },
//           { name: "displayStart", label: "Display Start", placeholder: "Start date ISO format" },
//           { name: "displayEnd", label: "Display End", placeholder: "End date ISO format" },
//           { name: "order", label: "Order", placeholder: "Display order (numeric)" },
//         ].map((field) => (
//           <div key={field.name}>
//             <label className="block font-semibold mb-2 text-lg">{field.label}</label>
//             <input
//               type="text"
//               name={field.name}
//               value={(form as any)[field.name]}
//               onChange={handleChange}
//               className="w-full border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-black/30"
//               placeholder={field.placeholder}
//             />
//           </div>
//         ))}

//         {/* Image Upload */}
//         <div>
//           <label className="block font-semibold mb-2 text-lg">Banner Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="w-full border-2 border-dashed border-black rounded-xl px-4 py-3 cursor-pointer"
//           />
//           {preview && (
//             <div className="mt-4 flex justify-center">
//               <Image
//                 src={preview}
//                 alt="Banner Preview"
//                 width={400}
//                 height={200}
//                 className="rounded-xl object-cover border-2 border-black shadow-md"
//               />
//             </div>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-300"
//         >
//           Save Banner
//         </button>
//       </form>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// Define TypeScript interface for form state
interface BannerForm {
  headline: string;
  subText: string;
  mainText: string;
  buttonText: string;
  linkUrl: string;
  displayStart: string;
  displayEnd: string;
  order: string;
}

export default function BannerPage() {
  const [form, setForm] = useState<BannerForm>({
    headline: "",
    subText: "",
    mainText: "",
    buttonText: "",
    linkUrl: "",
    displayStart: "",
    displayEnd: "",
    order: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validate BASE_URL environment variable
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_BASE_API is not defined in environment variables.");
    toast.error("Configuration error. Please contact support.");
  }

  // Clean up preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image input changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) {
        URL.revokeObjectURL(preview); // Clean up previous preview
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate ISO date format
  const isValidISODate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    return !isNaN(Date.parse(dateStr));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!BASE_URL) return;

    // Required fields validation
    if (!form.headline.trim()) return toast.error("Headline is required.");
    if (!form.mainText.trim()) return toast.error("Main Text is required.");
    if (!form.buttonText.trim()) return toast.error("Button Text is required.");
    if (!form.displayStart || !isValidISODate(form.displayStart))
      return toast.error("Valid Display Start date is required (ISO format, e.g., 2025-10-13T00:00:00Z).");
    if (!form.displayEnd || !isValidISODate(form.displayEnd))
      return toast.error("Valid Display End date is required (ISO format, e.g., 2025-10-13T23:59:59Z).");
    if (!image) return toast.error("Banner Image is required.");
    if (!form.order.trim() || isNaN(Number(form.order)) || Number(form.order) < 0)
      return toast.error("Order must be a valid non-negative number.");
    if (!isValidUrl(form.linkUrl)) return toast.error("Link URL must be valid (e.g., https://example.com).");

    // Validate display period
    if (new Date(form.displayStart) >= new Date(form.displayEnd)) {
      return toast.error("Display Start date must be before Display End date.");
    }

    const formData = new FormData();
    formData.append("headline", form.headline);
    formData.append("subText", form.subText);
    formData.append("mainText", form.mainText);
    formData.append("buttonText", form.buttonText);
    formData.append("linkUrl", form.linkUrl);
    formData.append("displayPeriod[start]", form.displayStart);
    formData.append("displayPeriod[end]", form.displayEnd);
    formData.append("order", form.order);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${BASE_URL}/banner`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Banner created successfully!");
        setForm({
          headline: "",
          subText: "",
          mainText: "",
          buttonText: "",
          linkUrl: "",
          displayStart: "",
          displayEnd: "",
          order: "",
        });
        setImage(null);
        setPreview(null);
        router.refresh();
      } else {
        toast.error(data.message || "Error while saving banner.");
      }
    } catch (error) {
      console.error("Error submitting banner:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-4xl font-extrabold tracking-tight mb-10 text-center">
        Create Banner
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white border-2 border-black rounded-2xl shadow-lg p-8 space-y-6 hover:shadow-2xl transition duration-300"
      >
        {/* Text Fields */}
        {[
          { name: "headline", label: "Headline", placeholder: "Enter the main title" },
          { name: "subText", label: "Sub Text", placeholder: "Supporting text (optional)" },
          { name: "mainText", label: "Main Text", placeholder: "Main content or description" },
          { name: "buttonText", label: "Button Text", placeholder: "Text for the button" },
          { name: "linkUrl", label: "Link URL", placeholder: "Button URL (optional, e.g., https://example.com)" },
          {
            name: "displayStart",
            label: "Display Start",
            placeholder: "Start date ISO format (e.g., 2025-10-13T00:00:00Z)",
          },
          {
            name: "displayEnd",
            label: "Display End",
            placeholder: "End date ISO format (e.g., 2025-10-13T23:59:59Z)",
          },
          { name: "order", label: "Order", placeholder: "Display order (numeric)" },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block font-semibold mb-2 text-lg">
              {field.label}
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={form[field.name as keyof BannerForm]}
              onChange={handleChange}
              className="w-full border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-black/30"
              placeholder={field.placeholder}
              aria-required={field.name !== "subText" && field.name !== "linkUrl"}
              disabled={loading}
            />
          </div>
        ))}

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block font-semibold mb-2 text-lg">
            Banner Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border-2 border-dashed border-black rounded-xl px-4 py-3 cursor-pointer"
            aria-required="true"
            disabled={loading}
          />
          {preview && (
            <div className="mt-4 flex justify-center">
              <Image
                src={preview}
                alt="Banner Preview"
                width={400}
                height={200}
                className="rounded-xl object-cover border-2 border-black shadow-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !BASE_URL}
          className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-300 disabled:opacity-50"
          aria-label="Save Banner"
        >
          {loading ? "Saving..." : "Save Banner"}
        </button>
      </form>
    </div>
  );
}
