import { NextRequest, NextResponse } from "next/server"

const API_PROTECTED_PATH = /^\/api\/infos$/
const PAGE_PROTECTED_PATHS = [
  "/infos/ajouter-info",
  /^\/infos\/\d+\/editer-info$/,
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  if (API_PROTECTED_PATH.test(pathname) && method !== "GET") {
    return NextResponse.json(
      { error: "Forbidden - Only GET method allowed" },
      { status: 403 }
    )
  }

  if (
    PAGE_PROTECTED_PATHS.some((path) =>
      typeof path === "string" ? pathname === path : path.test(pathname)
    )
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/non-autorise"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/infos", "/infos/ajouter-info", "/infos/(.*)/editer-info"],
}
