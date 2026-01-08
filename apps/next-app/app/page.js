import HomeContent from "./components/home-content";
import { getHomeCopy } from "./lib/home-copy";

const { zhCopy, enCopy } = getHomeCopy();

export const metadata = {
  title: zhCopy.site.name,
  description: zhCopy.hero.subtitle
};

export default function Home() {
  return <HomeContent zhCopy={zhCopy} enCopy={enCopy} />;
}
