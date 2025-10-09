"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getSkill, updateSkill } from "@/lib/firebase/skills";
import { SkillCategory, Skill } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

const skillSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  level: z.number().min(1).max(5),
});

type SkillFormValues = z.infer<typeof skillSchema>;

const categories: SkillCategory[] = [
  "Frontend",
  "Backend",
  "DevOps",
  "Database",
  "Tools",
  "Other",
];

export default function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skill, setSkill] = useState<Skill | null>(null);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      level: 3,
    },
  });

  const currentLevel = form.watch("level");

  useEffect(() => {
    const loadSkill = async () => {
      try {
        setIsLoading(true);
        const data = await getSkill(id);
        
        if (!data) {
          toast.error("Skill not found");
          router.push("/skills");
          return;
        }

        if (data.userId !== user?.uid) {
          toast.error("You don't have permission to edit this skill");
          router.push("/skills");
          return;
        }

        setSkill(data);
        form.reset({
          name: data.name,
          category: data.category,
          level: data.level,
        });
      } catch (error) {
        console.error("Error loading skill:", error);
        toast.error("Failed to load skill");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadSkill();
    }
  }, [id, user, router, form]);

  const onSubmit = async (data: SkillFormValues) => {
    if (!user || !skill) {
      toast.error("Unable to update skill");
      return;
    }

    try {
      setIsSubmitting(true);
      
      await updateSkill(id, {
        name: data.name,
        category: data.category,
        level: data.level,
      });

      toast.success("Skill updated successfully!");
      router.push("/skills");
    } catch (error: any) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill. Please try again.");
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

  if (!skill) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/skills">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Skill</h1>
          <p className="text-muted-foreground mt-2">
            Update skill information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, TypeScript, Docker..."
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
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Level *</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isSubmitting}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i <= currentLevel
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Level {currentLevel} of 5
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      1 = Beginner, 5 = Expert
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Updating..." : "Update Skill"}
                </Button>
                <Link href="/skills" className="flex-1">
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
