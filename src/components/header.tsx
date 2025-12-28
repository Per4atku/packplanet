import { getMainContent } from "@/lib/content";
import { HeaderAnimated } from "./header-animated";

export function Header() {
  const content = getMainContent();

  return (
    <HeaderAnimated
      siteName={content.site.name}
      siteShortName={content.site.shortName}
      phone={content.header.phone}
      nav={content.header.nav}
    />
  );
}
