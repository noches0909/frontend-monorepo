import { cookies } from "next/headers";
import LandingExperiment from "../components/landing-experiment";
import WorkbenchShell from "../components/workbench-shell";
import {
  getHomeCopy,
  LOCALE_COOKIE_NAME,
  normalizeLocale
} from "../lib/home-copy";

const { zhCopy, enCopy } = getHomeCopy();

export const metadata = {
  title: "落地页实验",
  description: "Next 落地页实验页面"
};

export default async function LandingLabPage() {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  return (
    <WorkbenchShell>
      <LandingExperiment
        zhCopy={zhCopy}
        enCopy={enCopy}
        initialLocale={initialLocale}
      />
    </WorkbenchShell>
  );
}
