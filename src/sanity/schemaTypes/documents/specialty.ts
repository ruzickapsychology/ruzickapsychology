import { TagIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const specialty = defineType({
  name: "specialty",
  title: "Therapy Specialty",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      description:
        "Used for compact specialty cards on the Home page and as the opening summary on the Specialties page.",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageStatus",
      title: "Detail page status",
      type: "string",
      description:
        "Published services receive a standalone, indexable page. Hub-only services appear only on the Specialties page.",
      options: {
        list: [
          { title: "Hub only", value: "hubOnly" },
          { title: "Published detail page", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "hubOnly",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageHeading",
      title: "Detail page heading",
      type: "string",
      hidden: ({ document }) => document?.pageStatus !== "published",
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.pageStatus === "published" && !value
            ? "Required for a published detail page."
            : true,
        ),
    }),
    defineField({
      name: "intro",
      title: "Detail page introduction",
      type: "text",
      rows: 4,
      hidden: ({ document }) => document?.pageStatus !== "published",
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.pageStatus === "published" && !value
            ? "Required for a published detail page."
            : true,
        ),
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "simplePortableText",
      hidden: ({ document }) => document?.pageStatus !== "published",
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.pageStatus === "published" &&
          (!Array.isArray(value) || value.length === 0)
            ? "Required for a published detail page."
            : true,
        ),
    }),
    defineField({
      name: "commonConcerns",
      title: "Common reasons people reach out",
      type: "array",
      hidden: ({ document }) => document?.pageStatus !== "published",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.pageStatus === "published" &&
          (!Array.isArray(value) || value.length < 3)
            ? "Add at least three concerns for a published detail page."
            : true,
        ),
    }),
    defineField({
      name: "approachHeading",
      title: "Approach heading",
      type: "string",
      hidden: ({ document }) => document?.pageStatus !== "published",
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.pageStatus === "published" && !value
            ? "Required for a published detail page."
            : true,
        ),
    }),
    defineField({
      name: "approachBody",
      title: "Approach",
      type: "simplePortableText",
      hidden: ({ document }) => document?.pageStatus !== "published",
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.pageStatus === "published" &&
          (!Array.isArray(value) || value.length === 0)
            ? "Required for a published detail page."
            : true,
        ),
    }),
    defineField({
      name: "whatToExpect",
      title: "What sessions can involve",
      type: "simplePortableText",
      hidden: ({ document }) => document?.pageStatus !== "published",
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.pageStatus === "published" &&
          (!Array.isArray(value) || value.length === 0)
            ? "Required for a published detail page."
            : true,
        ),
    }),
    defineField({
      name: "faqs",
      title: "Service FAQs",
      type: "array",
      hidden: ({ document }) => document?.pageStatus !== "published",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.pageStatus === "published" &&
          (!Array.isArray(value) || value.length < 3)
            ? "Add at least three FAQs for a published detail page."
            : true,
        ),
    }),
    defineField({
      name: "relatedPosts",
      title: "Related blog posts",
      type: "array",
      hidden: ({ document }) => document?.pageStatus !== "published",
      of: [defineArrayMember({ type: "reference", to: [{ type: "post" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "details",
      title: "Specialties-page details (Deprecated)",
      description:
        "This content has moved to Overview. It remains visible temporarily so production content can be migrated safely.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      deprecated: { reason: "Use the Overview field instead." },
      readOnly: true,
      hidden: ({ value }) => value === undefined,
      initialValue: undefined,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "summary" },
  },
});
