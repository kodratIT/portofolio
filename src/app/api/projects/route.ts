import { NextRequest, NextResponse } from "next/server";
import { getPublicProjects } from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get("featured") === "true";

    const projects = await getPublicProjects(undefined, featuredOnly);

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error("❌ [API Projects] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch projects",
        message: error.message 
      },
      { status: 500 }
    );
  }
}
