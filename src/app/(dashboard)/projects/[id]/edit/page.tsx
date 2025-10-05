"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getProject, updateProject } from "@/lib/firebase/projects";
import { ProjectCategory, Project } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageUpload, MultipleImageUpload } from "@/components/common/ImageUpload";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  longDescription: z.string().min(50, "Long description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  technologies: z.string().min(1, "Please enter at least one technology"),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const categories: ProjectCategory[] = [
  "Web Application",
  "Mobile Application",
  "Desktop Application",
  "API/Backend",
  "Library/Package",
  "Other",
];

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      category: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
    },
  });

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const data = await getProject(id);
        
        if (!data) {
          toast.error("Project not found");
          router.push("/projects");
          return;
        }

        if (data.userId !== user?.uid) {
          toast.error("You don't have permission to edit this project");
          router.push("/projects");
          return;
        }

        setProject(data);
        form.reset({
          title: data.title,
          description: data.description,
          longDescription: data.longDescription,
          category: data.category,
          technologies: data.technologies.join(", "),
          liveUrl: data.liveUrl || "",
          githubUrl: data.githubUrl || "",
          featured: data.featured,
        });
      } catch (error) {
        console.error("Error loading project:", error);
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProject();
    }
  }, [id, user, router, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!user || !project) {
      toast.error("Unable to update project");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const technologies = data.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const updateData: any = {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        category: data.category,
        technologies,
        featured: data.featured,
      };

      // Only add optional fields if they have values (Firestore doesn't accept undefined)
      if (data.liveUrl && data.liveUrl.trim() !== "") {
        updateData.liveUrl = data.liveUrl;
      }
      if (data.githubUrl && data.githubUrl.trim() !== "") {
        updateData.githubUrl = data.githubUrl;
      }

      await updateProject(id, updateData);

      toast.success("Project updated successfully!");
      router.push("/projects");
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
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

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground mt-2">
            Update your project information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Awesome Project"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of your project..."
                        className="h-20"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A short summary that will be displayed in project cards
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A detailed description of your project, features, challenges, etc..."
                        className="h-32"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Full project description for the detail page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
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
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies Used *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, TypeScript, Tailwind CSS, Firebase"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate technologies with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="liveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to live demo (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/user/repo"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to GitHub repository (optional)
                      </FormDescription>
                      <FormMessage />
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
                  {isSubmitting ? "Updating..." : "Update Project"}
                </Button>
                <Link href="/projects" className="flex-1">
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
