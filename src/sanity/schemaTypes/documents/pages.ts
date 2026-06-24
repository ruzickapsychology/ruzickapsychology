import {DocumentIcon, HelpCircleIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const singletonPreview = (title: string) => ({
  prepare: () => ({title}),
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'kicker', title: 'Kicker', type: 'string'}),
        defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
        defineField({name: 'ctaLabel', title: 'Button label', type: 'string'}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'imageWithAlt'}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'specialtiesSection',
      title: 'Specialties section',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({
          name: 'specialties',
          title: 'Featured specialties',
          type: 'array',
          of: [defineArrayMember({type: 'reference', to: [{type: 'specialty'}]})],
        }),
      ],
    }),
    defineField({
      name: 'aboutPreview',
      title: 'About preview',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
        defineField({name: 'ctaLabel', title: 'Link label', type: 'string'}),
        defineField({name: 'portraitImage', title: 'Portrait image', type: 'imageWithAlt'}),
      ],
    }),
    defineField({
      name: 'ctaSection',
      title: 'Contact CTA',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
        defineField({name: 'ctaLabel', title: 'Button label', type: 'string'}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'imageWithAlt'}),
      ],
    }),
  ],
  preview: singletonPreview('Home Page'),
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Dr. Ruzicka',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'credentials', title: 'Credentials line', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'portraitImage', title: 'Portrait image', type: 'imageWithAlt'}),
    defineField({name: 'intro', title: 'Bio copy', type: 'simplePortableText'}),
    defineField({
      name: 'credentialGroups',
      title: 'Education and training',
      type: 'array',
      of: [defineArrayMember({type: 'credentialGroup'})],
    }),
    defineField({name: 'space', title: 'Therapy space', type: 'therapySpaceSection'}),
    defineField({name: 'philosophy', title: 'Quote section', type: 'quoteSection'}),
  ],
  preview: singletonPreview('About Dr. Ruzicka'),
})

export const specialtiesPage = defineType({
  name: 'specialtiesPage',
  title: 'Specialties Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'header', title: 'Page header', type: 'pageHeader'}),
    defineField({
      name: 'specialties',
      title: 'Specialty order',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'specialty'}]})],
    }),
    defineField({
      name: 'modality',
      title: 'Modality section',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'body', title: 'Body', type: 'simplePortableText'}),
        defineField({name: 'backgroundImage', title: 'Background image', type: 'imageWithAlt'}),
      ],
    }),
  ],
  preview: singletonPreview('Specialties Page'),
})

export const pricingPage = defineType({
  name: 'pricingPage',
  title: 'Pricing & Insurance',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'header', title: 'Page header', type: 'pageHeader'}),
    defineField({
      name: 'fees',
      title: 'Session fees',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'items', title: 'Fee items', type: 'array', of: [defineArrayMember({type: 'feeItem'})]}),
        defineField({name: 'note', title: 'Note', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'insurance',
      title: 'Insurance',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'body', title: 'Body', type: 'simplePortableText'}),
      ],
    }),
    defineField({name: 'cta', title: 'Contact CTA', type: 'cta'}),
    defineField({name: 'ctaBackgroundImage', title: 'CTA background image', type: 'imageWithAlt'}),
  ],
  preview: singletonPreview('Pricing & Insurance'),
})

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'header', title: 'Header', type: 'pageHeader'}),
    defineField({name: 'headerBackgroundImage', title: 'Header background image', type: 'imageWithAlt'}),
    defineField({
      name: 'process',
      title: 'Process section',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'steps', title: 'Steps', type: 'array', of: [defineArrayMember({type: 'processStep'})]}),
      ],
    }),
  ],
  preview: singletonPreview('Contact Page'),
})

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [defineArrayMember({type: 'faqItem'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'cta', title: 'Contact CTA', type: 'cta'}),
    defineField({name: 'ctaBackgroundImage', title: 'CTA background image', type: 'imageWithAlt'}),
  ],
  preview: singletonPreview('FAQ Page'),
})
