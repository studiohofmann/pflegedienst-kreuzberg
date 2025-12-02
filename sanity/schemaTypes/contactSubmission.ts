import { defineType, defineField } from "sanity";
import { MarkerIcon } from "@sanity/icons";

export default defineType({
  name: "contactSubmission",
  type: "document",
  title: "Contact Form Submissions",
  icon: MarkerIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime" }),
  ],
});
