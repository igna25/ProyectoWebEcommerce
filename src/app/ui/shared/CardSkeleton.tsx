export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
      <div className="w-full h-52 bg-gray-200 animate-pulse" />
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <div className="h-9 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-9 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
