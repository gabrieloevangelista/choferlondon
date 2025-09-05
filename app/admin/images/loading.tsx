import { LayoutWrapper } from "../../../components/layout-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <Skeleton className="h-10 w-64 mb-8" />

        <Skeleton className="h-20 w-full rounded-xl mb-8" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
        </div>

        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </LayoutWrapper>
  )
}
