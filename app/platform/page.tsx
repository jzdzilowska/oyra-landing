import type { Metadata } from "next";
import OyraSite from "../oyra-site";

export const metadata: Metadata = { title: "Platform — Oyra", description: "Source architectural materials, compare supplier quotes, coordinate samples, and prepare approved finishes for purchase." };

export default function Page() { return <OyraSite page="platform" />; }
