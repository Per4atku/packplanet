import { getMainContent } from "@/lib/content";
import { getProductCount } from "@/lib/queries/products";
import { HeaderAnimated } from "./header-animated";

export async function Header() {
  const content = getMainContent();
  const productCount = await getProductCount();

  return (
    <HeaderAnimated
      siteName={content.site.name}
      siteShortName={"Планета Упаковки"}
      nav={content.header.nav}
      showCatalog={productCount > 0}
    />
  );
}
