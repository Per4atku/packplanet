"use client";

import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderAnimatedProps {
  siteName: string;
  siteShortName: string;
  phone: string;
  nav: {
    catalog: string;
    priceList: string;
    delivery: string;
    contacts: string;
  };
}

export function HeaderAnimated({
  siteName,
  siteShortName,
  phone,
  nav,
}: HeaderAnimatedProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky rounded-full top-4 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="containerize flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center"
          >
            <Image src={"/logo.png"} width={500} height={500} alt="" />
          </motion.div>
          <span className=" font-bold text-foreground sm:inline-block group-hover:text-primary transition-colors">
            {siteName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {nav.catalog}
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/#price-list"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {nav.priceList}
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/#delivery"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {nav.delivery}
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/#contacts"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {nav.contacts}
            </Link>
          </motion.div>
        </nav>

        <div className="flex items-center gap-3">
          {/* Phone Link - visible on all screens */}
          <motion.a
            href="tel:+78002347875"
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{phone}</span>
          </motion.a>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] px-6">
              <SheetHeader className="mb-8 mt-4">
                <SheetTitle className="text-2xl font-bold text-left">
                  {siteShortName}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/products"
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-accent hover:text-white active:bg-accent/80"
                  onClick={() => setIsOpen(false)}
                >
                  {nav.catalog}
                </Link>
                <Link
                  href="/#price-list"
                  className="text-base font-medium text-foreground transition-colors py-2 px-4 rounded-lg hover:bg-accent hover:text-white active:bg-accent/80"
                  onClick={() => setIsOpen(false)}
                >
                  {nav.priceList}
                </Link>
                <Link
                  href="/#delivery"
                  className="text-base font-medium text-foreground  transition-colors py-2 px-4 rounded-lg hover:bg-accent hover:text-white active:bg-accent/80"
                  onClick={() => setIsOpen(false)}
                >
                  {nav.delivery}
                </Link>
                <Link
                  href="/#contacts"
                  className="text-base font-medium text-foreground  transition-colors py-2 px-4 rounded-lg hover:bg-accent hover:text-white active:bg-accent/80"
                  onClick={() => setIsOpen(false)}
                >
                  {nav.contacts}
                </Link>
              </nav>
              <div className="mt-auto pt-8 border-t">
                <a
                  href="tel:+78002347875"
                  className="flex items-center gap-3 text-base font-semibold text-foreground  transition-colors py-4 px-4 rounded-lg active:bg-accent/80"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <span>{phone}</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
