import { defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

const kontakt = {
  name: "kontakt",
  title: "Kontakt",
  type: "document",
  icon: EnvelopeIcon,

  fields: [
    defineField({
      name: "titel",
      title: "Titel",
      type: "string",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Add a custom slug for the URL or generate one from the menu",
      options: { source: "titel" },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
};

export default kontakt;
