import HomeContent from "./components/home-content";
import { cookies } from "next/headers";
import { getHomeCopy, LOCALE_COOKIE_NAME, normalizeLocale } from "./lib/home-copy";

const { zhCopy, enCopy } = getHomeCopy();

export const metadata = {
  title: zhCopy.site.name,
  description: zhCopy.hero.subtitle
};

export default async function Home() {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  return (
    <HomeContent zhCopy={zhCopy} enCopy={enCopy} initialLocale={initialLocale} />
  );
}
