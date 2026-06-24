import {PortableText, type PortableTextBlock, type PortableTextComponents} from '@portabletext/react'

export type PortableTextValue = PortableTextBlock[]

const components: PortableTextComponents = {
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      return (
        <a href={href} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
          {children}
        </a>
      )
    },
  },
}

export function PortableContent({
  value,
  className,
}: {
  value?: PortableTextValue | null
  className?: string
}) {
  if (!value?.length) return null

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
