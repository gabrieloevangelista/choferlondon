import { LayoutWrapper } from "../../../components/layout-wrapper"

export default function Loading() {
  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <div className="h-[60vh] bg-gray-200 rounded-xl animate-pulse mb-8"></div>
        <div className="w-1/2 h-10 bg-gray-200 animate-pulse mb-4"></div>
        <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
        <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
        <div className="w-3/4 h-6 bg-gray-200 animate-pulse mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-200 h-96 rounded-xl animate-pulse"></div>
            <div className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
            <div className="bg-gray-200 h-80 rounded-xl animate-pulse"></div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gray-200 h-[500px] rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
