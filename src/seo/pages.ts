// Every public page, with the title and description that search engines, AI
// assistants and link previews see. The build (scripts/prerender.mjs) turns
// each entry into its own static HTML file and lists it in sitemap.xml and
// llms.txt, so a new public page needs an entry here, a route in App.tsx and
// a rewrite in vercel.json (the build fails if the rewrite is missing).

export const SITE_URL = 'https://www.tektonxlabs.com'

/** The built HTML file a page starts from. The Uyo event and MindfulScroll
 *  keep their own files, so their previews and icons stay their own. */
export type Shell = 'index.html' | 'events/tech-ai-future-uyo/index.html' | 'mindfulscroll/index.html'

export interface PublicPage {
  path: string
  shell: Shell
  title: string
  description: string
  /** Keep the shell's own <title>, description and preview tags untouched. */
  keepShellTags?: boolean
}

export const PUBLIC_PAGES: PublicPage[] = [
  {
    path: '/',
    shell: 'index.html',
    title: 'TektonX — Building People. Building Products. Building Africa.',
    description:
      'A community of young African builders — learning, mentoring, and building together across 8 tech tracks. Join events, programs, and a network that keeps going after the program ends.',
    keepShellTags: true,
  },
  {
    path: '/about',
    shell: 'index.html',
    title: 'About TektonX | Our story, vision and values',
    description:
      'Why TektonX exists: the story, vision, mission and values behind a community of young African builders who learn, meet and build together.',
  },
  {
    path: '/programs',
    shell: 'index.html',
    title: 'Programs | TektonX',
    description:
      'TektonX programs: Campus to Tech Careers, Code for Growth, Competitions, Hub, Mentorship and Tech Pathways.',
  },
  {
    path: '/mentorship',
    shell: 'index.html',
    title: '12-week tech mentorship program | TektonX',
    description:
      'A 12-week mentorship program with three milestones across 8 tech tracks, matching aspiring African tech professionals with experienced mentors.',
  },
  {
    path: '/mentors',
    shell: 'index.html',
    title: 'Meet the mentors | TektonX',
    description:
      'Meet the mentors guiding the next generation of African tech talent at TektonX, by track, or apply to become one.',
  },
  {
    path: '/partnerships',
    shell: 'index.html',
    title: 'Partner with TektonX | Invest in African tech talent',
    description:
      "Partner with TektonX to support the next generation of African tech talent. Send an inquiry and our partnerships team will reach out.",
  },
  {
    path: '/join',
    shell: 'index.html',
    title: 'Join the TektonX community',
    description:
      "Sign up free to the TektonX community for events, updates and opportunities. You don't have to be a mentee or mentor to join.",
  },
  {
    path: '/events/tech-ai-future-uyo',
    shell: 'events/tech-ai-future-uyo/index.html',
    title: 'Tech, AI and the Future: Uyo | TektonX',
    description: 'Recap of Tech, AI and the Future, a free TektonX event in Uyo on Saturday 17 October 2026: the sessions, the speakers and photos.',
    keepShellTags: true,
  },
  {
    path: '/mindfulscroll',
    shell: 'mindfulscroll/index.html',
    title: 'MindfulScroll: Break free from doomscrolling',
    description:
      'An Android app that gives you a gentle pause when scrolling stops being a choice: app limits, short breaks and focus modes. No account, no ads.',
    keepShellTags: true,
  },
  {
    path: '/mindfulscroll/privacy',
    shell: 'mindfulscroll/index.html',
    title: 'Privacy Policy · MindfulScroll',
    description: 'What the MindfulScroll Android app stores on your phone, the permissions it uses and your choices.',
  },
  {
    path: '/mindfulscroll/terms',
    shell: 'mindfulscroll/index.html',
    title: 'Terms of Use · MindfulScroll',
    description: 'The terms for using the MindfulScroll Android app.',
  },
]

/** App screens behind sign-in, plus auth and certificate pages. They load the
 *  site as before but are marked noindex. vercel.json must send each of these
 *  to the app shell. */
export const APP_PATHS = [
  '/auth/(.*)',
  '/dashboard/(.*)',
  '/verify/(.*)',
  '/roadmap',
  '/roadmap/(.*)',
  '/messages',
  '/messages/(.*)',
  '/communication',
  '/profile',
]
