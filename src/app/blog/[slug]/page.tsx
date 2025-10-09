"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlogPost, UserProfile } from "@/lib/types";
import { getPublicBlogPost, getPublicUserProfile } from "@/lib/firebase/public";
import { PORTFOLIO_CONFIG } from "@/lib/config/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Mail,
} from "lucide-react";
import { format } from "date-fns";

export default function BlogPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const userId = PORTFOLIO_CONFIG.ownerId;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postData = await getPublicBlogPost(slug);
        if (postData) {
          setPost(postData);
          const authorData = await getPublicUserProfile(postData.userId);
          setAuthor(authorData);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-background to-muted/50">
        {post.coverImage && (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover opacity-10 blur-xl"
            />
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {post.title}
              </h1>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(
                      typeof post.publishedAt === "object" && "toDate" in post.publishedAt
                        ? post.publishedAt.toDate()
                        : new Date(post.publishedAt),
                      "MMMM d, yyyy"
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{calculateReadTime(post.content)} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Share & Author */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="lg:sticky lg:top-20 space-y-6">
                  {/* Share Buttons */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => sharePost("twitter")}
                        >
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => sharePost("linkedin")}
                        >
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => sharePost("facebook")}
                        >
                          <Facebook className="mr-2 h-4 w-4" />
                          Facebook
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => sharePost("copy")}
                        >
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Copy Link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Author Card */}
                  {author && (
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold mb-3">Author</h3>
                        <div className="flex items-center gap-3 mb-3">
                          {author.avatar && (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                              <Image
                                src={author.avatar}
                                alt={author.displayName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{author.displayName}</p>
                          </div>
                        </div>
                        {author.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {author.bio}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Excerpt */}
                {post.excerpt && (
                  <div className="mb-8">
                    <p className="text-xl text-muted-foreground italic">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                <Separator className="mb-8" />

                {/* Rich Text Content */}
                <div
                  className="prose prose-neutral dark:prose-invert prose-lg max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                    prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:font-bold prose-strong:text-foreground
                    prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-muted prose-pre:border prose-pre:border-border
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-li:marker:text-primary
                    prose-img:rounded-lg prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio (Mobile) */}
                {author && (
                  <div className="mt-12 pt-8 border-t border-border lg:hidden">
                    <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                    <div className="flex items-start gap-4">
                      {author.avatar && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={author.avatar}
                            alt={author.displayName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-lg mb-2">{author.displayName}</p>
                        {author.bio && (
                          <p className="text-muted-foreground">{author.bio}</p>
                        )}
                        {author.email && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            asChild
                          >
                            <a href={`mailto:${author.email}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Contact
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
