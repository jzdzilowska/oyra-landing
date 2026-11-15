import type { Metadata } from "next";
import OyraSite from "../oyra-site";

export const metadata: Metadata = { title: "About — Oyra", description: "About Oyra and our approach to material sourcing for architecture and interiors." };

export default function Page() { return <OyraSite page="about" />; }
