import { NextResponse } from "next/server";
import { getPublicUserProfile } from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = PORTFOLIO_CONFIG.ownerId;
    const profile = await getPublicUserProfile(userId); // Still need userId for user profile doc

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error("❌ [API Profile] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch profile",
        message: error.message 
      },
      { status: 500 }
    );
  }
}
