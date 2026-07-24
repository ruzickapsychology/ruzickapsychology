import Link from "next/link";
import { ContentSection } from "@/components/content-section";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Stack } from "@/components/stack";
import { Heading, Text } from "@/components/typography";

export function PrivacyPage() {
  return (
    <PageShell>
      <PageHeader>
        <PageHeaderContent align="left">
          <PageHeaderEyebrow>Website information</PageHeaderEyebrow>
          <PageHeaderTitle>Privacy Notice</PageHeaderTitle>
          <PageHeaderDescription>
            This notice explains what information this website handles and which
            service providers support it.
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>

      <ContentSection size="spacious" containerSize="md">
        <Stack gap="xl">
          <Stack as="section" gap="sm">
            <Heading as="h2" size="section">
              Contact-form information
            </Heading>
            <Text>
              When you submit the consultation form, Ruzicka Psychology receives
              the information you choose to provide, such as your name, contact
              details, location, therapy interest, scheduling preferences, and
              message.
            </Text>
            <Text>
              The form is delivered through Web3Forms. Please use it for
              scheduling questions or a brief general note—not emergencies,
              detailed medical information, or highly sensitive clinical
              history. Submitting the form does not establish a
              psychologist-client relationship.
            </Text>
          </Stack>

          <Stack as="section" gap="sm">
            <Heading as="h2" size="section">
              Website and analytics data
            </Heading>
            <Text>
              Vercel hosts the website and provides privacy-focused website
              analytics and performance measurements. These services may process
              technical information such as page visits, device or browser
              details, approximate location, and performance data.
            </Text>
            <Text>
              Website measurement excludes URL query parameters and fragments.
              Custom interaction events do not include the information you type
              into the contact form.
            </Text>
            <Text>
              Sanity provides the website&apos;s content-management and image
              delivery services. Requests for published content and images may
              be processed through Sanity&apos;s infrastructure.
            </Text>
            <Text>
              The contact page includes a Google Maps embed. Loading the map
              connects your browser to Google, which may process technical
              information about that request. Client portal links take you to
              SimplePractice, where its privacy terms apply.
            </Text>
          </Stack>

          <Stack as="section" gap="sm">
            <Heading as="h2" size="section">
              How information is used
            </Heading>
            <Text>
              Information submitted through the site is used to respond to
              inquiries, manage scheduling, maintain the website, understand
              aggregate site use, prevent abuse, and meet applicable
              administrative or legal obligations.
            </Text>
          </Stack>

          <Stack as="section" gap="sm">
            <Heading as="h2" size="section">
              Your choices
            </Heading>
            <Text>
              You may choose not to use the contact form and instead use the
              contact information shown on this website. You may also ask a
              question about website information or request an appropriate
              correction or deletion by contacting Ruzicka Psychology.
            </Text>
            <Text>
              For questions about this notice, use the{" "}
              <Link href="/contact">contact page</Link>.
            </Text>
          </Stack>

          <Text variant="detail" tone="subdued">
            Website information updated October 16, 2026.
          </Text>
        </Stack>
      </ContentSection>
    </PageShell>
  );
}
