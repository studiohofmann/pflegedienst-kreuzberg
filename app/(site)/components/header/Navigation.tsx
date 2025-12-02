import { client } from "@/sanity/lib/client";
import { NAVIGATION_QUERY } from "@/sanity/lib/queries";
import NavigationClient from "./NavigationClient";

export default async function Navigation() {
  const navItems = await client.fetch(NAVIGATION_QUERY);

  return <NavigationClient items={navItems} />;
}
