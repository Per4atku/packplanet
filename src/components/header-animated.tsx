"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

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
            className="flex h-14 w-14 items-center justify-center"
          >
            <Image src={"/logo.png"} width={500} height={500} alt="" />
          </motion.div>
          <span className="hidden font-bold text-foreground sm:inline-block group-hover:text-primary transition-colors">
            {siteName}
          </span>
        </Link>

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
          <motion.a
            href="tel:+78002347876"
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{phone}</span>
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
