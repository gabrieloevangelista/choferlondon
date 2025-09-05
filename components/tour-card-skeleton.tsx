import { Skeleton } from "@/components/ui/skeleton"

export function TourCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col h-full overflow-hidden border border-gray-100">
      <div className="relative">
        <div className="h-56 overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-6 w-48 mt-1" />
        </div>
        <div className="flex flex-col gap-3 mb-5 flex-grow">
          <div className="flex items-center text-gray-700">
            <Skeleton className="w-8 h-8 rounded-full mr-3" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center text-gray-700">
            <Skeleton className="w-8 h-8 rounded-full mr-3" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center text-gray-700">
            <Skeleton className="w-8 h-8 rounded-full mr-3" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="border-t border-gray-200 my-4"></div>
        <div className="flex justify-between items-center mt-auto">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}
