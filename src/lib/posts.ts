export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "welcome-to-the-practice",
    title: "Welcome to the Practice",
    excerpt:
      "Welcome! I'm Dr. Christina Ruzicka and I am so glad you are here.",
    body: [
      "Welcome! I'm Dr. Christina Ruzicka and I am so glad you are here. As a licensed clinical psychologist and relational person by nature, my passion is helping individuals and couples navigate the beautiful, complex, and often overwhelming seasons of life. Whether you are working to heal a relational rift or trying to find your footing during the intense transition into parenting, my goal is to provide a safe, grounded sanctuary where you can explore, reflect, contemplate, and heal.",
      "In my practice, I specialize in two deeply transformative areas: Imago Relationship Therapy for couples and Perinatal Mental Health for mothers. I have learned there is no one-size-fits-all approach to therapy. Instead, I combine advanced, evidence-based training with an active, highly collaborative and relational style that is influenced by psychoanalytic and psychodynamic theory.",
      "In our work together, we will explore how your conscious and unconscious processes are influencing the life you are creating. In our sessions, we won't just talk about the surface issues—we will work together to understand and break old cycles, calm your nervous system, and build practical tools for lasting change.",
      "After completing my doctoral degree in San Diego, California, I relocated to the area for my predoctoral internship and postdoctoral fellowship at the University of Rochester. I am deeply honored to serve the greater Rochester and Monroe County communities. If you are ready to move away from exhausting arguments, quiet anxiety, or maternal guilt, I invite you to reach out. Let's take that first step together.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
