"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProjects } from "@/lib/firebase/projects";
import { getSkills } from "@/lib/firebase/skills";
import { getExperiences } from "@/lib/firebase/experiences";
import { getBlogPosts } from "@/lib/firebase/blog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Code2, 
  GraduationCap, 
  FileText,
  TrendingUp,
  Eye,
  Star,
  Plus,
  ArrowRight,
  Calendar,
  Activity,
  FolderKanban
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    blogPosts: 0,
    publishedPosts: 0,
    featuredProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentBlogPosts, setRecentBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [projects, skills, experiences, blogPosts] = await Promise.all([
          getProjects(user.uid),
          getSkills(user.uid),
          getExperiences(user.uid),
          getBlogPosts(user.uid),
        ]);

        // Calculate stats
        setStats({
          projects: projects.length,
          skills: skills.length,
          experiences: experiences.length,
          blogPosts: blogPosts.length,
          publishedPosts: blogPosts.filter(p => p.published).length,
          featuredProjects: projects.filter(p => p.featured).length,
        });

        // Get recent items (last 3)
        setRecentProjects(projects.slice(0, 3));
        setRecentBlogPosts(blogPosts.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      description: `${stats.featuredProjects} featured`,
      icon: Briefcase,
      href: "/projects",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Blog Posts",
      value: stats.blogPosts,
      description: `${stats.publishedPosts} published`,
      icon: FileText,
      href: "/blog",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Skills",
      value: stats.skills,
      description: "Technical skills",
      icon: Code2,
      href: "/skills",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Experience",
      value: stats.experiences,
      description: "Work history",
      icon: GraduationCap,
      href: "/experience",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  const quickActions = [
    { label: "New Project", href: "/projects/new", icon: Briefcase },
    { label: "New Blog Post", href: "/blog/new", icon: FileText },
    { label: "Add Skill", href: "/skills/new", icon: Code2 },
    { label: "Add Experience", href: "/experience/new", icon: GraduationCap },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userProfile?.displayName || "User"}! 👋</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Create new content for your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Button variant="outline" className="w-full justify-start">
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Recent Projects
              </CardTitle>
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No projects yet</p>
                <Link href="/projects/new">
                  <Button variant="link" size="sm" className="mt-2">
                    Create your first project
                  </Button>
                </Link>
              </div>
            ) : (
              recentProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}/edit`}>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{project.title}</h4>
                        {project.featured && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Blog Posts
              </CardTitle>
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBlogPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No blog posts yet</p>
                <Link href="/blog/new">
                  <Button variant="link" size="sm" className="mt-2">
                    Write your first post
                  </Button>
                </Link>
              </div>
            ) : (
              recentBlogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}/edit`}>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold line-clamp-1">{post.title}</h4>
                        {post.featured && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={post.published ? "default" : "secondary"} className="text-xs">
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Profile Completion
          </CardTitle>
          <CardDescription>
            Complete your portfolio to make it more attractive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${stats.projects > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Add at least one project</span>
              </div>
              {stats.projects === 0 && (
                <Link href="/projects/new">
                  <Button variant="outline" size="sm">Add</Button>
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${stats.skills > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Add your skills</span>
              </div>
              {stats.skills === 0 && (
                <Link href="/skills/new">
                  <Button variant="outline" size="sm">Add</Button>
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${stats.experiences > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Add work experience</span>
              </div>
              {stats.experiences === 0 && (
                <Link href="/experience/new">
                  <Button variant="outline" size="sm">Add</Button>
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${userProfile?.bio ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Complete your profile</span>
              </div>
              {!userProfile?.bio && (
                <Link href="/settings">
                  <Button variant="outline" size="sm">Complete</Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
