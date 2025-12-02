import { client } from "@/sanity/lib/client";
import { IMPRESSUM_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

export default async function Impressum() {
  const impressum = await client.fetch(IMPRESSUM_QUERY);

  return (
    <section>
      {impressum ? (
        <>
          <h1>{impressum.titel}</h1>

          {impressum.rechtliches && (
            <>
              <PortableText value={impressum.rechtliches} />
            </>
          )}

          {impressum.text && (
            <>
              <PortableText value={impressum.text} />
            </>
          )}
        </>
      ) : (
        <div>Kein Impressum gefunden.</div>
      )}
    </section>
  );
}
