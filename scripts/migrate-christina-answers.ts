import fs from "node:fs";
import { markdownToPortableText } from "@portabletext/markdown";
import { getCliClient } from "sanity/cli";
import {
  assertReviewedPlan,
  buildMigrationPlan,
  stableContentKeys,
  type MigrationDocument,
  type MigrationPatch,
} from "./seo-migration-plan";

/**
 * Publishes Christina Ruzicka's answers from the November 2026 questions document.
 * Preview first with --plan <fresh path>; apply the same plan with --apply --backup <fresh path>.
 * Billing codes, PSYPACT and unconfirmed crisis details are deliberately not published.
 */
const rich = (prefix: string, ...paragraphs: string[]) =>
  stableContentKeys(
    markdownToPortableText(paragraphs.join("\n\n")),
    prefix,
  ) as unknown[];

type Item = { _key: string; question: string; [key: string]: unknown };
const faq = (key: string, question: string, ...paragraphs: string[]): Item => ({
  _key: key,
  question,
  answerRichText: rich(key, ...paragraphs),
});

const email =
  "[Christina@ruzickapsychology.com](mailto:Christina@ruzickapsychology.com)";

const crisisResources = [
  "If you are in immediate danger or unable to keep yourself or someone else safe, call 911 or go to the nearest emergency department. Ruzicka Psychology does not provide 24-hour crisis coverage.",
  `- **988 Suicide & Crisis Lifeline:** call or text 988, 24/7, for suicidal thoughts, emotional distress, mental health concerns or substance use crises.
- **211/LIFE LINE:** call 211 or 1-877-356-9211, or text 898211, for crisis support and connection with community resources in the Finger Lakes region.
- **UR Medicine Mental Health Crisis Call Line:** call (585) 275-8686, 24/7, for crisis counseling. Counselors can connect Monroe County residents with the Mobile Crisis Team when appropriate. For a risk of suicide or an urgent safety concern, use 988 or 911.
- **Behavioral Health Access and Crisis Center:** adults 18 and older can walk in without an appointment at 65 Genesee Street, Rochester, for urgent mental health or substance use support. Call (585) 368-3950 for current hours.
- **Willow Domestic Violence Center:** call (585) 222-SAFE (7233) for confidential, 24/7 domestic violence crisis and support services.`,
];

const perinatalResources = `- **National Maternal Mental Health Hotline:** call or text 1-833-TLC-MAMA (1-833-852-6262) for free, confidential, 24/7 support during pregnancy and postpartum, in English and Spanish. This is a support line, not an emergency service.
- **Postpartum Support International HelpLine:** call 1-800-944-4773 and press 1 for Spanish or 2 for English. Text HELP to 800-944-4773 in English or 971-203-7773 in Spanish. It offers support, information and connections to perinatal resources. It is not an emergency hotline.`;

const sessionLength = [
  "The first session is priced at the same rate as later sessions.",
  "Individual therapy appointments are scheduled in a 60-minute block: 45–50 minutes of face-to-face therapy and 10–15 minutes for clinical documentation and treatment planning. The fee is $225 per session.",
  "Couples therapy sessions include 60 minutes of face-to-face time, with an additional 15 minutes reserved afterward for documentation and treatment planning. The fee is $275 per session.",
];

const refundPolicy =
  "Payment reserves space for both partners. Cancellations received at least seven calendar days before the workshop are eligible for a full refund or a one-time transfer to another workshop within three months. Cancellations made three to six days before the workshop are nonrefundable but may be transferred once. Cancellations made less than 72 hours before the workshop and no-shows are nonrefundable and ordinarily nontransferable. Exceptions for serious illness or emergencies may be considered individually. If Ruzicka Psychology cancels the workshop or determines during screening that the group is not an appropriate fit, couples will receive a full refund or, when applicable, may transfer their registration.";

const notFor = `This workshop is not appropriate when there is:

- Ongoing abuse, intimidation, coercive control, stalking, or fear of retaliation
- Current physical or sexual violence
- An active or undisclosed affair
- An acute mental health, substance use, or relationship crisis
- An immediate separation decision or high-conflict legal proceeding
- A partner who feels pressured or unsafe participating`;

