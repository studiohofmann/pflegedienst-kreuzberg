import { defineField } from "sanity";
import { MarkerIcon } from "@sanity/icons";

const adresse = {
  name: "adresse",
  title: "Adresse",
  type: "document",
  icon: MarkerIcon,

  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
};

export default adresse;
