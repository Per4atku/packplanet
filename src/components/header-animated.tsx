"use client";

import Link from "next/link";
import { Phone, Menu, X, ArrowRight } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllPhones } from "@/lib/phones";

interface HeaderAnimatedProps {
  siteName: string;
  siteShortName: string;
  nav: {
    catalog: string;
    priceList: string;
    delivery: string;
    contacts: string;
  };
  showCatalog?: boolean;
}

export function HeaderAnimated({
  siteName,
  siteShortName,
  nav,
  showCatalog = true,
}: HeaderAnimatedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const phones = getAllPhones();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky rounded-full top-4 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="containerize relative flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2 group z-10">
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

        {/* Desktop Navigation - centered */}
        <nav className="hidden items-center gap-6 md:flex absolute left-1/2 -translate-x-1/2">
          {showCatalog && (
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
          )}
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

        <div className="flex items-center gap-2 z-10">
          {/* Call to action label with animated arrow */}
          <button
            onClick={() => setIsPhoneDialogOpen(true)}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span>Позвоните нам</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </button>

          {/* Phone Button - opens dialog */}
          <motion.button
            onClick={() => setIsPhoneDialogOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Phone className="h-4 w-4" />
          </motion.button>

          {/* Phone Dialog */}
          <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Позвоните нам</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {phones.map((phone, index) => (
                  <a
                    key={index}
                    href={`tel:${phone.href}`}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/90 transition-colors group"
                    onClick={() => setIsPhoneDialogOpen(false)}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-white/10 transition-colors">
                      <Phone className="h-5 w-5 text-primary group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-medium group-hover:text-white">
                        {phone.display}
                      </p>
                      {phone.label && (
                        <p className="text-sm text-muted-foreground group-hover:text-white">
                          {phone.label}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </DialogContent>
          </Dialog>

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
                {showCatalog && (
                  <Link
                    href="/products"
                    className="text-base font-medium text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-accent hover:text-white active:bg-accent/80"
                    onClick={() => setIsOpen(false)}
                  >
                    {nav.catalog}
                  </Link>
                )}
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
              <div className="mt-auto pt-8 border-t space-y-2">
                {phones.map((phone, index) => (
                  <a
                    key={index}
                    href={`tel:${phone.href}`}
                    className="flex items-center gap-3 text-base font-semibold text-foreground transition-colors py-3 px-4 rounded-lg active:bg-accent/80"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span>{phone.display}</span>
                      {phone.label && (
                        <span className="block text-xs font-normal text-muted-foreground">
                          {phone.label}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
