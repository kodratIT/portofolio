"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getExperiences, deleteExperience } from "@/lib/firebase/experiences";
import { Experience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, MapPin, Calendar, Briefcase } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

export default function ExperiencePage() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<{ id: string; position: string } | null>(null);

  const fetchExperiences = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getExperiences(user.uid);
      setExperiences(data);
    } catch (error: any) {
      console.error("Error fetching experiences:", error);
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [user]);

  const handleDelete = async () => {
    if (!experienceToDelete) return;

    try {
      await deleteExperience(experienceToDelete.id);
      toast.success("Experience deleted successfully");
      fetchExperiences();
    } catch (error) {
      toast.error("Failed to delete experience");
    } finally {
      setDeleteDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate();
      return format(date, "MMM yyyy");
    } catch (error) {
      return "";
    }
  };

  const calculateDuration = (startDate: any, endDate: any, current: boolean) => {
    try {
      const start = startDate.toDate();
      const end = current ? new Date() : endDate?.toDate() || new Date();
      
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      if (years > 0 && remainingMonths > 0) {
        return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
      } else if (years > 0) {
        return `${years} yr${years > 1 ? 's' : ''}`;
      } else {
        return `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
      }
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground mt-2">
            Manage your work experience ({experiences.length} total)
          </p>
        </div>
        <Link href="/experience/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </Link>
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground text-center mb-4">
              No work experience yet. Add your first experience to get started!
            </p>
            <Link href="/experience/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Experience
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Timeline */}
          <div className="relative">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative pb-8">
                {/* Timeline line */}
                {index !== experiences.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
                )}
                
                <div className="flex gap-6">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                      exp.current 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-border'
                    }`}>
                      <Briefcase className={`h-4 w-4 ${exp.current ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <Card className="flex-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">{exp.position}</CardTitle>
                            {exp.current && (
                              <Badge variant="default" className="bg-green-600">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="text-lg font-semibold text-muted-foreground">
                            {exp.company}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {exp.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {exp.location}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                              <span className="ml-1">({calculateDuration(exp.startDate, exp.endDate, exp.current)})</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/experience/${exp.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setExperienceToDelete({ id: exp.id!, position: exp.position });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{exp.description}</p>
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {exp.responsibilities.map((responsibility, idx) => (
                                <li key={idx}>{responsibility}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the experience "{experienceToDelete?.position}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
