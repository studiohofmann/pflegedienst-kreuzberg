import { client } from "@/sanity/lib/client";
import { ADRESSE_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

export default async function Adresse() {
  const adresse = await client.fetch(ADRESSE_QUERY);

  return (
    <>
      {adresse ? (
        <>{adresse.text && <PortableText value={adresse.text} />}</>
      ) : (
        <div>Keine Adresse gefunden.</div>
      )}
    </>
  );
}
