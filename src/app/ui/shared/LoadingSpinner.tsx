export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-gray-100">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  );
}
