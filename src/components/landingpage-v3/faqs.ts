/* The FAQ list, in its own module so it can be shared.
 *
 * It is rendered by the v3 landing content and also published as FAQPage
 * structured data by /services. Exporting it from the page file instead would
 * mix a constant into a module that otherwise only exports components, which
 * breaks React Fast Refresh for the whole page during development. */
export const faqs = [
  {
    question: "Why don't you need access to my Google Business Profile or website?",
    answer:
      "Our system builds ranking signals externally — through verified local citations, GPS-based activity, and profile optimization techniques — without ever needing login access to your Google Business Profile or website. This keeps your accounts fully secure while we still move your rankings forward.",
  },
  {
    question: "How fast will I see results?",
    answer:
      "Most clients see measurable ranking movement within 4 to 6 weeks, and most reach the Top 3 within 90 days. You’ll get reports every two weeks tracking progress the entire way.",
  },
  {
    question: "Do I have to sign a contract?",
    answer:
      "No long-term contracts. You pay monthly and can cancel anytime. We don't lock you in because we believe results should speak louder than contracts.",
  },
  {
    question: 'How do I know this is not some "black hat" or risky SEO?',
    answer:
      "Everything we do follows Google's guidelines. We use verified ranking signals, legitimate directory citations, authentic review strategies, and proper profile optimization. This is white-hat SEO that's been proven to work consistently for years.",
  },
  {
    question: "What are the requirements for the free trial?",
    answer:
      "You'll get the best results if you already have a verified Google Business Profile, a rating of 3.5 stars or higher, at least 15 reviews, a working website, and you serve customers in a local area.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a short call on this page. We'll review your business, confirm eligibility for the trial, and walk you through goals and next steps on the call.",
  },
  {
    question: "What's the free trial exactly?",
    answer:
      "The free trial gives you 7 days to experience the system. We start the audit, activate your profile optimization, and begin generating ranking signals. You'll see if it works before paying anything. After 7 days, it's your choice to continue or cancel.",
  },
  {
    question: "Is this different from Google Ads or PPC?",
    answer:
      "Completely different. Google Ads requires paying for every click. GMB SEO (organic rankings) means you get free clicks once you're ranked. You pay a flat monthly fee for the service, but each customer call from Google Maps is completely free. Most clients see ROI of 3:1 to 10:1.",
  },
  {
    question: "What if I already have a good Google Business Profile?",
    answer:
      "Even if your profile looks good, there's usually room for optimization. Our audit will show what you're missing. Most businesses have incomplete profiles, missing keywords, weak descriptions, or insufficient ranking signals. We'll fix all of that.",
  },
  {
    question: "Can you guarantee #1 rankings?",
    answer:
      "No one can guarantee a specific position on a specific day, because Google changes its algorithm. What we commit to is the work, full transparency, and a proven methodology — and most of our clients reach the Top 3 within 90 days. Some reach #1. Our focus is the calls that come with it.",
  },
  {
    question: "How many profiles can I have optimized?",
    answer:
      "Our packages cover a single primary location. If you have multiple locations, we can discuss multi-location pricing. Most solo practices and small businesses start with their main location.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You can cancel anytime with no penalty. Your GBP profile stays optimized, but ranking signals and new backlinks stop being generated. Your rankings may gradually decline over time, but the optimization we've done remains.",
  },
  {
    question: "Can I speak with someone before starting?",
    answer:
      "Of course. Book a free consultation with our team using any of the buttons on this page. We'll discuss your specific situation, answer all your questions, and explain exactly how this can help your business.",
  },
];
