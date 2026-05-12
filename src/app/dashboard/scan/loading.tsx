import { Skeleton } from "@/components/ui/skeleton"

export default function ScanLoading() {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Header Skeleton */}
      <header className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column - Uploader */}
        <Skeleton className="h-[500px] w-full rounded-[40px]" />

        {/* Right Column - Results Placeholder */}
        <div className="w-full h-full flex flex-col justify-center">
          <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center h-[500px] space-y-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <div className="space-y-2 w-full flex flex-col items-center">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </div>

      {/* History Section Skeleton */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-[24px] p-6 border border-gray-100 h-44 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
