import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Practice Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "name",
      title: "Practice name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "legalName",
      title: "Legal name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "practitioner",
      title: "Practitioner",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "address",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "portalUrl",
      title: "Client portal URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "tagline",
      title: "Practice tagline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "areaServed",
      title: "Areas served",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Practice Settings" }),
  },
});
