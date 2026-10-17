import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  DEFAULT_AVAILABILITY_STATUS,
  initialAvailabilityBadgeMessages,
  initialAvailabilityMessaging,
} from "../../../config/availability";

const badgeMessageFields = [
  defineField({
    name: "line1",
    title: "Line 1",
    type: "string",
    description: "Keep this uppercase and 24 characters or fewer.",
    validation: (rule) => rule.required().max(24),
  }),
  defineField({
    name: "line2",
    title: "Line 2",
    type: "string",
    description: "Keep this uppercase and 24 characters or fewer.",
    validation: (rule) => rule.required().max(24),
  }),
];

const heroAndContactMessagingFields = [
  defineField({
    name: "heroCta",
    title: "Home hero button label",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "contactHeading",
    title: "Contact page heading",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "contactIntro",
    title: "Contact page intro",
    type: "text",
    rows: 3,
    validation: (rule) => rule.required(),
  }),
];

const homeBottomCtaFields = [
  defineField({
    name: "ctaHeading",
    title: "Home bottom CTA heading",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "ctaBody",
    title: "Home bottom CTA body",
    type: "text",
    rows: 2,
    validation: (rule) => rule.required(),
  }),
];

const pricingBottomCtaFields = [
  defineField({
    name: "pricingCtaHeading",
    title: "Pricing bottom CTA heading",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "pricingCtaBody",
    title: "Pricing bottom CTA body",
    type: "text",
    rows: 2,
    validation: (rule) => rule.required(),
  }),
];

const waitlistMessagingFields = [
  ...heroAndContactMessagingFields,
  ...homeBottomCtaFields,
  defineField({
    name: "homeCtaLabel",
    title: "Home bottom CTA button label",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  ...pricingBottomCtaFields,
  defineField({
    name: "pricingCtaLabel",
    title: "Pricing bottom CTA button label",
    type: "string",
    validation: (rule) => rule.required(),
  }),
];

const closedMessagingFields = [
  ...heroAndContactMessagingFields,
  ...homeBottomCtaFields,
  ...pricingBottomCtaFields,
  defineField({
    name: "panelHeading",
    title: "Contact panel heading",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "panelBody",
    title: "Contact panel body",
    type: "text",
    rows: 3,
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "contactMethodsLabel",
    title: "Contact methods label",
    type: "string",
    validation: (rule) => rule.required(),
  }),
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Practice Settings",
  type: "document",
  icon: CogIcon,
  initialValue: {
    availabilityStatus: DEFAULT_AVAILABILITY_STATUS,
    availabilityBadgeMessages: initialAvailabilityBadgeMessages,
    availabilityMessaging: initialAvailabilityMessaging,
  },
  groups: [
    { name: "practice", title: "Practice", default: true },
    { name: "availability", title: "Availability" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Practice name",
      type: "string",
      group: "practice",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "legalName",
      title: "Legal name",
      type: "string",
      group: "practice",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "practitioner",
      title: "Practitioner",
      type: "string",
      group: "practice",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
      group: "practice",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "practice",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "address",
      group: "practice",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "array",
      group: "practice",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "portalUrl",
      title: "Client portal URL",
      type: "url",
      group: "practice",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "availabilityStatus",
      title: "Availability status",
      type: "string",
      group: "availability",
      description:
        "Controls the home page badge, consultation calls to action, and contact form availability messaging.",
      options: {
        list: [
          { title: "Accepting new clients", value: "accepting" },
          { title: "Waitlist only", value: "waitlist" },
          { title: "Not accepting inquiries", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "accepting",
    }),
    defineField({
      name: "availabilityBadgeMessages",
      title: "Spinning badge messages",
      type: "object",
      group: "availability",
      description:
        "Two-line text shown in the rotating hero badge for each availability state.",
      options: { collapsible: true, collapsed: false },
      initialValue: initialAvailabilityBadgeMessages,
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "accepting",
          title: "Accepting new clients badge",
          type: "object",
          validation: (rule) => rule.required(),
          fields: badgeMessageFields,
        }),
        defineField({
          name: "waitlist",
          title: "Waitlist only badge",
          type: "object",
          validation: (rule) => rule.required(),
          fields: badgeMessageFields,
        }),
        defineField({
          name: "closed",
          title: "Not accepting inquiries badge",
          type: "object",
          validation: (rule) => rule.required(),
          fields: badgeMessageFields,
        }),
      ],
    }),
    defineField({
      name: "availabilityMessaging",
      title: "Availability messaging",
      type: "object",
      group: "availability",
      description:
        "Copy used when availability is set to Waitlist only or Not accepting inquiries.",
      options: { collapsible: true, collapsed: false },
      initialValue: initialAvailabilityMessaging,
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "waitlist",
          title: "Waitlist only copy",
          type: "object",
          options: { collapsible: true, collapsed: false },
          validation: (rule) => rule.required(),
          fields: waitlistMessagingFields,
        }),
        defineField({
          name: "closed",
          title: "Not accepting inquiries copy",
          type: "object",
          options: { collapsible: true, collapsed: true },
          validation: (rule) => rule.required(),
          fields: closedMessagingFields,
        }),
      ],
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
      group: "practice",
    }),
    defineField({
      name: "tagline",
      title: "Practice tagline",
      type: "text",
      group: "practice",
      rows: 3,
    }),
    defineField({
      name: "areaServed",
      title: "Areas served",
      type: "array",
      group: "practice",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "externalProfiles",
      title: "Verified external profiles",
      description:
        "Authoritative profiles used to connect the practice identity across the web. Add the Google Business Profile URL after verification.",
      type: "array",
      group: "practice",
      of: [defineArrayMember({ type: "externalProfile" })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Practice Settings" }),
  },
});
