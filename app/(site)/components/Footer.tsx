import { client } from "@/sanity/lib/client";
import { FOOTER_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import Adresse from "./Adresse";

export default async function Footer() {
  const footer = await client.fetch(FOOTER_QUERY);
  const year = new Date().getFullYear();

  return (
    <footer>
      <Adresse />
      <div className="flex text-xs justify-center">
        <span>{year}&nbsp;</span>
        <PortableText value={footer.text} />
      </div>
    </footer>
  );
}
