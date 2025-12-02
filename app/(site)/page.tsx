import { client } from "@/sanity/lib/client";
import { HOME_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import SanityImage from "./reuseable-components/SanityImage";
import Kontakt from "./components/kontakt/Kontakt";
import ContactForm from "./components/kontakt/ContactForm";

export default async function Home() {
  const home = await client.fetch(HOME_QUERY);

  return (
    <div className="space-y-16">
      <section>
        {home.bild && (
          <SanityImage
            image={home.bild}
            alt={home.titel}
            width={1920}
            height={1080}
            sizes="100vw"
            style={{ width: "100vw", height: "auto" }}
            priority // for hero images
          />
        )}
        <PortableText value={home.text} />
      </section>
      <section>
        <Kontakt />
        <ContactForm />
      </section>
    </div>
  );
}
