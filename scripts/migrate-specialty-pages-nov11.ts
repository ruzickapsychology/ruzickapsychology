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
 * Publishes batch 1 of the specialty pages: anxiety therapy, Imago Relationship
 * Therapy, postpartum anxiety therapy, postpartum depression therapy, and the
 * /resources page.
 *
 * Clinical and service facts were checked on 11 Nov 2026 against NIMH, CDC,
 * ACOG, the HHS Office on Women's Health, Postpartum Support International,
 * HRSA, Imago Relationships Worldwide, Harville Hendrix and Helen LaKelly Hunt,
 * the Imago RCT (Gehlert et al., 2017), and each crisis service's own website.
 * Practice facts match the published site (Christina's November answers).
 *
 * Stages:
 * - `pages` creates (or updates) the four specialty documents and the
 *   resourcesPage singleton. Older code ignores them, so this is safe to apply
 *   before the matching code deploys.
 * - `links` links the new pages from the specialties hub, the parent specialty
 *   pages and the FAQ, and refreshes the existing crisis-line answers to match
 *   /resources. Apply it after the code that serves the new routes is live.
 *
 * Preview: --stage <pages|links> --plan <fresh path>
 * Apply:   --stage <pages|links> --plan <same path> --apply --backup <fresh path>
 */

type Block = {
  _type: string;
  _key: string;
  children?: Array<{ text: string; marks?: string[] }>;
  markDefs?: Array<{ _key: string; href?: string }>;
};

/** markdownToPortableText can leak a link mark past its text (for example a link inside bold), so every link is checked. */
function assertLinks(markdown: string, blocks: Block[]) {
  const expected = [...markdown.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map(
    ([, text, href]) => `${text} -> ${href}`,
  );
  const actual = blocks.flatMap((block) =>
    (block.markDefs ?? []).map((definition) => {
      const text = (block.children ?? [])
        .filter((child) => child.marks?.includes(definition._key))
        .map((child) => child.text)
        .join("");
      return `${text} -> ${definition.href}`;
    }),
  );
  const known = new Set(["strong", "em"]);
  for (const block of blocks)
    for (const child of block.children ?? [])
      for (const mark of child.marks ?? [])
        if (
          !known.has(mark) &&
          !(block.markDefs ?? []).some((definition) => definition._key === mark)
        )
          throw new Error(`Dangling mark ${mark} in ${block._key}`);
  if (JSON.stringify(expected) !== JSON.stringify(actual))
    throw new Error(
      `Link conversion mismatch:\n${expected.join("\n")}\n---\n${actual.join("\n")}`,
    );
}

const rich = (prefix: string, ...paragraphs: string[]) => {
  const markdown = paragraphs.join("\n\n");
  const blocks = stableContentKeys(
    markdownToPortableText(markdown),
    prefix,
  ) as Block[];
  assertLinks(markdown, blocks);
  return blocks;
};

const faq = (key: string, question: string, ...paragraphs: string[]) => ({
  _key: key,
  _type: "faqItem",
  question,
  answerRichText: rich(key, ...paragraphs),
});

type Source = { title: string; citation: string; url: string };
const sources = (prefix: string, items: Source[]) =>
  items.map((item, index) => ({
    _key: `${prefix}-source-${index}`,
    _type: "researchSource",
    ...item,
  }));

const reference = (key: string, id: string) => ({
  _key: key,
  _type: "reference",
  _ref: id,
});

/* ----------------------------- Shared practice facts ----------------------------- */

const whenUrgent =
  "Therapy is not emergency care. If you or someone else may be in immediate danger, call 911 or go to the nearest emergency department. You can call or text 988 at any hour. More options are on the [resources page](/resources).";
const perinatalUrgent =
  "Therapy is not emergency care. If you are thinking about harming yourself or your baby, or you or someone else may be in immediate danger, call 911 or go to the nearest emergency department. You can call or text 988 at any hour. Pregnancy and postpartum support lines are on the [resources page](/resources).";
const individualBlock =
  "Individual appointments are scheduled in a 60-minute block, with 45–50 minutes face to face and 10–15 minutes for documentation and treatment planning.";
const insuranceIndividual =
  "Christina is in network with Aetna through Headway for individual therapy, and does not accept other insurance plans. If you plan to use out-of-network benefits, a superbill is sent automatically each month. She also offers limited sliding scale slots for self-pay clients. Fees and sliding scale details are on the [Pricing page](/pricing).";
const virtual =
  "Yes. Christina sees clients in person at her South Avenue office in Rochester and virtually across New York. You must be physically in New York for each virtual session. Sessions use SimplePractice or Zoom.";
const medication =
  "No. Christina does not prescribe medication. When it is useful and you have signed a release of information, she coordinates with psychiatrists and OB/GYNs.";
const perinatalTraining =
  "Dr. Christina Ruzicka has completed Postpartum Support International's perinatal mental health training and is approved to take the PMH-C exam.";

const nimhPerinatal: Source = {
  title: "Perinatal Depression",
  citation:
    "National Institute of Mental Health (NIMH). Symptoms, the baby blues, depression during and after pregnancy, treatment, and postpartum psychosis as a psychiatric emergency.",
  url: "https://www.nimh.nih.gov/health/publications/perinatal-depression",
};
const psiPerinatal: Source = {
  title: "About Perinatal Mental Health",
  citation:
    "Postpartum Support International (PSI). Signs of perinatal anxiety and perinatal OCD, and the warning signs and frequency of postpartum psychosis.",
  url: "https://postpartum.net/perinatal-mental-health/",
};
const psiDads: Source = {
  title: "Help for Dads",
  citation:
    "Postpartum Support International (PSI). Postpartum depression and anxiety disorders in fathers during pregnancy and the first year after birth.",
  url: "https://postpartum.net/get-help/help-for-dads/",
};

/* --------------------------------- Specialty pages -------------------------------- */

const specialties = [
  {
    _id: "specialty-anxiety-therapy",
    slug: "anxiety-therapy",
    order: 4,
    title: "Anxiety Therapy",
    pageHeading: "Anxiety Therapy in Rochester, NY",
    summary:
      "Therapy for adults whose worry, overthinking or tension has started shaping their days, decisions and relationships.",
    intro:
      "A thoughtful, collaborative space for adults who feel caught in worry, overthinking or constant tension, and want to understand it and respond to it differently.",
    overview: [
      "Anxiety does not always look the way people expect. You may be functioning well on the outside, getting things done and showing up for everyone, while your mind keeps running through what could go wrong. Or you may notice it mostly in your body, as tension, restlessness, trouble sleeping or a racing heart.",
      "Some anxiety is a normal part of life, especially during stressful times. It may be worth talking to someone when worry has become hard to control, when it takes up a lot of your time, or when you have started organizing your life around avoiding it.",
      "Dr. Christina Ruzicka works with adults 18 and older in person at her South Avenue office in Rochester and virtually across New York. You do not need a diagnosis to begin. Many people come in simply knowing that they feel on edge and want something to change.",
      "Anxiety often overlaps with other things Christina works with, including self-esteem, relationship patterns, disordered eating, and pregnancy and postpartum changes. If anxiety began or got worse around pregnancy or a new baby, see [postpartum anxiety therapy](/specialties/postpartum-anxiety-therapy). For a broader view of her work with adults, see [individual therapy](/specialties/individual-therapy).",
    ],
    commonConcerns: [
      "Worry or overthinking that is hard to turn off",
      "Replaying conversations or preparing for what could go wrong",
      "Tension, restlessness, trouble sleeping or a racing heart",
      "Perfectionism and the pressure to hold everything together",
      "Avoiding situations, decisions or conversations because of how they feel",
      "Anxiety that shows up in your relationships or in how you see yourself",
    ],
    approachHeading:
      "Understanding the anxiety, and practicing something different",
    approachBody: [
      "Christina's style is relational, psychodynamic, warm and active. Anxiety often has a history. It may have started as a sensible way of staying safe, staying liked or staying in control. Part of the work is getting curious about what it has been trying to protect, rather than treating it as a flaw.",
      "Sessions can also be practical. Depending on what fits you, Christina may draw on tools from Acceptance and Commitment Therapy (ACT) and Dialectical Behavior Therapy, such as noticing anxious thoughts without being run by them, tolerating uncomfortable feelings, and moving toward what matters to you even when anxiety is present. For generalized anxiety, the National Institute of Mental Health describes a growing body of research supporting ACT.",
      "Therapy is a collaboration. You are the expert on your own life, and you have a real voice in the pace and focus of the work. You can tell Christina when something is not helping, and you can change course together.",
    ],
    whatToExpect: [
      "The first sessions focus on what brings you in, when the anxiety shows up, what you have already tried, and what you would like to feel different. You do not need to arrive with everything figured out.",
      "As the work develops, sessions may include noticing patterns as they happen, making room for feelings that anxiety tends to cover, connecting present worries with earlier experiences, and trying new responses between appointments. Much of the meaningful change happens in everyday life.",
      `Most clients begin with weekly sessions. ${individualBlock}`,
      whenUrgent,
    ],
    faqs: [
      [
        "Do I need an anxiety diagnosis to start?",
        "No. Many people begin because they feel overwhelmed, on edge or stuck in their own heads. The consultation and first sessions can help clarify what is going on and what support would be most useful.",
      ],
      [
        "Will we just talk, or will I learn tools?",
        "Both, depending on what you need. Sessions can include understanding where the anxiety comes from and practical skills you can use between appointments.",
      ],
      [
        "How long does therapy for anxiety take?",
        "It varies with your goals and the level of support you need. Some clients come for focused, short-term work, and others benefit from longer-term therapy. You will review your progress together along the way.",
      ],
      ["Do you prescribe medication for anxiety?", medication],
      [
        "When would you refer me to someone else?",
        "Christina refers out severe and persistent mental health conditions that require a high level of care, active addiction and crisis care. If you need help right away, the [resources page](/resources) lists crisis lines for Rochester and Monroe County.",
      ],
      ["Are virtual appointments available?", virtual],
      ["Do you take insurance?", insuranceIndividual],
    ],
    sources: [
      {
        title: "Generalized Anxiety Disorder: What You Need to Know",
        citation:
          "National Institute of Mental Health (NIMH). Occasional anxiety as a normal part of life, signs of generalized anxiety, and research on CBT and acceptance and commitment therapy.",
        url: "https://www.nimh.nih.gov/health/publications/generalized-anxiety-disorder-gad",
      },
      {
        title: "Panic Disorder: What You Need to Know",
        citation:
          "National Institute of Mental Health (NIMH). A pounding or racing heart as a physical sign of anxiety.",
        url: "https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms",
      },
    ],
    relatedPosts: ["post-repairing-connection-in-relationships"],
  },
  {
    _id: "specialty-imago-relationship-therapy",
    slug: "imago-relationship-therapy",
    order: 5,
    title: "Imago Relationship Therapy",
    pageHeading: "Imago Relationship Therapy in Rochester, NY",
    summary:
      "A structured approach to couples therapy that helps partners slow down hard conversations and understand what recurring conflict is about.",
    intro:
      "A structured approach to couples therapy that helps partners slow down difficult conversations, listen without immediately defending, and understand what recurring conflict is really about.",
    overview: [
      "Imago Relationship Therapy was developed by Harville Hendrix and Helen LaKelly Hunt. It starts from the idea that many conflicts in a close relationship are connected to older needs and hurts, and that the relationship can also be a place to understand them differently.",
      'The word "imago" is Latin for "image." In Imago theory, it refers to an unconscious image of familiar love formed in childhood, which can shape who we are drawn to and what gets stirred up between partners.',
      "The best-known part of the approach is the Imago Dialogue, a structured way of talking in which partners take turns: one speaks while the other listens. It has three steps:",
      `- **Mirroring:** reflecting back what your partner said, without adding your own interpretation
- **Validation:** letting your partner know their point of view makes sense from where they stand, which does not mean you have to agree
- **Empathy:** trying to imagine how your partner is feeling`,
      "Dr. Christina Ruzicka is a Certified Imago Relationship Therapist and a member of Imago Relationships North America. She sees couples in person in Rochester and virtually across New York. Imago is one part of her [couples therapy](/specialties/couples-therapy) practice. Her practice is LGBTQ+-affirming, and ENM and polyamorous couples are welcome.",
    ],
    commonConcerns: [
      "The same argument keeps coming back in different forms",
      "One of you pursues while the other shuts down",
      "You both feel unheard, even when you are talking a lot",
      "Closeness has faded and you are not sure how to get it back",
      "A big change has shifted how the relationship works",
      "You want a clearer way to repair after conflict",
    ],
    approachHeading: "Structure that makes room for each person",
    approachBody: [
      "Imago treats conflict as information about the relationship rather than proof that it has failed. The structure can feel unnatural at first, and that is part of the point. It slows things down enough that each partner can hear something other than the argument they already know.",
      "Christina uses the structure of Imago while staying attentive to the history, identities and circumstances each partner brings. She is active in sessions, guiding the conversation and helping you notice what is happening between you as it happens.",
      "The aim is not perfect communication or deciding who is right. It is a more reliable way back to understanding and repair when disconnection happens.",
      "Imago depends on both partners feeling safe enough to take part. If there is violence, intimidation or fear in the relationship, please let Christina know privately, by phone or email. Separate meetings may be recommended when a private safety assessment is needed, and confidential support, including Willow Domestic Violence Center, is listed on the [resources page](/resources).",
    ],
    whatToExpect: [
      "Early sessions focus on what brings you in, how the conflict tends to unfold, and what each of you hopes will change. Before the first session, each partner may be asked to complete certain forms individually.",
      "When clinically appropriate, Christina may meet briefly with each partner alone. These meetings remain part of the couples therapy, and you will discuss confidentiality and how information is handled before meeting separately.",
      "Over time, you practice the dialogue with Christina's guidance, on real issues, and try using it at home. Couples appointments include 60 minutes face to face, with an additional 15 minutes for documentation and treatment planning. Longer sessions and intensives are available by request.",
    ],
    faqs: [
      [
        "How is Imago different from other couples therapy?",
        "Imago gives couples a specific, structured way to talk and a framework for connecting present conflict to older needs and hurts. Other approaches may place more emphasis on different skills or theories. The consultation is a good place to ask whether this approach fits what you are looking for.",
      ],
      [
        "Is Imago backed by research?",
        "There is some research support. In a randomized controlled trial published in 2017, partners who received 12 sessions of Imago therapy reported statistically significant increases in marital satisfaction, while a control group did not. Overall, the gains were not large enough to count as clinically significant, and they partly faded at follow-up, although they stayed above where couples started.",
        "No approach can promise a particular outcome. What matters most is whether the work fits your relationship and whether you are finding it useful.",
      ],
      [
        "Will it feel scripted?",
        "At first it can. Most of the structure is there to slow the conversation down. Christina guides you through it and adapts it to the two of you.",
      ],
      [
        "How long does it take?",
        "It varies with your goals and the concerns bringing you in. You will discuss your goals at the beginning and regularly review your progress together.",
      ],
      [
        "Is this the same as the Stronger Together workshop?",
        "No. [Stronger Together](/specialties/group-therapy) is a monthly psychoeducational workshop for couples. Imago therapy is individualized couples therapy, tailored to your relationship's history and needs.",
      ],
      [
        "Can we do this virtually?",
        "Yes. Both partners must be physically in New York for each virtual session. You can join from two different places, although being in the same location is preferred. Sessions use SimplePractice or Zoom.",
      ],
      [
        "Do you take insurance for couples therapy?",
        "Christina's participation with Aetna through Headway is for individual therapy, and she does not accept other insurance plans. If you plan to use out-of-network benefits, a superbill is sent automatically each month, and you can ask your insurer whether your plan covers couples therapy. See the [Pricing page](/pricing) for current fees.",
      ],
    ],
    sources: [
      {
        title: "About Imago Relationships Worldwide",
        citation:
          'Imago Relationships Worldwide. The founders of Imago Relationship Therapy and the meaning of "imago".',
        url: "https://imagorelationships.org/about/",
      },
      {
        title: "The Way We Talk and the Way We Listen Changes Everything",
        citation:
          "Harville Hendrix and Helen LaKelly Hunt. The three steps of the Imago Dialogue: mirroring, validating and empathizing.",
        url: "https://harvilleandhelen.com/relationships/the-way-we-talk-and-the-way-we-listen-changes-everything/",
      },
      {
        title:
          "Randomized Controlled Trial of Imago Relationship Therapy: Exploring Statistical and Clinical Significance",
        citation:
          "Gehlert, N. C., Schmidt, C. D., Giegerich, V., & Luquet, W. (2017). Journal of Couple & Relationship Therapy, 16(3), 188–209.",
        url: "https://doi.org/10.1080/15332691.2016.1253518",
      },
    ],
    relatedPosts: ["post-finding-your-footing-after-change"],
  },
  {
    _id: "specialty-postpartum-anxiety-therapy",
    slug: "postpartum-anxiety-therapy",
    order: 6,
    title: "Postpartum Anxiety Therapy",
    pageHeading: "Postpartum Anxiety Therapy in Rochester, NY",
    summary:
      "Support for new and expecting parents when worry, checking or frightening thoughts have taken over pregnancy or life with a new baby.",
    intro:
      "Support for new and expecting parents when worry, checking or frightening thoughts have started to take over pregnancy or life with a new baby.",
    overview: [
      "Some worry is part of caring for a baby. Postpartum anxiety is what many people call it when that worry stops feeling proportionate: when you cannot rest even when the baby is sleeping, when your mind keeps going to what could go wrong, or when you cannot stop checking.",
      "Postpartum Support International lists constant worry, a feeling that something bad might happen, racing thoughts, and trouble with sleep or appetite among the signs of perinatal anxiety. It can begin during pregnancy, after a loss or after birth, and it can affect fathers and partners too.",
      `${perinatalTraining} She works with new and expecting parents, including fathers, partners, and people on surrogacy, adoption and IVF journeys, in person in Rochester and virtually across New York. Perinatal clients may join virtual sessions with the baby present. This page is one part of her [perinatal and postpartum therapy](/specialties/perinatal-postpartum-therapy) practice.`,
    ],
    commonConcerns: [
      "Constant worry about the baby's health or safety",
      "A feeling that something bad is about to happen",
      "Trouble sleeping even when the baby is asleep",
      "Checking, researching or seeking reassurance over and over",
      "Unwanted, frightening thoughts or images",
      "Feeling on edge, unable to sit still, or physical symptoms such as dizziness or nausea",
      "Anxiety during a later pregnancy, or after a difficult birth or loss",
    ],
    approachHeading: "Room to say what is actually happening",
    approachBody: [
      "It can be hard to say anxious or frightening thoughts out loud. Christina's approach is relational and nonjudgmental, and she does not assume that pregnancy, birth, feeding or parenthood should look or feel one particular way.",
      "Sessions may include understanding what sets the anxiety off, anxiety and emotion-regulation tools, working with checking and reassurance patterns, and support communicating what you need with a partner or family.",
      "Therapy can also make room for what sits underneath: the pressure to be a perfect parent, changes in your identity, or a birth or loss that did not go as you had hoped.",
    ],
    whatToExpect: [
      "The first sessions make space for what has been happening, what support you already have, and what feels most urgent. You do not need to minimize difficult feelings or arrive with a polished version of your story.",
      "Partners and babies may be included when their participation is clinically appropriate and supports your treatment goals. You can discuss in advance who should attend and how it may help.",
      individualBlock,
      perinatalUrgent,
    ],
    faqs: [
      [
        "Is this normal new-parent worry, or something more?",
        "Worry is common with a new baby. It may be worth talking to someone when it is hard to turn off, gets in the way of sleep or daily life, or feels out of proportion to what is happening. You do not need to be sure before you reach out. The consultation can help you sort that out.",
      ],
      [
        "I am having frightening thoughts about my baby. Can I talk about them?",
        "Yes. Unwanted, frightening thoughts about harm coming to the baby are common after birth and can feel very isolating. Postpartum Support International describes them as anxious in nature, not a break from reality, and researchers report no evidence that mothers act on unwanted, intrusive thoughts like these. Therapy offers a place to discuss them honestly, understand their context and determine what support is appropriate.",
        "If thoughts of harm do not feel unwanted, if you feel you might act on them, or if you or someone close to you notices confusion, seeing or hearing things that are not there, strange beliefs, or a sharply reduced need for sleep, treat it as an emergency. Call 911 or go to the nearest emergency department.",
      ],
      [
        "Can anxiety start during pregnancy?",
        "Yes. Anxiety can start during pregnancy, after birth, after a loss, or at any point in the transition to parenthood, and support can begin at any of those points.",
      ],
      [
        "Does this apply to fathers, partners and non-birthing parents?",
        "Yes. Postpartum Support International reports that 5 to 15% of fathers develop an anxiety disorder during pregnancy or the first year after birth. Christina works with fathers, partners, and people on surrogacy, adoption and IVF journeys.",
      ],
      [
        "Can my baby or partner come?",
        "Yes, when it is clinically appropriate and supports your goals. Perinatal clients may also join virtual sessions with the baby present.",
      ],
      [
        "Do you prescribe medication?",
        `${medication} Questions about medication during pregnancy or breastfeeding are best discussed with your prescriber.`,
      ],
      ["Do you take insurance?", insuranceIndividual],
    ],
    sources: [
      psiPerinatal,
      psiDads,
      {
        title: "Postpartum Harm Thoughts infographic",
        citation:
          "UBC Perinatal Anxiety Research Lab, shared by Postpartum Support International. Unwanted thoughts about harm coming to the baby, checking and reassurance-seeking, and no evidence that mothers act on these thoughts.",
        url: "https://postpartum.net/wp-content/uploads/2024/09/Postpartum-Harm-Thoughts-Infographic-PPT-2023.pdf",
      },
      nimhPerinatal,
    ],
    relatedPosts: ["post-repairing-connection-in-relationships"],
  },
  {
    _id: "specialty-postpartum-depression-therapy",
    slug: "postpartum-depression-therapy",
    order: 7,
    title: "Postpartum Depression Therapy",
    pageHeading: "Postpartum Depression Therapy in Rochester, NY",
    summary:
      "Support for new parents who feel low, empty, disconnected or unlike themselves during pregnancy or after birth.",
    intro:
      "Support for new parents who feel low, empty, disconnected or unlike themselves during pregnancy or after birth. You do not have to be sure it is depression to reach out.",
    overview: [
      "Many people expect to feel joyful after having a baby, so feeling low, empty or overwhelmed can come with a lot of guilt. Depression after having a baby is common, and it is treatable. CDC research shows about 1 in 8 women with a recent live birth report symptoms of postpartum depression. It is not your fault, and it does not mean you are a bad parent.",
      'The "baby blues" are also common: tearfulness, worry and mood swings that start a few days after birth and usually ease on their own within a few days to two weeks. When low mood lasts longer than two weeks, feels more intense, or makes daily life hard, it is worth talking with a health professional. Depression can also begin during pregnancy, and postpartum depression can start any time in the first year after birth.',
      "Feeling disconnected from your baby can be a symptom of depression, and it can get better with treatment.",
      `${perinatalTraining} She works with new and expecting parents, including fathers, partners, and people on surrogacy, adoption and IVF journeys, in person in Rochester and virtually across New York. This page is one part of her [perinatal and postpartum therapy](/specialties/perinatal-postpartum-therapy) practice.`,
    ],
    commonConcerns: [
      "Persistent low mood, tearfulness or a sense of emptiness",
      "Feeling distant or disconnected from your baby, your partner or yourself",
      "Guilt, shame, or doubts about whether you can care for your baby",
      "Anger or irritability that feels unlike you",
      "Exhaustion, or trouble sleeping even when the baby is asleep",
      "Losing interest in things that used to matter",
      "Pulling away from friends, family or people who want to help",
    ],
    approachHeading: "Care without the pressure to perform gratitude",
    approachBody: [
      "Christina's approach is relational and nonjudgmental. You can be grateful for your baby and still be having a very hard time. Therapy is a place where you do not have to pick one or pretend.",
      "Several types of talk therapy can help with perinatal depression, and antidepressant medication prescribed by a doctor can also help, alone or alongside therapy. In sessions with Christina, the work may include emotional processing, tools for emotion regulation, reducing isolation, working with guilt and self-criticism, grieving an experience that did not match what you expected, and rebuilding a sense of self alongside the demands of caregiving.",
      "Relationships are often part of this. Sessions can include communicating needs with a partner or family, and support for changing roles and resentment.",
    ],
    whatToExpect: [
      "The first sessions make space for what has been happening, what support you already have, and what feels most urgent. You do not need to minimize how you feel, or have the energy to explain it well.",
      "Partners and babies may be included when their participation is clinically appropriate and supports your treatment goals. If medication may be part of your care, Christina can coordinate with your psychiatrist or OB/GYN once you have signed a release of information.",
      `${individualBlock} Virtual sessions are available for clients physically in New York, and you may join with the baby present.`,
      perinatalUrgent,
    ],
    faqs: [
      [
        "How do I know if this is the baby blues or postpartum depression?",
        "The baby blues usually ease on their own within a few days to two weeks. If your mood is not lifting after two weeks, is getting worse, or is making it hard to get through the day, it is worth talking with Christina or your doctor. You do not need to be certain first.",
      ],
      [
        "Can I get postpartum depression months after having a baby?",
        "Yes. It most often starts in the first few weeks after birth, but it can begin any time in the first year, and depression can also begin during pregnancy. Support can begin at any point in the transition to parenthood.",
      ],
      [
        "Can partners and fathers experience this?",
        "Yes. Postpartum Support International reports that about 1 in 10 fathers experience postpartum depression. Adoptive parents can also experience depression after a child joins the family, sometimes called post-adoption depression. Christina works with fathers, partners, and people on surrogacy, adoption and IVF journeys.",
      ],
      [
        "Do you prescribe medication?",
        `${medication} Questions about medication during pregnancy or breastfeeding are best discussed with your prescriber.`,
      ],
      [
        "What if things feel more urgent than weekly therapy?",
        "Christina refers out severe conditions that require a high level of care, and crisis care. Postpartum psychosis is rare, but it is a medical emergency. Confusion, seeing or hearing things that are not there, strange beliefs, a sharply reduced need for sleep, or thoughts of harming yourself or your baby need urgent care. Call 911 or go to the nearest emergency department.",
      ],
      [
        "Where can I find support between sessions?",
        "The National Maternal Mental Health Hotline and the Postpartum Support International HelpLine are listed on the [resources page](/resources). Both are support lines, not crisis or emergency services.",
      ],
      ["Do you take insurance?", insuranceIndividual],
    ],
    sources: [
      nimhPerinatal,
      {
        title: "Postpartum Depression",
        citation:
          "American College of Obstetricians and Gynecologists (ACOG). Timing of the baby blues and of postpartum depression.",
        url: "https://www.acog.org/womens-health/faqs/postpartum-depression",
      },
      {
        title: "Symptoms of Depression Among Women",
        citation:
          "Centers for Disease Control and Prevention (CDC). About 1 in 8 women with a recent live birth report symptoms of postpartum depression.",
        url: "https://www.cdc.gov/reproductive-health/depression/index.html",
      },
      {
        title: "Postpartum depression",
        citation:
          "Office on Women's Health, U.S. Department of Health and Human Services. Postpartum depression does not mean you are a bad parent; feelings that last longer than two weeks.",
        url: "https://womenshealth.gov/mental-health/mental-health-conditions/postpartum-depression",
      },
      psiDads,
      {
        title: "Adoptive Parent Resources",
        citation:
          "Postpartum Support International (PSI). Depression in adoptive parents after a child joins the family.",
        url: "https://postpartum.net/get-help/adoptive-and-birth-mothers/",
      },
      psiPerinatal,
    ],
    relatedPosts: ["post-repairing-connection-in-relationships"],
  },
];

/* --------------------------------- Resources page --------------------------------- */

const lines = {
  "988":
    "[988 Suicide & Crisis Lifeline](https://988lifeline.org/): call or text [988](tel:988), or [chat online](https://chat.988lifeline.org/), 24/7, for suicidal thoughts, emotional distress, mental health concerns or substance use crises. It is free and confidential.",
  lifeline:
    "[211/LIFE LINE](https://211lifeline.org/): call [211](tel:211) or [1-877-356-9211](tel:+18773569211), 24/7, or text 898211, for crisis support and connection with mental health, housing, food, substance use and other community resources. It serves Rochester, Monroe County and nearby counties.",
  urmc: "[University of Rochester Medicine Mental Health Crisis Call Line](https://www.urmc.rochester.edu/conditions-and-treatments/crisis-call-line-counseling): call [(585) 275-8686](tel:+15852758686), 24/7, to talk with a crisis counselor. Counselors can connect Monroe County residents with the Mobile Crisis Team when needed. If someone is at immediate risk of suicide or there is an urgent safety concern, call 911.",
  bhacc:
    "[Behavioral Health Access and Crisis Center](https://www.rochesterregional.org/locations/behavioral-health/st-marys): adults 18 and older can walk in without an appointment at 65 Genesee Street, Rochester, on Rochester Regional Health's St. Mary's campus, for urgent mental health needs. Call [(585) 368-3950](tel:+15853683950) for current hours.",
  willow:
    "[Willow Domestic Violence Center](https://willowcenterny.org/get-help/): call or text [(585) 222-SAFE (7233)](tel:+15852227233), 24/7, for free, confidential domestic violence crisis and support services.",
  nmmhh:
    "[National Maternal Mental Health Hotline](https://mchb.hrsa.gov/programs-impact/national-maternal-mental-health-hotline): call or text [1-833-TLC-MAMA (1-833-852-6262)](tel:+18338526262), or chat online, for free, confidential, 24/7 support before, during and after pregnancy. Counselors speak English and Spanish, and interpreters are available in more than 60 languages. It is not a crisis line: for a suicidal crisis, call or text 988, and for immediate danger, call 911.",
  psi: "[Postpartum Support International HelpLine](https://postpartum.net/get-help/psi-helpline/): call [1-800-944-4773](tel:+18009444773) and press 1 for Spanish or 2 for English, or text HELP to 800-944-4773 (English) or 971-203-7773 (Spanish), for basic information, support and resources. Messages are returned between 8 a.m. and 11 p.m. Eastern. It is not a crisis hotline and does not handle emergencies.",
};
const list = (...items: string[]) =>
  items.map((item) => `- ${item}`).join("\n");

const resourcesPage = {
  _id: "resourcesPage",
  _type: "resourcesPage",
  header: {
    eyebrow: "Support and resources",
    heading: "Crisis and Pregnancy Support Resources in Rochester, NY",
    intro:
      "Phone, text and chat lines for urgent mental health needs in Rochester and Monroe County, and for support before, during and after pregnancy.",
  },
  note: "Ruzicka Psychology does not provide 24-hour crisis coverage. If you are in immediate danger or unable to keep yourself or someone else safe, call 911 or go to the nearest emergency department.",
  sections: [
    {
      _key: "section-crisis",
      _type: "resourceSection",
      heading: "Emergency and crisis support",
      body: rich(
        "resources-crisis",
        list(
          lines["988"],
          lines.lifeline,
          lines.urmc,
          lines.bhacc,
          lines.willow,
        ),
      ),
    },
    {
      _key: "section-perinatal",
      _type: "resourceSection",
      heading: "Pregnancy and postpartum support",
      body: rich(
        "resources-perinatal",
        list(lines.nmmhh, lines.psi),
        "Postpartum Support International also runs free online peer support groups led by trained peer supporters, including groups for dads. See [the list of groups](https://postpartum.net/get-help/psi-online-support-meetings/).",
      ),
    },
  ],
  moreHeading: "Looking for therapy?",
  moreBody: rich(
    "resources-more",
    "Dr. Christina Ruzicka offers [individual therapy](/specialties/individual-therapy), [anxiety therapy](/specialties/anxiety-therapy), [couples therapy](/specialties/couples-therapy) and [perinatal and postpartum therapy](/specialties/perinatal-postpartum-therapy) in Rochester and virtually across New York. You can [request a free 15-minute phone consultation](/contact).",
  ),
};

function specialtyDocument(page: (typeof specialties)[number]) {
  return {
    _id: page._id,
    _type: "specialty",
    title: page.title,
    slug: { _type: "slug", current: page.slug },
    summary: page.summary,
    pageStatus: "published",
    active: true,
    order: page.order,
    pageHeading: page.pageHeading,
    intro: page.intro,
    overview: rich(`${page.slug}-overview`, ...page.overview),
    commonConcerns: page.commonConcerns,
    approachHeading: page.approachHeading,
    approachBody: rich(`${page.slug}-approach`, ...page.approachBody),
    whatToExpect: rich(`${page.slug}-expect`, ...page.whatToExpect),
    faqs: page.faqs.map(([question, ...answer], index) =>
      faq(`${page.slug}-faq-${index}`, question, ...answer),
    ),
    sources: sources(page.slug, page.sources),
    relatedPosts: page.relatedPosts.map((id) =>
      reference(`related-post-${id}`, id),
    ),
  };
}

const pageDocuments: Array<Record<string, unknown> & { _id: string }> = [
  ...specialties.map(specialtyDocument),
  resourcesPage,
];

/* ------------------------------------ Link stage ----------------------------------- */

type Item = { _key: string; [key: string]: unknown };

const parentLinks: Record<string, string> = {
  "specialty-individual-therapy":
    "If anxiety is the main reason you are looking for support, see [anxiety therapy](/specialties/anxiety-therapy).",
  "specialty-couples-counseling":
    "To learn more about the approach Christina is certified in, see [Imago Relationship Therapy](/specialties/imago-relationship-therapy).",
  "specialty-perinatal-postpartum-support":
    "You can read more about [postpartum anxiety therapy](/specialties/postpartum-anxiety-therapy) and [postpartum depression therapy](/specialties/postpartum-depression-therapy).",
};

const hubReferences = specialties.map((page) =>
  reference(`specialties-reference-${page.slug}`, page._id),
);

function withAppended(blocks: unknown, key: string, markdown: string) {
  if (!Array.isArray(blocks)) throw new Error(`Expected rich text for ${key}`);
  return [
    ...(blocks as Item[]).filter((block) => !block._key.startsWith(key)),
    ...rich(key, markdown),
  ];
}

function buildLinkPatch(document: MigrationDocument): MigrationPatch {
  const id = document._id;
  switch (id) {
    case "specialtiesPage": {
      const current = document.specialties as Item[];
      const existing = current.filter(
        (item) => !hubReferences.some((ref) => ref._key === item._key),
      );
      return { id, values: { specialties: [...existing, ...hubReferences] } };
    }
    case "specialty-individual-therapy":
    case "specialty-couples-counseling":
      return {
        id,
        values: {
          overview: withAppended(
            document.overview,
            `${id}-batch1-link`,
            parentLinks[id],
          ),
        },
      };
    case "specialty-perinatal-postpartum-support": {
      const key = "service-faq-perinatal-support-lines";
      if (!(document.faqs as Item[]).some((item) => item._key === key))
        throw new Error(`Missing ${key}`);
      return {
        id,
        values: {
          overview: withAppended(
            document.overview,
            `${id}-batch1-link`,
            parentLinks[id],
          ),
          [`faqs[_key=="${key}"].answerRichText`]: rich(
            key,
            list(lines.nmmhh, lines.psi),
            "If you are in immediate danger, call 911 or go to the nearest emergency department. More support lines are on the [resources page](/resources).",
          ),
        },
      };
    }
    case "faqPage": {
      const key = "items-crisis";
      if (!(document.items as Item[]).some((item) => item._key === key))
        throw new Error(`Missing ${key}`);
      return {
        id,
        values: {
          [`items[_key=="${key}"].answerRichText`]: rich(
            key,
            "If you are in immediate danger or unable to keep yourself or someone else safe, call 911 or go to the nearest emergency department. Ruzicka Psychology does not provide 24-hour crisis coverage.",
            list(
              lines["988"],
              lines.lifeline,
              lines.urmc,
              lines.bhacc,
              lines.willow,
            ),
            "Pregnancy and postpartum support lines are on the [resources page](/resources).",
          ),
        },
      };
    }
    default:
      throw new Error(`Unexpected document: ${id}`);
  }
}

/* ------------------------------------- Runner -------------------------------------- */

function option(name: string) {
  const index = process.argv.indexOf(name);
  const value = index < 0 ? undefined : process.argv[index + 1];
  if (index >= 0 && (!value || value.startsWith("--")))
    throw new Error(`Missing value for ${name}`);
  return value;
}

/** Fields a create writes; an existing document is compared and patched on these only. */
function contentValues(document: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(document).filter(([key]) => !key.startsWith("_")),
  );
}

async function main() {
  const stage = option("--stage");
  const planPath = option("--plan");
  const backupPath = option("--backup");
  const apply = process.argv.includes("--apply");
  if (stage !== "pages" && stage !== "links")
    throw new Error("Use --stage pages or --stage links.");
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

  const targets =
    stage === "pages"
      ? pageDocuments.map((document) => document._id)
      : [
          "specialtiesPage",
          "faqPage",
          "specialty-individual-therapy",
          "specialty-couples-counseling",
          "specialty-perinatal-postpartum-support",
        ];
  const documents = await client.fetch<MigrationDocument[]>("*[_id in $ids]", {
    ids: targets.flatMap((id) => [id, `drafts.${id}`]),
  });
  const drafts = documents.filter((document) =>
    document._id.startsWith("drafts."),
  );
  if (drafts.length)
    throw new Error(
      `Open drafts would hide or overwrite this change: ${drafts.map((d) => d._id).join(", ")}`,
    );

  let creates: Array<Record<string, unknown>> = [];
  let patches: MigrationPatch[];
  if (stage === "pages") {
    const posts = await client.fetch<string[]>('*[_type == "post"]._id');
    for (const page of specialties)
      for (const id of page.relatedPosts)
        if (!posts.includes(id)) throw new Error(`Missing related post ${id}`);
    creates = pageDocuments.filter(
      (document) => !documents.some((item) => item._id === document._id),
    );
    patches = pageDocuments
      .filter((document) => documents.some((item) => item._id === document._id))
      .map((document) => ({
        id: document._id,
        values: contentValues(document),
      }));
  } else {
    for (const id of targets)
      if (!documents.some((document) => document._id === id))
        throw new Error(`Missing published document: ${id}`);
    for (const page of specialties) {
      const live = await client.fetch<{ pageStatus?: string } | null>(
        "*[_id == $id][0]{pageStatus}",
        { id: page._id },
      );
      if (live?.pageStatus !== "published")
        throw new Error(`Apply the pages stage first: ${page._id}`);
    }
    patches = documents.map(buildLinkPatch);
  }

  const plan = {
    ...buildMigrationPlan(
      { projectId, dataset, scope: `specialty-pages-nov11-${stage}` },
      patches,
      documents,
    ),
    creates,
  };
  process.stdout.write(
    [
      ...plan.creates.map((document) => `create ${document._id}`),
      ...plan.changes.map(
        (change) =>
          `patch ${change.id}: ${change.fields.map((field) => field.path).join(", ")}`,
      ),
    ].join("\n") + "\n",
  );
  if (!apply) {
    fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    return;
  }
  assertReviewedPlan(JSON.parse(fs.readFileSync(planPath, "utf8")), plan);
  if (!plan.changes.length && !plan.creates.length) return;
  fs.writeFileSync(
    backupPath!,
    `${JSON.stringify({ plan, documents }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  let transaction = client.transaction();
  for (const document of plan.creates)
    transaction = transaction.create(
      document as { _id: string; _type: string },
    );
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
    tag: `specialty-pages-nov11-${stage}`,
  });
  process.stdout.write(`Applied ${stage} stage.\n`);
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Specialty pages migration failed",
  );
  process.exitCode = 1;
});
