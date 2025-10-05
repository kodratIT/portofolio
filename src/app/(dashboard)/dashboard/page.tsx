"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Code2, Briefcase, Eye } from "lucide-react";

export default function DashboardPage() {
  const { userProfile } = useAuth();

  const stats = [
    {
      name: "Total Projects",
      value: "0",
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      name: "Total Skills",
      value: "0",
      icon: Code2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      name: "Experience Entries",
      value: "0",
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      name: "Profile Views",
      value: "0",
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {userProfile?.displayName || "User"}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Get started by adding your first project, skill, or work experience.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <a
                href="/projects"
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add Project
              </a>
              <a
                href="/skills"
                className="text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90"
              >
                Add Skill
              </a>
              <a
                href="/experience"
                className="text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90"
              >
                Add Experience
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">
                {userProfile?.displayName || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {userProfile?.email || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Bio</p>
              <p className="text-sm text-muted-foreground">
                {userProfile?.bio || "No bio added yet"}
              </p>
            </div>
            <a
              href="/settings"
              className="inline-block text-sm text-primary hover:underline mt-2"
            >
              Edit Profile →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
