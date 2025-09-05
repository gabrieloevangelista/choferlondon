import { type NextRequest, NextResponse } from "next/server"
import { getRandomImage, type ImageSource } from "../../../../services/image-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || ""
  const source = (searchParams.get("source") || "all") as ImageSource

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const image = await getRandomImage(query, source)

    if (!image) {
      return NextResponse.json({ error: "No image found" }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error getting random image:", error)
    return NextResponse.json({ error: "Failed to get random image" }, { status: 500 })
  }
}
