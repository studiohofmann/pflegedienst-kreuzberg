import { defineField } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";

const impressum = {
  name: "impressum",
  title: "Impressum",
  type: "document",
  icon: InfoOutlineIcon,

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
      name: "rechtliches",
      title: "Rechtliches",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
};

export default impressum;
