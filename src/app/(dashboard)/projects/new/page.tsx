"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createProject } from "@/lib/firebase/projects";
import { ProjectCategory } from "@/lib/types";
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

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: ProjectFormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a project");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("🚀 Starting project creation...");
      console.log("User ID:", user.uid);
      console.log("Form data:", data);
      
      const technologies = data.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      console.log("Technologies array:", technologies);

      const projectData = {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        category: data.category,
        technologies,
        liveUrl: data.liveUrl || undefined,
        githubUrl: data.githubUrl || undefined,
        featured: data.featured,
        images: [],
        thumbnail: "",
        order: 0,
      };

      console.log("Project data to create:", projectData);

      const projectId = await createProject(user.uid, projectData);
      
      console.log("✅ Project created with ID:", projectId);
      toast.success("Project created successfully!");
      router.push("/projects");
    } catch (error: any) {
      console.error("❌ Error creating project:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Failed to create project. Please try again.";
      
      if (error.message?.includes("FIRESTORE_PERMISSION")) {
        errorMessage = "⚠️ Firestore permission denied. Please enable Firestore rules.";
        console.error("🔥 FIRESTORE RULES ERROR!");
        console.error("Fix at: https://console.firebase.google.com/project/portofolio-ecd0d/firestore/rules");
      } else if (error.message?.includes("FIRESTORE_UNAVAILABLE")) {
        errorMessage = "⚠️ Firestore is not available. Please check your connection.";
        console.error("🔥 FIRESTORE NOT AVAILABLE!");
      } else if (error.code === "permission-denied") {
        errorMessage = "⚠️ Permission denied. Please check Firestore security rules.";
        console.error("🔥 PERMISSION DENIED - Check Firestore rules!");
      }
      
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Project</h1>
          <p className="text-muted-foreground mt-2">
            Create a new portfolio project
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
                  {isSubmitting ? "Creating..." : "Create Project"}
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
