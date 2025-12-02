import { type SchemaTypeDefinition } from "sanity";
import home from "./home";
import adresse from "./adresse";
import kontakt from "./kontakt";
import contactSubmission from "./contactSubmission";
import impressum from "./impressum";
import footer from "./footer";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [home, adresse, kontakt, contactSubmission, impressum, footer],
};
