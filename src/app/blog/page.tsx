"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { getPublicBlogPosts } from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, Clock, Tag, Filter } from "lucide-react";
import { format } from "date-fns";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";

export default function BlogHomePage() {
  const userId = PORTFOLIO_CONFIG.ownerId;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPublicBlogPosts(userId);
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || p !== featuredPost);

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-background to-muted/50">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Blog</h1>
            <p className="text-muted-foreground text-lg">
              Thoughts, tutorials, and insights about technology, programming, and more.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search posts by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="h-5 w-5 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
              <BackgroundGradient className="rounded-[22px] p-1">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Card className="group overflow-hidden border-0">
                    <div className="grid md:grid-cols-2 gap-6">
                      {featuredPost.coverImage && (
                        <div className="relative aspect-video md:aspect-auto md:h-full overflow-hidden bg-muted">
                          <Image
                            src={featuredPost.coverImage}
                            alt={featuredPost.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <CardContent className="p-6 flex flex-col justify-center">
                        <Badge variant="default" className="w-fit mb-4">
                          Featured
                        </Badge>
                        <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                          {featuredPost.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {featuredPost.publishedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(
                                typeof featuredPost.publishedAt === "object" &&
                                  "toDate" in featuredPost.publishedAt
                                  ? featuredPost.publishedAt.toDate()
                                  : new Date(featuredPost.publishedAt),
                                "MMM d, yyyy"
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {calculateReadTime(featuredPost.content)} min read
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </BackgroundGradient>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {regularPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  {searchQuery || selectedCategory !== "All"
                    ? "No posts found matching your criteria."
                    : "No blog posts available yet."}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-muted-foreground">
                  Showing {regularPosts.length} of {posts.length} posts
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {post.coverImage && (
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <Badge variant="secondary" className="mb-3">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {post.publishedAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(
                                  typeof post.publishedAt === "object" &&
                                    "toDate" in post.publishedAt
                                    ? post.publishedAt.toDate()
                                    : new Date(post.publishedAt),
                                  "MMM d, yyyy"
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {calculateReadTime(post.content)} min
                            </div>
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
