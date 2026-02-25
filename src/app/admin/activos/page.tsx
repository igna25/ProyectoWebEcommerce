import { Suspense } from "react";
import AdminProductsPage from "@/app/ui/admin/AdminProductsPage";

export default function ActiveProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <AdminProductsPage active={true} />
    </Suspense>
  );
}
