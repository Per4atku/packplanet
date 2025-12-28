import { getMainContent } from "@/lib/content";
import { HeaderAnimated } from "./header-animated";

export function Header() {
  const content = getMainContent();

  return (
    <HeaderAnimated
      siteName={content.site.name}
      siteShortName={"Планета Упаковки"}
      phone={"8 (800) 234-78-75"}
      nav={content.header.nav}
    />
  );
}
