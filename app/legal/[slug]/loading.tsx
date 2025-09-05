import { LayoutWrapper } from "../../../components/layout-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <Skeleton className="h-10 w-64 mx-auto mb-12" />

        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-[600px] w-full rounded-xl mb-8" />
        </div>
      </div>
    </LayoutWrapper>
  )
}
