import { defineField } from "sanity";
import { ArrowDownIcon } from "@sanity/icons";

const footer = {
  name: "footer",
  title: "Footer",
  type: "document",
  icon: ArrowDownIcon,

  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
};

export default footer;
