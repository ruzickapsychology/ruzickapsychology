import {
  DocumentTextIcon,
  HelpCircleIcon,
  LaunchIcon,
  NumberIcon,
} from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const credentialItem = defineType({
  name: "credentialItem",
  title: "Credential Item",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detail",
      title: "Detail",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
});

export const credentialGroup = defineType({
  name: "credentialGroup",
  title: "Credential Group",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [defineArrayMember({ type: "credentialItem" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "license",
      title: "License note",
      type: "string",
    }),
  ],
});

export const processStep = defineType({
  name: "processStep",
  title: "Process Step",
  type: "object",
  icon: NumberIcon,
  fields: [
    defineField({
      name: "number",
      title: "Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
});

export const feeItem = defineType({
  name: "feeItem",
  title: "Fee Item",
  type: "object",
  icon: LaunchIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detail",
      title: "Detail",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});

export const therapySpaceSection = defineType({
  name: "therapySpaceSection",
  title: "Therapy Space Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
    defineField({
      name: "exteriorImage",
      title: "Exterior image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "interiorImage",
      title: "Interior image",
      type: "imageWithAlt",
    }),
  ],
});

export const quoteSection = defineType({
  name: "quoteSection",
  title: "Quote Section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "attribution", title: "Attribution", type: "string" }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "imageWithAlt",
    }),
  ],
});
