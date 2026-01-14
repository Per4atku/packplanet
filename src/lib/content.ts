/**
 * Content Management Utility
 *
 * This module provides functions to read and parse YAML content files.
 * Content files are located in the /content directory at the project root.
 *
 * Usage:
 *   import { getMainContent, getCatalogContent, getAdminContent } from '@/lib/content';
 *
 *   const content = await getMainContent();
 *   console.log(content.hero.title);
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

// Define types for better TypeScript support
export interface MainContent {
  site: {
    name: string;
    shortName: string;
    tagline: string;
    taglineExtended: string;
  };
  header: {
    nav: {
      catalog: string;
      priceList: string;
      delivery: string;
      contacts: string;
    };
    phone: string;
  };
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    buttons: {
      priceList: string;
      contact: string;
    };
  };
  featuredProducts: {
    heading: string;
    ctaCard: {
      title: string;
      description: string;
    };
  };
  priceList: {
    heading: string;
    description: string;
    downloadButton: string;
    viewOnlineButton: string;
  };
  partners: {
    heading: string;
  };
  delivery: {
    heading: string;
    headingHighlight: string;
    conditions: { text: string }[];
    minOrderDelivery: string;
    minOrderDeliveryPrice: string;
  };
  contacts: {
    heading: string;
    description: string;
    cardTitle: string;
    address: {
      label: string;
      value: string;
    };
    workingHours: {
      label: string;
      weekdays: string;
      weekends: string;
    };
    phone: {
      label: string;
      numbers: string[];
    };
    email: {
      label: string;
      value: string;
    };
    mapButtons: {
      yandex: string;
      gis: string;
    };
  };
  footer: {
    quickLinks: {
      title: string;
      catalog: string;
      priceList: string;
      delivery: string;
      contacts: string;
    };
    contactsSection: {
      title: string;
      phones: string[];
      email: string;
    };
    workingHours: {
      title: string;
      weekdays: string;
      weekends: string;
      address: string;
    };
    copyright: string;
  };
}

export interface CatalogContent {
  page: {
    title: string;
    description: string;
  };
  header: {
    heading: string;
  };
  filters: {
    allCategories: string;
  };
  results: {
    found: string;
    updating: string;
  };
  pagination: {
    previous: string;
    next: string;
    ellipsis: string;
  };
  product: {
    priceLabel: string;
    wholesalePriceLabel: string;
    minOrderLabel: string;
    hot: string;
  };
}

export interface AdminContent {
  [key: string]: any; // Flexible type for admin content
}

/**
 * Get the path to a content file
 */
function getContentPath(filename: string): string {
  return join(process.cwd(), 'content', filename);
}

/**
 * Read and parse a YAML content file
 */
function readContentFile<T>(filename: string): T {
  try {
    const filePath = getContentPath(filename);
    const fileContents = readFileSync(filePath, 'utf8');
    return parse(fileContents) as T;
  } catch (error) {
    console.error(`Error reading content file ${filename}:`, error);
    throw new Error(`Failed to load content from ${filename}`);
  }
}

/**
 * Get main page content
 */
export function getMainContent(): MainContent {
  return readContentFile<MainContent>('main.yml');
}

/**
 * Get catalog page content
 */
export function getCatalogContent(): CatalogContent {
  return readContentFile<CatalogContent>('catalog.yml');
}

/**
 * Get admin dashboard content
 */
export function getAdminContent(): AdminContent {
  return readContentFile<AdminContent>('admin.yml');
}

/**
 * Helper function to safely access nested content
 * Example: getContent(content, 'hero.title')
 */
export function getContent<T = string>(obj: any, path: string): T {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) as T;
}
