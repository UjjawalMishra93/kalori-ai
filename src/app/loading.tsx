import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] p-8 space-y-12 animate-in fade-in duration-500">
      {/* Nav Skeleton */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex gap-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-24 rounded-xl" />
      </nav>

      {/* Hero Skeleton */}
      <section className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
        <div className="space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-20 w-1/2" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-14 w-48 rounded-full" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-[40px]" />
      </section>
    </div>
  )
}
