"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Globe } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface PortfolioFooterProps {
  userProfile?: UserProfile;
}

export function PortfolioFooter({ userProfile }: PortfolioFooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: userProfile?.github,
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: userProfile?.linkedin,
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: userProfile?.twitter,
      label: "Twitter",
    },
    {
      icon: Globe,
      href: userProfile?.website,
      label: "Website",
    },
  ].filter((link) => link.href);

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {userProfile?.displayName || "Portfolio"}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {userProfile?.bio || "Welcome to my portfolio"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href={`/portfolio/${userProfile?.uid}`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href={`/portfolio/${userProfile?.uid}/projects`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                href={`/portfolio/${userProfile?.uid}/blog`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
              {userProfile?.email && (
                <a
                  href={`mailto:${userProfile.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {userProfile?.displayName || "Portfolio"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
