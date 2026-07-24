import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "simplePortableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sources",
      title: "Research sources",
      description:
        "Primary research or authoritative clinical sources supporting substantive claims in this article.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Source title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "citation",
              title: "Citation",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Source URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["https"] }),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "citation" },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Publish date, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", publishedAt: "publishedAt" },
    prepare({ title, publishedAt }) {
      return {
        title,
        subtitle: publishedAt
          ? new Date(publishedAt).toLocaleDateString()
          : undefined,
      };
    },
  },
});
