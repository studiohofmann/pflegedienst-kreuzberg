"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { titel: string; slug: { current: string } };

export default function NavigationClient({ items }: { items: NavItem[] }) {
  const pathname = usePathname() || "/";

  const normalize = (p?: string) => {
    if (!p) return "/";
    let s = p;
    if (!s.startsWith("/")) s = "/" + s;
    if (s !== "/" && s.endsWith("/")) s = s.slice(0, -1);
    return s;
  };

  const pathnameNormalized = normalize(pathname);

  return (
    <nav>
      <ul className="flex gap-4 float-right">
        {items.map((item) => {
          const slug = item.slug?.current ?? "";
          const href =
            slug === "" || slug === "home" || slug === "/" ? "/" : `/${slug}`;
          const hrefNormalized = normalize(href);

          const isActive =
            pathnameNormalized === hrefNormalized ||
            (hrefNormalized !== "/" &&
              pathnameNormalized.startsWith(hrefNormalized + "/"));

          const active = isActive ? "!text-[#0054a6]" : "text-inherit";
          return (
            <li key={item.slug.current ?? item.titel}>
              <Link href={href} className={` ${active}`}>
                {item.titel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
