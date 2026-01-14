import { getMainContent } from "@/lib/content";
import { HeaderAnimated } from "./header-animated";

export function Header() {
  const content = getMainContent();

  return (
    <HeaderAnimated
      siteName={content.site.name}
      siteShortName={"Планета Упаковки"}
      nav={content.header.nav}
    />
  );
}
