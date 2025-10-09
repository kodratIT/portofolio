"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  FileText,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutUser } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "next-intl";

const getNavigation = (t: ReturnType<typeof useTranslations>) => [
  { name: t("navigation.dashboard"), href: "/dashboard", icon: LayoutDashboard },
  { name: t("navigation.projects"), href: "/projects", icon: FolderKanban },
  { name: t("navigation.blog"), href: "/blog", icon: FileText },
  { name: t("navigation.skills"), href: "/skills", icon: Code2 },
  { name: t("navigation.experience"), href: "/experience", icon: Briefcase },
  { name: t("navigation.settings"), href: "/settings", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const navigation = getNavigation(t);

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Portfolio</h2>
        <p className="text-sm text-muted-foreground">{t("navigation.dashboard")}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Header() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useTranslations();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      toast.success(t("common.logoutSuccess"));
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("common.logoutFailed"));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 ml-auto">
          <LanguageSwitcher />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={userProfile?.avatar} />
                  <AvatarFallback>
                    {getInitials(userProfile?.displayName || user?.email || "U")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {userProfile?.displayName || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/portfolio/${user?.uid}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Portfolio
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  {t("navigation.settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? t("common.loggingOut") : t("navigation.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <aside className="hidden md:block w-64 border-r">
          <Sidebar />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-background p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
