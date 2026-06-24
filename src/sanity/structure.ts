import type {StructureResolver} from 'sanity/structure'

const singletonTypes = new Set([
  'siteSettings',
  'homePage',
  'aboutPage',
  'specialtiesPage',
  'pricingPage',
  'contactPage',
  'faqPage',
  'specialty',
  'post',
])

function singletonListItem(
  S: Parameters<StructureResolver>[0],
  id: string,
  title: string,
) {
  return S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType(id).documentId(id).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singletonListItem(S, 'siteSettings', 'Practice Settings'),
      S.divider(),
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              singletonListItem(S, 'homePage', 'Home Page'),
              singletonListItem(S, 'aboutPage', 'About Dr. Ruzicka'),
              singletonListItem(S, 'specialtiesPage', 'Specialties Page'),
              singletonListItem(S, 'pricingPage', 'Pricing & Insurance'),
              singletonListItem(S, 'contactPage', 'Contact Page'),
              singletonListItem(S, 'faqPage', 'FAQ Page'),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('specialty').title('Therapy Specialties'),
      S.documentTypeListItem('post').title('Blog Posts'),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? ''),
      ),
    ])
