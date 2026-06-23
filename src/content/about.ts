export const about = {
  credentials: "Psy.D. · Licensed Clinical Psychologist",
  heading: "Dr. Christina Ruzicka",
  intro: [
    "If you are here, you are likely navigating a major season of transition. Maybe your relationship feels strained and disconnected, or perhaps you are a new mother trying to find your footing amidst intense postpartum anxiety. I want you to know that you don't have to carry this weight alone.",
    "My therapeutic style is relational, warm, collaborative, and active. I want to be engaged and connected to your world.",
    "As a clinical psychologist, I specialize in two core areas: helping couples move from friction to deep connection using Imago Relationship Therapy, and supporting women through the profound identity and emotional shifts of perinatal and postpartum mental health.",
    "Therapy is a profound investment of your time, vulnerability, and resources—and it is an investment I respect deeply. To ensure you receive the highest standard of clinical care, I dedicate my own resources to advanced training, specialized certifications, and continuous education, so our time together feels effective and uniquely tailored to your healing.",
  ],
  education: {
    heading: "Education",
    items: [
      {
        title: "Doctoral Degree",
        detail:
          "California School of Professional Psychology at Alliant International University, San Diego, CA",
      },
      {
        title: "Predoctoral APA Internship",
        detail: "University of Rochester, University Counseling Center",
      },
      {
        title: "Postdoctoral Fellowship",
        detail: "University of Rochester, University Counseling Center",
      },
    ],
  },
  training: {
    heading: "Specialized Training",
    items: [
      {
        title: "Certified Imago Relationship Therapy",
        detail: "Clinical Training",
      },
      {
        title: "Perinatal Mental Health",
        detail: "Postpartum Support International — Certification Track",
      },
    ],
    license: "Licensed Clinical Psychologist — New York",
  },
  expect: {
    eyebrow: "What to expect",
    heading: "Starting is the hardest part",
    steps: [
      {
        n: "01",
        title: "Contact",
        body: "Reach out through the contact form to schedule a time for us to connect on the phone.",
      },
      {
        n: "02",
        title: "Consult",
        body: "Fifteen unhurried minutes to talk through what's bringing you in and whether we're a fit.",
      },
      {
        n: "03",
        title: "Begin",
        body: "Recurring sessions, in person or virtual, customized for the season you're in right now.",
      },
      {
        n: "04",
        title: "Evolution",
        body: "With time, the ground under you firms up and you start living your best life.",
      },
    ],
  },
  // Replaces the mock's client testimonial: APA discourages soliciting
  // testimonials from clients, so we use a first-person philosophy quote
  // in the same visual band. See CLAUDE.md (ethics) and docs/redesign.md.
  philosophy: {
    eyebrow: "In my words",
    quote:
      "Conflict is not failure—it is a blueprint. My work is to slow down the moments where you get stuck, calm the nervous system, and help you build a shared language for being truly heard.",
  },
} as const;
