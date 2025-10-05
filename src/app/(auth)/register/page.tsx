"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { registerUser } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  displayName: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      console.log("Starting registration...");
      await registerUser(data.email, data.password, data.displayName);
      toast.success("Registrasi berhasil! Selamat datang!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Registrasi gagal. Silakan coba lagi.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email sudah terdaftar.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email tidak valid.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah.";
      } else if (error.message?.includes("FIRESTORE_PERMISSION_DENIED")) {
        errorMessage = "⚠️ User created but Firestore access denied. Please enable Firestore rules.";
        console.error("🔥 FIRESTORE NOT CONFIGURED! Check: https://console.firebase.google.com/project/portofolio-ecd0d/firestore");
      } else if (error.message?.includes("FIRESTORE_UNAVAILABLE")) {
        errorMessage = "⚠️ User created but Firestore is not enabled. Please enable Firestore Database.";
        console.error("🔥 FIRESTORE NOT ENABLED! Enable at: https://console.firebase.google.com/project/portofolio-ecd0d/firestore");
      } else if (error.message?.includes("FIRESTORE_ERROR")) {
        errorMessage = `⚠️ User created but profile save failed: ${error.message}`;
      }
      
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Daftar Akun</CardTitle>
        <CardDescription>
          Buat akun baru untuk mengelola portfolio Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nama@example.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Daftar"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login di sini
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
