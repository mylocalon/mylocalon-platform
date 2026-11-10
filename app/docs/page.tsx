import type { Metadata } from "next";
import { DocView } from "./DocView";

export const metadata: Metadata = {
  title: "Docs · mylocalon",
  description: "Install the mylocalon CLI, share localhost, and learn the API.",
};

export default function DocsIndex() {
  return <DocView slug="introduction" />;
}
