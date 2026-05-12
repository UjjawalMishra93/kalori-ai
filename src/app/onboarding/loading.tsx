import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-2xl w-full bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl space-y-10">
        {/* Progress Dots */}
        <div className="flex justify-center gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-2 w-12 rounded-full" />
          ))}
        </div>

        <div className="space-y-4 text-center flex flex-col items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>

        <div className="flex gap-4 pt-6">
          <Skeleton className="h-14 flex-1 rounded-full" />
          <Skeleton className="h-14 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  )
}
