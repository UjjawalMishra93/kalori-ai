import { Skeleton } from "@/components/ui/skeleton"

export default function LoginLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#f8f9fa] animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-full mt-4" />
        </div>
        
        <div className="flex justify-center">
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  )
}
