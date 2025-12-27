import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { getMainContent } from "@/lib/content";

export function Footer() {
  const content = getMainContent();

  return (
    <footer className="border-t bg-slate-950 text-slate-50">
      <div className="containerize py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-xl font-bold">{content.site.shortName}</span>
              </div>
              <span className="font-bold">{content.site.name}</span>
            </div>
            <p className="text-sm text-slate-400">
              {content.site.taglineExtended.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">{content.footer.quickLinks.title}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-slate-400 transition-colors hover:text-primary"
                >
                  {content.footer.quickLinks.catalog}
                </Link>
              </li>
              <li>
                <Link
                  href="#price-list"
                  className="text-slate-400 transition-colors hover:text-primary"
                >
                  {content.footer.quickLinks.priceList}
                </Link>
              </li>
              <li>
                <Link
                  href="#delivery"
                  className="text-slate-400 transition-colors hover:text-primary"
                >
                  {content.footer.quickLinks.delivery}
                </Link>
              </li>
              <li>
                <Link
                  href="#contacts"
                  className="text-slate-400 transition-colors hover:text-primary"
                >
                  {content.footer.quickLinks.contacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 font-semibold">{content.footer.contactsSection.title}</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  {content.footer.contactsSection.phones.map((phone, i) => (
                    <span key={i}>
                      <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-primary">
                        {phone}
                      </a>
                      {i < content.footer.contactsSection.phones.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${content.footer.contactsSection.email}`} className="hover:text-primary">
                  {content.footer.contactsSection.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="mb-4 font-semibold">{content.footer.workingHours.title}</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p>{content.footer.workingHours.weekdays}</p>
                  <p>{content.footer.workingHours.weekends}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  {content.footer.workingHours.address.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>{content.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
