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
        rule.warning("Alt text helps describe the image for accessibility."),
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
      name: "line1",
      title: "Line 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "line2",
      title: "Line 2",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
    }),
  ],
});
