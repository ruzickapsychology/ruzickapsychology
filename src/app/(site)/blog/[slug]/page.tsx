import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPostMetadata } from "@/config/seo";
import { getOlderPostMeta, getPost, getPostSlugsForBuild } from "@/data/blog";
import {
  getHomePage,
  getPublishedServiceDefinitions,
  getSiteSettings,
} from "@/data/cms";
import { POST_SERVICE_LINKS } from "@/config/services";
import { BlogPostPage } from "@/page-modules/blog-post";

export async function generateStaticParams() {
  return (await getPostSlugsForBuild()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};

  return blogPostMetadata(post);
}

export default async function BlogPostRoute(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [olderPost, publishedServices, home, site] = await Promise.all([
    getOlderPostMeta(slug),
    getPublishedServiceDefinitions(),
    getHomePage(),
    getSiteSettings(),
  ]);
  const configuredServiceLink = POST_SERVICE_LINKS[post.slug];
  const serviceLink =
    configuredServiceLink &&
    (!configuredServiceLink.serviceSlug ||
      publishedServices.some(
        (service) => service.slug === configuredServiceLink.serviceSlug,
      ))
      ? configuredServiceLink
      : undefined;

  return (
    <BlogPostPage
      post={post}
      olderPost={olderPost}
      serviceLink={serviceLink}
      ctaContent={home?.cta}
      site={site}
    />
  );
}
