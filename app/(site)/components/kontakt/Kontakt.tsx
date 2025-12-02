import { client } from "@/sanity/lib/client";
import { KONTAKT_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

export default async function Kontakt() {
  const kontakt = await client.fetch(KONTAKT_QUERY);

  return (
    <>
      {kontakt ? (
        <>
          <h1>{kontakt.titel}</h1>
          {kontakt.text && <PortableText value={kontakt.text} />}
        </>
      ) : (
        <div>Keine Kontaktinformationen gefunden.</div>
      )}
    </>
  );
}
