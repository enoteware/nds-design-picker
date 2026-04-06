import { notFound } from "next/navigation";
import { getStyles } from "@/lib/styles";
import { PreviewClient } from "./PreviewClient";

const STYLES = getStyles();

export function generateStaticParams() {
  return STYLES.map((s) => ({ style: s.slug }));
}

export default async function PreviewPage(props: { params: Promise<{ style: string }> }) {
  const params = await props.params;
  const styleObj = STYLES.find((s) => s.slug === params.style);
  
  if (!styleObj) {
    notFound();
  }

  return <PreviewClient styleObj={styleObj} />;
}
