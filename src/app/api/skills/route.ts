import { NextResponse } from "next/server";
import { getPublicSkills } from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const skills = await getPublicSkills();

    // Group by category
    const groupedSkills = skills.reduce((acc: any, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: skills,
      grouped: groupedSkills,
      count: skills.length,
      categories: Object.keys(groupedSkills).length,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error("❌ [API Skills] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch skills",
        message: error.message 
      },
      { status: 500 }
    );
  }
}
