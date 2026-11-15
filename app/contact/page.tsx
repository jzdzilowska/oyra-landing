import type { Metadata } from "next";
import OyraSite from "../oyra-site";

export const metadata: Metadata = { title: "Contact — Oyra", description: "Contact Oyra for project enquiries, supplier introductions, or a platform demonstration." };

export default function Page() { return <OyraSite page="contact" />; }
