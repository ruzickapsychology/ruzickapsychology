import { LinkIcon, ImageIcon, ComposeIcon, DocumentsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .error("Alt text is required for published site images."),
    }),
  ],
});

export const simplePortableText = defineType({
  name: "simplePortableText",
  title: "Formatted text",
  type: "array",
  icon: ComposeIcon,
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            icon: LinkIcon,
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                    allowRelative: true,
                  }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Call to Action",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "label",
      title: "Button label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const pageHeader = defineType({
  name: "pageHeader",
  title: "Page Header",
  type: "object",
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),
  ],
});

export const address = defineType({
  name: "address",
  title: "Address",
  type: "object",
  fields: [
    defineField({
      name: "streetAddress",
      title: "Street address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addressLocality",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addressRegion",
      title: "State",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "postalCode",
      title: "Postal code",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addressCountry",
      title: "Country code",
      description: "Use the two-letter country code, such as US.",
      type: "string",
      initialValue: "US",
      validation: (rule) => rule.required().length(2).uppercase(),
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
    }),
    defineField({
      name: "line1",
      title: "Line 1 (Deprecated)",
      type: "string",
      deprecated: { reason: "Use Street address instead." },
      readOnly: true,
      hidden: ({ value }) => value === undefined,
      initialValue: undefined,
    }),
    defineField({
      name: "line2",
      title: "Line 2 (Deprecated)",
      type: "string",
      deprecated: { reason: "Use City, State, and Postal code instead." },
      readOnly: true,
      hidden: ({ value }) => value === undefined,
      initialValue: undefined,
    }),
  ],
});

export const externalProfile = defineType({
  name: "externalProfile",
  title: "External Profile",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
});
