import { Suspense } from "react";
import AdminSalesPage from "@/app/ui/admin/AdminSalesPage";

export default function SalesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <AdminSalesPage />
    </Suspense>
  );
}
