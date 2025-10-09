import { NextResponse } from "next/server";
import { getPublicExperiences } from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const experiences = await getPublicExperiences();

    const currentExperience = experiences.find(exp => exp.current);
    
    return NextResponse.json({
      success: true,
      data: experiences,
      count: experiences.length,
      current: currentExperience || null,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error("❌ [API Experiences] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch experiences",
        message: error.message 
      },
      { status: 500 }
    );
  }
}
