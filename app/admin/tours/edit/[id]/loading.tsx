import { LayoutWrapper } from "../../../../../components/layout-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <Skeleton className="h-10 w-64 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-80 w-full rounded-xl mb-8" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>

          <div className="lg:col-span-1">
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