function replaceText<T>(value: T, from: string, to: string): T {
  let found = false;
  const walk = (node: unknown): unknown => {
    if (typeof node === "string") {
      if (node.includes(from)) found = true;
      return node.replace(from, to);
    }
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object")
      return Object.fromEntries(
        Object.entries(node).map(([key, entry]) => [
          key,
          key.startsWith("_") ? entry : walk(entry),
        ]),
      );
    return node;
  };
  const result = walk(value) as T;
  if (!found) throw new Error(`Expected copy not found: ${from}`);
  return result;
}

const byKey = (items: Item[], key: string) => {
  const item = items.find((entry) => entry._key === key);
  if (!item) throw new Error(`Missing item ${key}`);
  return item;
};

function faqItems(document: MigrationDocument) {
  const items = document.items as Item[];
  const help = byKey(items, "items-what-do-you-help-with");
  const style = byKey(
    items,
    "items-what-is-your-therapy-style-and-what-does-working-with-you-feel-like",
  );
  const virtual = byKey(items, "items-virtual-appointments");
  const virtualLinks = (virtual.answerRichText as Array<{ _key: string }>).at(
    -1,
  )!;
  return [
    {
      ...help,
      answer: [
        "I see adults 18 and older, couples, and new and expecting parents, including fathers, partners, and people on surrogacy, adoption or IVF journeys. My work focuses on relationships, pregnancy and postpartum mood disorders, anxiety, disordered eating and self-esteem. My practice is LGBTQ+-affirming, and ENM and polyamorous couples are welcome.",
        ...(help.answer as string[]),
      ],
    },
    replaceText(
      style,
      "an invitation to transformational change",
      "an invitation to meaningful change",
    ),
    faq(
      "items-common-misunderstanding",
      "What do people misunderstand about therapy?",
      "One of the most common misunderstandings is that therapy is something done to you, as if you come in, the therapist diagnoses the problem, and then fixes it. Therapy with me works differently. It's a collaboration. You are the expert on your own life, values and experiences. I bring training, perspective and tools. Together we clarify what matters to you, decide what we'll work on, and adjust as we go.",
      "That means you have a real voice in the process. You choose the pace, you can tell me when something isn't helpful, and we'll change course together. Much of the meaningful change happens between sessions too, as you try new ways of thinking, relating and responding in everyday life.",
    ),
    byKey(items, "items-what-happens-in-the-first-session"),
    faq(
      "items-first-session-length",
      "How long is the first session, and is it priced differently?",
      ...sessionLength,
    ),
    faq(
      "items-how-many-sessions",
      "How many sessions will I need, and how often?",
      "The length of therapy varies depending on your goals, the concerns bringing you in, and the level of support you need. Some clients come for focused, short-term work, while others benefit from longer-term therapy. We will discuss your goals at the beginning of treatment and regularly review your progress together.",
      "Most clients begin with weekly sessions to establish consistency and momentum. As progress is made and new skills feel more established, we may transition to every-other-week sessions or schedule less frequently in preparation for ending therapy. The frequency and duration of treatment are individualized and decided collaboratively.",
    ),
    {
      _key: "items-what-are-your-fees-and-do-you-take-insurance",
      question: "What are your fees, and do you take insurance?",
      answerRichText: rich(
        "items-fees-insurance",
        "Current session fees are listed on the [Pricing page](/pricing). I am in network with Aetna through Headway for individual therapy. I do not accept other insurance plans.",
        "If you plan to use out-of-network benefits, I send a superbill automatically each month, and more often on request if you need one weekly. If you have questions about payment, superbills or your benefits, we can talk through them before beginning.",
      ),
    },
    faq(
      "items-payment-sliding-scale",
      "What payment methods do you take, and do you offer a sliding scale?",
      "I accept card, HSA, FSA and check. I also offer limited sliding scale slots for self-pay clients, based on household size and annual income. The income levels are listed on the [Pricing page](/pricing).",
    ),
    faq(
      "items-cancellation",
      "What is your cancellation policy?",
      "Please give 24 hours' notice of cancellation. Otherwise, the full session fee applies. The Stronger Together workshop has its own [cancellation and refund policy](/specialties/group-therapy).",
    ),
    {
      _key: "items-how-do-i-get-started",
      question: "How do I get started?",
      answerRichText: rich(
        "items-get-started",
        "After you contact me, we will begin by emailing about a few practical details, including what you are looking for, scheduling, fees, and insurance or payment options. I reply as soon as I am able, within 2 business days.",
        "The next step is a brief, complimentary 15-minute phone consultation. This gives you an opportunity to share what is bringing you to therapy, ask questions, and learn more about my approach. We will also consider whether my services feel like an appropriate fit for your needs.",
        "If we decide to move forward, I will create your secure client portal and schedule your first appointment. Before we meet, you will complete intake paperwork, practice policies and informed-consent forms. For couples therapy, each partner may be asked to complete certain forms individually.",
        "During the first session, we will discuss what brings you to therapy in greater depth, identify your goals, and begin understanding the patterns or concerns you would like to address. You do not need to arrive with everything figured out. We will develop a direction for our work together.",
      ),
    },
    {
      ...virtual,
      answerRichText: [
        ...rich(
          "virtual-faq-nov",
          "Yes. Christina offers virtual therapy to clients located in New York, along with in-person appointments at the Rochester office. You must be physically in New York for each virtual session. Sessions use SimplePractice or Zoom.",
          "Couples can join from two different places as long as both partners are in New York, although it is preferred that you are in the same location. Perinatal clients may join with the baby present.",
        ),
        virtualLinks,
      ],
    },
    faq(
      "items-partners-babies",
      "Can partners or babies come to perinatal sessions?",
      "Yes. Partners and babies may be included when their participation is clinically appropriate and supports the individual's treatment goals. We can discuss in advance who should attend and how their presence may be most helpful for the work we are doing together.",
    ),
    faq(
      "items-partners-alone",
      "In couples therapy, do you meet with each partner alone?",
      "Sometimes. When clinically appropriate, I may meet briefly with each partner individually as part of the couples assessment or ongoing treatment. These meetings provide space to better understand each person's history, perspective, concerns and goals.",
      "Individual meetings remain part of the couples therapy, not separate individual treatment. Before meeting separately, we will discuss confidentiality and how information shared individually will be handled within the couples work. Separate meetings may also be recommended when a private safety assessment or additional clinical clarification is needed.",
    ),
    faq(
      "items-medication",
      "Do you prescribe medication?",
      "No, I do not prescribe. I coordinate with psychiatrists and OB/GYNs when needed and if a release of information has been signed by the client.",
    ),
    faq(
      "items-refer-out",
      "When would you refer me to someone else?",
      "I refer out severe and persistent mental health disorders that require a high level of care, eating disorders that require a high level of care, active addiction, and crisis care.",
    ),
    faq(
      "items-stronger-together",
      "What is the Stronger Together workshop?",
      "Stronger Together is a monthly, skills-based workshop for couples at the South Avenue office. It costs $175 per couple and includes workbooks. See [dates and details](/specialties/group-therapy).",
    ),
    faq(
      "items-parking-access",
      "Where do I park, and what happens when I arrive?",
      "The office is on the first floor of 1577 South Ave. There is a free parking lot attached to the building, and ample parking on the neighborhood streets if the lot is ever full. RTS Route 13 runs along South Avenue.",
      "The first floor is wheelchair accessible, with a portable ramp that can be laid out for step-free entry. Please wait in the waiting room when you arrive, and I will come to get you.",
    ),
    faq("items-crisis", "What if I need help right away?", ...crisisResources),
  ];
}

