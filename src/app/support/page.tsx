import Navbar from "@/components/layout/navbar/page";
export default function SupportPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Support</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
          <p className="text-gray-600">
            If you need help or have questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
