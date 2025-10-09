"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getBlogPost, updateBlogPost, generateSlug } from "@/lib/firebase/blog";
import { BlogCategory, BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/common/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/common/ImageUpload";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().optional(),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters").max(200, "Excerpt must be less than 200 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.string(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const categories: BlogCategory[] = [
  "Technology",
  "Tutorial",
  "Personal",
  "Review",
  "News",
  "Other",
];

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [coverImage, setCoverImage] = useState<string>("");

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      published: false,
      featured: false,
    },
  });

  const [manuallyEditedSlug, setManuallyEditedSlug] = useState(false);
  const title = form.watch("title");

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setIsLoading(true);
        const data = await getBlogPost(id);
        
        if (!data) {
          toast.error("Blog post not found");
          router.push("/blog");
          return;
        }

        setBlogPost(data);
        setCoverImage(data.coverImage || "");
        
        form.reset({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          tags: data.tags.join(", "),
          published: data.published,
          featured: data.featured,
        });
        
        setManuallyEditedSlug(true);
      } catch (error) {
        console.error("Error loading blog post:", error);
        toast.error("Failed to load blog post");
        router.push("/blog");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadBlogPost();
    }
  }, [id, user, router, form]);

  useEffect(() => {
    if (title && !manuallyEditedSlug) {
      const autoSlug = generateSlug(title);
      form.setValue("slug", autoSlug, { shouldValidate: false });
    }
  }, [title, manuallyEditedSlug, form]);

  const onSubmit = async (data: BlogFormValues) => {
    if (!user || !blogPost) {
      toast.error("You must be logged in to update a blog post");
      return;
    }

    try {
      setIsSubmitting(true);

      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const updateData: Partial<BlogPost> = {
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        excerpt: data.excerpt,
        content: data.content,
        category: data.category as BlogCategory,
        tags,
        published: data.published,
        featured: data.featured,
      };

      if (coverImage) {
        updateData.coverImage = coverImage;
      }

      await updateBlogPost(id, updateData);

      toast.success("Blog post updated successfully!");
      router.push("/blog");
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blogPost) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground mt-2">
            Update your blog post
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Awesome Blog Post"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="my-awesome-blog-post"
                        {...field}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          field.onChange(e);
                          setManuallyEditedSlug(true);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the title (auto-generated if left empty)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your blog post..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Short summary (20-200 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="react, typescript, tutorial"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Full blog post content with rich text formatting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-semibold mb-2">Cover Image</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a cover image for your blog post (optional)
                </p>
                <ImageUpload
                  onUpload={(url) => setCoverImage(url)}
                  onRemove={() => setCoverImage("")}
                  currentImage={coverImage}
                  folder="blog/covers"
                  label="Upload Cover Image"
                />
              </div>

              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Publish immediately</FormLabel>
                        <FormDescription>
                          Make this post visible to public
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured post</FormLabel>
                        <FormDescription>
                          Show in featured section
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Updating..." : "Update Post"}
                </Button>
                <Link href="/blog" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