function buildPatch(document: MigrationDocument): MigrationPatch {
  const publishedId = document._id.replace(/^drafts\./, "");
  const id = document._id;
  switch (publishedId) {
    case "siteSettings":
      return {
        id,
        values: {
          "address.line1": "1577 South Ave, 1st Floor",
          areaServed: ["Rochester, NY", "Monroe County, NY", "New York"],
          hours: [
            "Mon · 9:00am – 6:00pm",
            "Tue · 5:00pm – 9:30pm",
            "Wed · 5:00pm – 9:30pm",
            "Thu · 5:00pm – 9:30pm",
            "Fri · Closed, open by request",
          ],
          safetyNotice:
            "This practice does not provide emergency care. In crisis or thinking about harming yourself? Call or text 988 (Suicide & Crisis Lifeline, free, 24/7). In immediate danger? Call 911 or go to the nearest emergency room.",
        },
      };
    case "contactPage": {
      const steps = (document.process as { steps: Item[] }).steps;
      const body: Record<string, string> = {
        "01": "Use the form, email or phone to share your name and how to reach you. I reply within 2 business days.",
        "02": "We'll email about scheduling, fees, and insurance or payment options, then have a free 15-minute phone consultation to answer your questions and explore whether we're a good fit.",
        "03": "If we decide to move forward, I'll create your secure client portal and schedule your first appointment. You'll complete intake paperwork, practice policies and consent forms before we meet.",
      };
      return {
        id,
        values: {
          "header.intro":
            "I am currently accepting new couples, including for the Stronger Together workshop. My individual practice is nearly full. Appointments are in person and virtual across New York. I'll be in touch within 2 business days.",
          formNote:
            "Not for emergencies. This form is not monitored around the clock. We usually reply within 2 business days. In crisis or thinking about harming yourself? Call or text 988 (Suicide & Crisis Lifeline, free, 24/7). In immediate danger? Call 911 or go to the nearest emergency room. Please share only your name and how to reach you. Don't include health details in this form. We'll talk about those privately.",
          "process.steps": steps.map((step) => ({
            ...step,
            body: body[step.number as string] ?? step.body,
          })),
        },
      };
    }
    case "pricingPage":
      return {
        id,
        values: {
          "fees.items": [
            {
              _key: "fees-items-individual-therapy",
              label: "Individual Therapy",
              detail: "60-minute block (45–50 minutes face to face)",
              price: "$225",
            },
            {
              _key: "fees-items-couples-imago-therapy",
              label: "Couples / Imago Therapy",
              detail: "75-minute block (60 minutes face to face)",
              price: "$275",
            },
            {
              _key: "fees-items-stronger-together",
              label: "Stronger Together Workshop",
              detail: "Per couple, workbooks included",
              price: "$175",
            },
            {
              _key: "fees-items-consultation-call",
              label: "Consultation Call",
              detail: "15 minutes by phone",
              price: "Free",
            },
          ],
          "fees.note":
            "Each block includes time for documentation and treatment planning. Payment by card, HSA, FSA or check. Longer couples sessions and intensives are available by request.",
          "insurance.heading": "Insurance, Sliding Scale & Cancellations",
          "insurance.body": rich(
            "pricing-insurance-nov",
            "I am in network with Aetna through Headway for individual therapy. I do not accept other insurance plans.",
            "For out-of-network reimbursement, I send a superbill automatically each month, and more often on request if you need one weekly. You can submit it to your insurer for possible reimbursement.",
            "I offer limited sliding scale slots. Self-pay clients may qualify for a reduced fee based on household size and annual income:",
            `- **$60:** household income up to $15,650 (1 person) / $32,150 (4 people)
- **$95:** up to $31,300 (1) / $64,300 (4)
- **$135:** up to $46,950 (1) / $96,450 (4)
- **$180:** up to $62,600 (1) / $128,600 (4)
- **$225:** above these amounts`,
            "Please give 24 hours' notice of cancellation. Otherwise, the full session fee applies.",
          ),
        },
      };
    case "faqPage":
      return { id, values: { items: faqItems(document) } };
    case "aboutPage": {
      const groups = document.credentialGroups as Array<{
        _key: string;
        items: Item[];
      }>;
      const updated = replaceText(
        groups,
        "Postpartum Support International: Certification Track",
        "Postpartum Support International: training complete, approved to take the PMH-C exam",
      );
      const memberships = {
        _key: "credentialgroups-memberships",
        heading: "Professional Memberships",
        items: [
          ["American Psychological Association", "APA"],
          ["Postpartum Support International", "PSI"],
          ["Imago Relationships North America", "Imago"],
          ["Rochester Area Group Psychotherapy Society", "RAGPS"],
        ].map(([title, detail]) => ({
          _key: `credentialgroups-memberships-${detail.toLowerCase()}`,
          title,
          detail,
        })),
      };
      return {
        id,
        values: {
          credentialGroups: [
            ...updated.filter((group) => group._key !== memberships._key),
            memberships,
          ],
        },
      };
    }
    case "specialty-individual-therapy":
      return {
        id,
        values: {
          whatToExpect: replaceText(
            document.whatToExpect,
            "Individual appointments are 50 minutes",
            "Individual appointments are scheduled in a 60-minute block, with 45–50 minutes face to face and 10–15 minutes for documentation and treatment planning",
          ),
        },
      };
    case "specialty-couples-counseling":
      return {
        id,
        values: {
          whatToExpect: replaceText(
            document.whatToExpect,
            "Couples appointments are 60 minutes",
            "Couples appointments include 60 minutes face to face, with an additional 15 minutes for documentation and treatment planning. Longer sessions and intensives are available by request",
          ),
        },
      };
    case "specialty-perinatal-postpartum-support":
      return {
        id,
        values: {
          summary: replaceText(
            document.summary,
            "gain expert psychological tools",
            "gain practical psychological tools",
          ),
          faqs: [
            ...(document.faqs as Item[]).filter(
              (item) =>
                ![
                  "service-faq-perinatal-partners-babies",
                  "service-faq-perinatal-support-lines",
                ].includes(item._key),
            ),
            faq(
              "service-faq-perinatal-partners-babies",
              "Can partners or babies come to sessions?",
              "Yes. Partners and babies may be included when their participation is clinically appropriate and supports the individual's treatment goals. We can discuss in advance who should attend and how their presence may be most helpful for the work we are doing together.",
            ),
            faq(
              "service-faq-perinatal-support-lines",
              "Where can I find pregnancy and postpartum support between sessions?",
              perinatalResources,
              "If you are in immediate danger, call 911 or go to the nearest emergency department.",
            ),
          ],
        },
      };
    case "specialty-group-therapy": {
      const faqs = document.faqs as Item[];
      return {
        id,
        values: {
          title: "Stronger Together Couples Workshop",
          pageHeading: "Stronger Together Couples Workshop in Rochester, NY",
          intro:
            "A monthly, skills-based workshop for couples who want practical communication tools, guided practice, and a shared language for repair and connection.",
          overview: rich(
            "stronger-together-overview",
            "Stronger Together is a monthly, skills-based workshop that helps couples better understand their relationship patterns and communicate with greater clarity, empathy and connection. Couples learn practical tools for recognizing their conflict cycle, listening without immediately reacting or defending, expressing vulnerable feelings and needs, turning complaints into clear requests, repairing after disconnection, and rebuilding trust through small, consistent actions.",
            "It usually meets on the first Friday of the month from 5:00–6:30 p.m. at 1577 South Ave., Rochester, NY, with up to 6 couples. The cost is $175 per couple, with a workbook for each person that includes skills and guidance for at-home practice.",
            `To register, email ${email}. A private suitability screening is completed before participation.`,
          ),
          whatToExpect: rich(
            "stronger-together-expect",
            "Each session includes teaching, private guided exercises with your partner, and optional group discussion.",
            "This workshop is designed for couples who care about their relationship but feel stuck, disconnected, misunderstood, or caught in repetitive conflict. It can benefit couples who want to strengthen an already solid relationship, develop healthier communication habits, or supplement their existing couples therapy. Both partners must participate voluntarily and feel emotionally and physically safe completing relationship exercises together.",
            notFor,
            "Stronger Together is a psychoeducational workshop and is not a substitute for individualized couples therapy, crisis intervention, or safety planning.",
          ),
          upcomingSessions: [
            ["2026-11-06", "2026-11-06T22:00:00Z", "2026-11-06T23:30:00Z"],
            ["2026-12-04", "2026-12-04T22:00:00Z", "2026-12-04T23:30:00Z"],
            ["2027-01-08", "2027-01-08T22:00:00Z", "2027-01-08T23:30:00Z"],
          ].map(([key, startsAt, endsAt]) => ({
            _key: `session-${key}`,
            _type: "upcomingSession",
            startsAt,
            endsAt,
            priceUsd: 175,
          })),
          faqs: [
            faq(
              "service-faq-group-therapy-0",
              "When is the next workshop?",
              "See the upcoming dates on this page. The workshop usually meets on the first Friday of the month, from 5:00–6:30 p.m. The January 2027 workshop is on Friday, January 8.",
            ),
            faq(
              "service-faq-group-therapy-1",
              "Is this the same as couples therapy?",
              "No. Stronger Together is a psychoeducational workshop centered on teaching, private guided exercises and optional group discussion. Individualized couples therapy is tailored more directly to one relationship's history, needs and ongoing clinical work.",
            ),
            byKey(faqs, "service-faq-group-therapy-2"),
            faq(
              "service-faq-group-therapy-3",
              "Will we have to share private relationship details?",
              "No. You will never have to share anything you do not want to. Exercises are private between partners, and group discussion is optional.",
            ),
            faq(
              "service-faq-group-therapy-register",
              "How do we register?",
              `Email ${email}. A private suitability screening is completed before participation.`,
            ),
            faq(
              "service-faq-group-therapy-refunds",
              "What is the cancellation and refund policy?",
              refundPolicy,
            ),
          ],
        },
      };
    }
    default:
      throw new Error(`Unexpected document: ${document._id}`);
  }
}

