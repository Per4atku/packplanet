/**
 * Centralized phone configuration
 * All phone numbers used across the website are defined here.
 */

export interface PhoneNumber {
  /** Phone number formatted for display */
  display: string;
  /** Phone number for tel: links (no spaces, with country code) */
  href: string;
  /** Optional label/description */
  label?: string;
  /** Is this the primary phone number */
  isPrimary?: boolean;
  /** Is this phone for companies (юридические лица) */
  isForCompanies?: boolean;
}

/**
 * All phone numbers for the website
 */
export const phones: PhoneNumber[] = [
  {
    display: "+7 (423) 245-78-75",
    href: "+74232457875",
    label: "Торговый зал",
    isPrimary: true,
  },
  {
    display: "+7 (423) 244-65-66",
    href: "+74232446566",
    label: "Торговый зал",
    isForCompanies: false,
  },
  {
    display: "+7 (423) 244-99-97",
    href: "+74232449997",
    label: "Для Юридических лиц",
    isForCompanies: true,
  },
];

/**
 * Get the primary phone number
 */
export function getPrimaryPhone(): PhoneNumber {
  return phones.find((p) => p.isPrimary) ?? phones[0];
}

/**
 * Get the phone number for companies (юридические лица)
 */
export function getCompanyPhone(): PhoneNumber | undefined {
  return phones.find((p) => p.isForCompanies);
}

/**
 * Get all phone numbers
 */
export function getAllPhones(): PhoneNumber[] {
  return phones;
}

/**
 * Format phone number for display with optional label
 */
export function formatPhoneWithLabel(phone: PhoneNumber): string {
  if (phone.label) {
    return `${phone.display} (${phone.label})`;
  }
  return phone.display;
}
