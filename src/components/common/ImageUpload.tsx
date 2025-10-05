"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImage, validateImageFile } from "@/lib/firebase/storage";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  folder: string;
  label?: string;
  maxSize?: number; // in MB
}

export function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  folder,
  label = "Upload Image",
  maxSize = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!validateImageFile(file)) {
      toast.error(`Please upload a valid image file (JPEG, PNG, WebP, GIF) under ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const url = await uploadImage(file, folder, (progress) => {
        setProgress(progress);
      });

      onUpload(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, GIF up to {maxSize}MB
          </p>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}

interface MultipleImageUploadProps {
  onUpload: (urls: string[]) => void;
  currentImages?: string[];
  folder: string;
  label?: string;
  maxImages?: number;
}

export function MultipleImageUpload({
  onUpload,
  currentImages = [],
  folder,
  label = "Upload Images",
  maxImages = 5,
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!validateImageFile(file)) {
          toast.error(`Skipping invalid file: ${file.name}`);
          continue;
        }

        const url = await uploadImage(file, folder);
        uploadedUrls.push(url);
      }

      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onUpload(newImages);
      
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload some images. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload(newImages);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : label} ({images.length}/{maxImages})
        </Button>
      )}
    </div>
  );
}