const targets = [
  "siteSettings",
  "contactPage",
  "pricingPage",
  "faqPage",
  "aboutPage",
  "specialty-individual-therapy",
  "specialty-couples-counseling",
  "specialty-perinatal-postpartum-support",
  "specialty-group-therapy",
];

function option(name: string) {
  const index = process.argv.indexOf(name);
  const value = index < 0 ? undefined : process.argv[index + 1];
  if (index >= 0 && (!value || value.startsWith("--")))
    throw new Error(`Missing value for ${name}`);
  return value;
}

async function main() {
  const planPath = option("--plan");
  const backupPath = option("--backup");
  const apply = process.argv.includes("--apply");
  if (!planPath || (apply && !backupPath))
    throw new Error(
      "Use --plan <fresh path>; applying also requires --backup <fresh path>.",
    );
  const client = getCliClient({ apiVersion: "2026-06-24" }).withConfig({
    useCdn: false,
    perspective: "raw",
  });
  const { projectId, dataset } = client.config();
  if (!projectId || !dataset) throw new Error("Missing project/dataset");
  const ids = targets.flatMap((id) => [id, `drafts.${id}`]);
  const documents = await client.fetch<MigrationDocument[]>("*[_id in $ids]", {
    ids,
  });
  for (const id of targets)
    if (!documents.some((document) => document._id === id))
      throw new Error(`Missing published document: ${id}`);
  const plan = buildMigrationPlan(
    { projectId, dataset, scope: "christina-answers-2026-11" },
    documents.map(buildPatch),
    documents,
  );
  process.stdout.write(
    `${plan.changes
      .map(
        (change) =>
          `${change.id}: ${change.fields.map((field) => field.path).join(", ")}`,
      )
      .join("\n")}\n`,
  );
  if (!apply) {
    fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    return;
  }
  assertReviewedPlan(JSON.parse(fs.readFileSync(planPath, "utf8")), plan);
  if (!plan.changes.length) return;
  fs.writeFileSync(
    backupPath!,
    `${JSON.stringify({ plan, documents }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  let transaction = client.transaction();
  for (const change of plan.changes) {
    transaction = transaction.patch(change.id, (patch) =>
      patch
        .ifRevisionId(change.revision)
        .set(
          Object.fromEntries(
            change.fields.map((field) => [field.path, field.after]),
          ),
        ),
    );
  }
  await transaction.commit({
    visibility: "sync",
    tag: "christina-answers-2026-11",
  });
  process.stdout.write("Published Christina's answers.\n");
}

main().catch((error) => {
  console.error(
    error instanceof Error
      ? error.message
      : "Christina answers migration failed",
  );
  process.exitCode = 1;
});
