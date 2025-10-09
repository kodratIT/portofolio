"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";

interface ContactSectionProps {
  profile: {
    displayName: string;
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    location?: string;
  };
}

export function ContactSection({ profile }: ContactSectionProps) {
  const socialLinks = [
    {
      name: "Email",
      icon: Mail,
      href: profile.email ? `mailto:${profile.email}` : undefined,
      value: profile.email,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      hoverBg: "hover:bg-blue-500/20",
    },
    {
      name: "GitHub",
      icon: Github,
      href: profile.github,
      value: profile.github?.replace("https://github.com/", "@"),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      hoverBg: "hover:bg-purple-500/20",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: profile.linkedin,
      value: "Connect",
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      hoverBg: "hover:bg-blue-600/20",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: profile.twitter,
      value: "Follow",
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      hoverBg: "hover:bg-sky-500/20",
    },
  ].filter(link => link.href);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your ideas to life? I&apos;m always open to discussing new opportunities and collaborations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Contact Info with Moving Border */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <MovingBorder
              duration={3000}
              className="p-8 bg-background border-2"
              borderClassName="bg-gradient-to-r from-primary via-purple-500 to-primary"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                  <p className="text-muted-foreground">
                    Feel free to reach out for collaborations, opportunities, or just a friendly chat!
                  </p>
                </div>

                {/* Location */}
                {profile.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <span>{profile.location}</span>
                  </div>
                )}

                {/* Availability Status */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    Available for new opportunities
                  </span>
                </div>

                {/* Quick Contact */}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="block w-full"
                  >
                    <Button size="lg" className="w-full text-lg group">
                      <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      Send me an email
                    </Button>
                  </a>
                )}
              </div>
            </MovingBorder>
          </motion.div>

          {/* Right - Social Links Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`group relative p-6 rounded-2xl border-2 border-border ${link.hoverBg} transition-all duration-300 overflow-hidden`}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 ${link.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl ${link.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <link.icon className={`h-8 w-8 ${link.color}`} />
                  </div>
                  
                  <h4 className="text-lg font-bold mb-1">{link.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {link.value}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Send className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent border border-primary/20">
            <p className="text-2xl font-semibold mb-2">
              Ready to start your next project?
            </p>
            <p className="text-muted-foreground">
              Let&apos;s turn your ideas into reality together
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
