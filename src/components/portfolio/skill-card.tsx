"use client";

import { Skill } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const levelPercentage = (skill.level / 5) * 100;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">{skill.name}</h3>
          <span className="text-sm text-muted-foreground">
            {skill.level}/5
          </span>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${levelPercentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
