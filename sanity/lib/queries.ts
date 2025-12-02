import { defineQuery } from "next-sanity";

export const NAVIGATION_QUERY = defineQuery(`
*[_type in ["home", "impressum"]] {titel, slug}`);
export const HOME_QUERY = defineQuery(`*[_type == "home"][0]{
  titel, slug, bild, text
}`);
export const KONTAKT_QUERY = defineQuery(`*[_type == "kontakt"][0]{
  titel, text
}`);
export const ADRESSE_QUERY = defineQuery(`*[_type == "adresse"][0]{
  text
}`);
export const IMPRESSUM_QUERY = defineQuery(`*[_type == "impressum"][0]{
  titel, slug, rechtliches, text
}`);
export const FOOTER_QUERY = defineQuery(`*[_type == "footer"][0]{
  text
}`);
