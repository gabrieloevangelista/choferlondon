import { type NextRequest, NextResponse } from "next/server"
import { searchImages, type ImageSource } from "../../../../services/image-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || ""
  const source = (searchParams.get("source") || "all") as ImageSource
  const page = Number.parseInt(searchParams.get("page") || "1")
  const perPage = Number.parseInt(searchParams.get("perPage") || "20")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const results = await searchImages(query, source, page, perPage)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching images:", error)
    return NextResponse.json({ error: "Failed to search images" }, { status: 500 })
  }
}
