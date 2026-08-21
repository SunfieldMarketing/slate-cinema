export interface JournalBlock {
  type: 'p' | 'h2' | 'quote' | 'list'
  text?: string
  items?: string[]
  cite?: string
}

export interface JournalPost {
  slug: string
  title: string
  excerpt: string
  category: string
  accent: string
  date: string
  readTime: string
  coverImage: string
  author: string
  content: JournalBlock[]
}

/*
  The Slate Journal — launched per the client's own priorities: SEO first,
  genuinely useful storytelling/branding knowledge second. This first batch
  is written by Claude directly (per the client's explicit instruction on
  the Jul 17 call — "Claude's gonna whip that up... based on all the
  information Claude already has"), covers evergreen search intent around
  video production, and stays general/educational rather than making any
  specific claims about Slate Cinema's own results.
*/
export const journalPosts: JournalPost[] = [
  {
    slug: 'first-three-seconds',
    title: 'Why Most Brand Videos Get Skipped in the First 3 Seconds (And How to Fix It)',
    excerpt:
      'Attention is the only currency that matters on a feed. Here is what separates the videos people actually watch from the ones they scroll past without noticing.',
    category: 'Strategy',
    accent: '#00AEEF',
    date: 'July 2026',
    readTime: '6 min read',
    coverImage: '/images/portfolio_social.webp',
    author: 'The Slate Cinema Team',
    content: [
      {
        type: 'p',
        text: 'A viewer decides whether to keep watching a video before they have consciously registered a single word of it. On a feed, that decision happens in well under three seconds — sometimes closer to one. The video is not competing with other ads. It is competing with a text message notification, a group chat, and the muscle memory of a thumb that already knows how to keep scrolling. That is the real competitive set, and most brand videos are not built for it.',
      },
      { type: 'h2', text: 'The old hook does not work anymore' },
      {
        type: 'p',
        text: 'Traditional commercials were built on a slow-burn structure: establish a setting, introduce a problem, build toward a resolution, land the logo at the end. That structure assumes a captive audience — someone sitting in front of a television with nowhere else to be. A feed viewer has somewhere else to be. They always do. Front-loading a video with scene-setting is the single fastest way to lose them before the idea has even started.',
      },
      {
        type: 'p',
        text: 'The fix is not to talk faster or cut faster for its own sake. It is to reorder the story so the most interesting, specific, or visually strange moment leads. Open on the result, the tension, or the thing a viewer has never seen before — then let the context fill in around it as they keep watching, because they have already decided to stay.',
      },
      { type: 'h2', text: 'What actually earns the next second' },
      {
        type: 'list',
        items: [
          'A visual that could not have come from a stock library — something specific to the brand, the product, or the moment being filmed.',
          'Motion in the first frame. A static opening shot, however beautiful, reads as an ad. Movement reads as content.',
          'A question the viewer did not know they had, answered just slowly enough that they have to keep watching to get the payoff.',
          'Faces. Human expression is processed faster than almost any other visual information — a genuine reaction in frame one buys real estate a wide establishing shot never will.',
          'Sound designed for silence. Most feed video is watched muted first. If the hook depends on a line of dialogue landing, it needs a caption doing the same work visually.',
        ],
      },
      { type: 'h2', text: 'Retention is a design problem, not a luck problem' },
      {
        type: 'p',
        text: 'Every cut in a video is a re-decision point. The viewer is not just deciding whether to keep watching at second zero — they are re-deciding at every edit. That means retention is not something that happens once at the start; it is something a video has to keep earning, cut after cut, all the way to the call to action. A hook that gets someone into the first five seconds and then goes quiet for a slow ten-second setup will still lose most of that audience.',
      },
      {
        type: 'quote',
        text: 'A good hook does not just open the video. It sets a promise the rest of the edit has to keep paying off, second by second.',
      },
      {
        type: 'p',
        text: 'This is why storyboarding for social content looks different from storyboarding for a traditional commercial: every beat gets tested against a single question — does this earn the next three seconds, or does it spend goodwill the hook already bought? Cut anything that only exists to be thorough. Keep anything that surprises, resolves, or escalates.',
      },
      { type: 'h2', text: 'The takeaway' },
      {
        type: 'p',
        text: 'A brand video does not fail because the idea was weak or the production value was low. It fails because it was built for a viewer who was never going to give it thirty uninterrupted seconds. Build for the three seconds you actually have, earn the next three, and the rest of the video gets a chance to do its job.',
      },
    ],
  },
  {
    slug: 'anatomy-of-a-scroll-stopping-ad',
    title: 'The Anatomy of a Scroll-Stopping Video Ad',
    excerpt:
      'Break down what is actually happening, shot by shot, inside the short-form ads that consistently outperform — and why most of it has nothing to do with budget.',
    category: 'Production',
    accent: '#f97316',
    date: 'July 2026',
    readTime: '7 min read',
    coverImage: '/images/ind_products_hero.webp',
    author: 'The Slate Cinema Team',
    content: [
      {
        type: 'p',
        text: 'Two brands can spend the same budget on the same product category and end up with wildly different results. The gap is rarely the gear, the talent, or even the concept on paper. It is almost always structure — the specific sequence of decisions an editor makes about what the viewer sees, in what order, and for how long. Here is what that structure tends to look like when it works.',
      },
      { type: 'h2', text: 'Beat 1 — the disruption (0:00–0:02)' },
      {
        type: 'p',
        text: 'The opening frame has one job: interrupt the scroll. It does not need to explain anything yet. It needs to look, sound, or move differently enough from the content around it that a thumb pauses out of pure reflex. This is usually the least "on-brand" looking moment in the whole edit, and that is by design — a scroll-stopper that looks like an ad gets treated like one.',
      },
      { type: 'h2', text: 'Beat 2 — the stakes (0:02–0:06)' },
      {
        type: 'p',
        text: 'Once the scroll has stopped, the video has roughly four seconds to earn a reason to keep watching. This beat names the problem, the desire, or the tension the video is going to resolve — quickly, specifically, and usually in the viewer\'s own language rather than the brand\'s. "Getting your ring light to actually match your skin tone" outperforms "premium lighting engineered for creators" every time, because one sounds like a real problem and the other sounds like a tagline.',
      },
      { type: 'h2', text: 'Beat 3 — the proof (0:06–0:18)' },
      {
        type: 'p',
        text: 'This is the demonstration — the product doing the thing, the transformation happening on camera, the before/after. It is the longest beat because it is doing the heaviest lifting, but it is rarely one continuous shot. It is usually four to seven micro-cuts, each one a slightly different angle or moment, because a static demonstration shot loses the same viewer the hook just won.',
      },
      {
        type: 'list',
        items: [
          'Cut on action, not on dialogue — mid-motion cuts read as faster even when the pacing is identical.',
          'Vary the shot scale every 2–3 seconds: wide, close, wide, extreme close. Repetition of scale is what makes a demo feel slow.',
          'Let one imperfect, unpolished moment through. A slightly shaky handheld insert or an unscripted reaction reads as proof, not performance.',
        ],
      },
      { type: 'h2', text: 'Beat 4 — the specific outcome (0:18–0:24)' },
      {
        type: 'p',
        text: 'Not a lifestyle montage — a specific, almost boring-sounding outcome. "Ready in nine minutes." "Fits in the front pocket of a backpack." Vague aspirational outcomes get skipped past because the viewer has seen the same footage from ten other brands. A specific, oddly precise outcome is memorable precisely because it sounds true.',
      },
      { type: 'h2', text: 'Beat 5 — the ask (0:24–end)' },
      {
        type: 'p',
        text: 'One ask. Not three. A video that ends on "shop now, link in bio, follow for more" is asking the viewer to make a decision about which action matters, and an audience that has to decide what to do next usually does nothing at all. The strongest closing beats repeat the single specific outcome from Beat 4 one more time, then give exactly one door to walk through.',
      },
      {
        type: 'quote',
        text: 'The brands that win on scroll-stopping content are not the ones with the biggest budgets. They are the ones who treat every second of runtime as something that has to be re-earned.',
      },
      {
        type: 'p',
        text: 'None of this requires a bigger crew or a longer shoot day. It requires knowing, before a single frame is captured, exactly which beat each shot on the call sheet is there to serve — which is a pre-production decision, not a production one.',
      },
    ],
  },
  {
    slug: 'storytelling-vs-selling',
    title: 'Storytelling vs. Selling: What Makes People Actually Watch',
    excerpt:
      'The best-performing brand films rarely mention the product until the second half. Here is why that restraint is a strategy, not an accident.',
    category: 'Brand',
    accent: '#c084fc',
    date: 'June 2026',
    readTime: '5 min read',
    coverImage: '/images/portfolio_production.webp',
    author: 'The Slate Cinema Team',
    content: [
      {
        type: 'p',
        text: 'There is a moment in almost every client kickoff call where the conversation turns to how much of the video should be "about the brand." It is the wrong question, asked from the wrong direction. The videos that move an audience are rarely the ones that talk about the brand the most — they are the ones that understand what the audience already cares about, and let the brand earn a place inside that story instead of interrupting it.',
      },
      { type: 'h2', text: 'People do not resist ads. They resist being sold to.' },
      {
        type: 'p',
        text: 'An audience will happily sit through two minutes of a story they are invested in. What they will not sit through is two minutes of being told why they should buy something, dressed up in cinematic lighting. The difference is not subtle once you know what to look for: selling talks at the viewer about the brand\'s priorities. Storytelling shows the viewer something true about a world they recognize, and trusts them to draw their own conclusion.',
      },
      { type: 'h2', text: 'The brand does not have to be the hero' },
      {
        type: 'p',
        text: 'The strongest brand films often cast the brand as the guide, not the protagonist. The person on screen — the athlete, the founder, the customer, the employee — carries the emotional arc. The brand shows up as the thing that made a specific moment in their story possible: the gear that held up, the space that made the work feel different, the service that showed up when it mattered. That framing does more for brand recall than a dozen logo placements, because the viewer remembers how the story made them feel, and the brand gets to ride along with that feeling instead of trying to manufacture it directly.',
      },
      {
        type: 'quote',
        text: 'Nobody forwards an ad to a friend. People forward stories that made them feel something, and the brand attached to it comes along for free.',
      },
      { type: 'h2', text: 'Restraint is the hardest note to give' },
      {
        type: 'p',
        text: 'Almost every internal review process pulls a video in the opposite direction — more logo, more product shots, more messaging, earlier. It is an understandable instinct: if the team worked hard on the messaging, it is tempting to make sure the video says it, clearly, more than once. But an audience can tell the difference between a story that trusts them and a story that is nervous it did not land, and that nervousness reads on screen as a video that talks over itself.',
      },
      {
        type: 'p',
        text: 'The videos that get shared, rewatched, and remembered are usually the ones where a client trusted the story enough to let it breathe — where the brand shows up right when it is earned, and not a beat before.',
      },
      { type: 'h2', text: 'A simple test' },
      {
        type: 'p',
        text: 'Before a script gets locked, it is worth asking one question of every scene: if the brand name were removed entirely, would someone still want to watch this? If the honest answer is no, the story is not carrying its own weight yet — and no amount of production polish fixes that in the edit.',
      },
    ],
  },
  {
    slug: 'how-to-brief-a-video-team',
    title: 'How to Brief a Video Production Team (So You Get What You Actually Want)',
    excerpt:
      'The single biggest predictor of a smooth shoot is not the crew or the budget. It is what happens in the thirty minutes before anyone picks up a camera.',
    category: 'Working Together',
    accent: '#34d399',
    date: 'June 2026',
    readTime: '6 min read',
    coverImage: '/images/mediavoid_team_bright.webp',
    author: 'The Slate Cinema Team',
    content: [
      {
        type: 'p',
        text: 'Most miscommunication between a brand and a production team does not happen on set. It happens weeks earlier, in a brief that felt thorough at the time but left the two most important questions unanswered: what does this video actually need to do, and what does "good" look like when it is done? Everything downstream — the shot list, the talent, the schedule, the budget — gets built on the answers to those two questions, so a vague answer up front compounds into a much bigger problem later.',
      },
      { type: 'h2', text: 'Start with the job, not the deliverable' },
      {
        type: 'p',
        text: '"We need a 30-second video for Instagram" describes a format, not a job. A useful brief starts with what the video needs to accomplish for the business — drive traffic to a landing page, shorten a sales cycle, recruit for an open role, build trust with a skeptical audience before a launch. The format falls out of the job, not the other way around. A production team that knows the job can make dozens of small, correct calls on set without needing to check in on each one; a production team that only knows the format is guessing.',
      },
      { type: 'h2', text: 'Bring examples, not adjectives' },
      {
        type: 'p',
        text: '"Clean and modern" means something different to every person in the room. A link to three videos — even ones from a completely different industry — that capture the pacing, color, or tone that feels right does more work than a full page of descriptive language. It is also worth being just as clear about what to avoid: a reference labeled "not this" is often more useful than one labeled "like this," because it rules out an entire direction before anyone spends a day shooting it.',
      },
      { type: 'h2', text: 'Answer these before the first call' },
      {
        type: 'list',
        items: [
          'What is the single outcome this video needs to drive, and how will you know if it worked?',
          'Who is the specific viewer — not "our customers," but the actual person, mid-scroll, deciding whether to keep watching?',
          'What is the non-negotiable — a message, a shot, a moment — that has to be in the final cut no matter what gets trimmed?',
          'Who has final sign-off, and how many rounds of revisions does that person expect to need?',
          'What is the real deadline — not the aspirational one, the one tied to a launch date or media buy that cannot move?',
        ],
      },
      { type: 'h2', text: 'Trust the pre-production process to fill in the rest' },
      {
        type: 'quote',
        text: 'A good production team is not looking for a finished script in the intake form. They are looking for enough truth to ask the right follow-up questions.',
      },
      {
        type: 'p',
        text: 'The goal of a first brief is not to hand over a finished creative direction — that is what pre-production is for. The goal is to give a team enough real information that the questions they come back with are sharp, specific, and save everyone time later. A brief that is honest about budget constraints, timeline pressure, and internal politics will always produce a smoother shoot than one that reads well but leaves out the details that actually shape the decisions on the day.',
      },
    ],
  },
  {
    slug: 'pre-production-explained',
    title: 'Pre-Production, Explained: What Actually Happens Before the Camera Rolls',
    excerpt:
      'The part of the process nobody sees is usually the part that determines whether the shoot day goes smoothly. Here is what it actually covers.',
    category: 'Process',
    accent: '#00AEEF',
    date: 'May 2026',
    readTime: '6 min read',
    coverImage: '/images/mediavoid_creative_bright.webp',
    author: 'The Slate Cinema Team',
    content: [
      {
        type: 'p',
        text: 'From the outside, a video production looks like it starts the moment a camera turns on. In practice, by the time anyone is on set, most of the creative and logistical decisions that shape the final video have already been made. Pre-production is where a loose idea turns into a shot list, a schedule, and a plan specific enough that a shoot day can survive the unexpected — because something on a shoot day always is.',
      },
      { type: 'h2', text: 'Concept and script' },
      {
        type: 'p',
        text: 'Every project starts by translating the brief into a concrete narrative structure — even for work that will not use a word of dialogue. What is the opening beat, what changes by the end, and what is the audience meant to feel at each stage in between. For scripted or voiceover-driven pieces, this is where language gets tightened until every line earns its place; for visual-first pieces, it is where the beat sheet gets built instead.',
      },
      { type: 'h2', text: 'Storyboarding and shot planning' },
      {
        type: 'p',
        text: 'Once the structure is locked, it gets translated into an actual shot list — every angle, every piece of coverage, mapped against the edit the team already has in mind. This step exists to catch problems on paper instead of on location: a shot that sounds simple in a script can turn out to need a permit, a specific time of day, or a piece of equipment that was not budgeted for. Finding that out during pre-production costs an email. Finding it out on the shoot day costs the whole afternoon.',
      },
      { type: 'h2', text: 'Location scouting and logistics' },
      {
        type: 'list',
        items: [
          'Confirming a location actually has the light, space, and power access the concept assumes it has.',
          'Securing permits and insurance for anything shot in a public or commercial space.',
          'Mapping a realistic schedule against how much daylight, talent availability, and setup/strike time the day actually allows.',
          'Building a contingency plan for weather, no-shows, and anything else that has a way of happening on shoot day regardless of how well it was planned.',
        ],
      },
      { type: 'h2', text: 'Casting and crew' },
      {
        type: 'p',
        text: 'Matching the right talent, on-camera or behind it, to the specific tone the concept needs. A crew built for a fast-moving, documentary-style shoot looks different from one built for a highly controlled studio production — same industry, completely different staffing, and getting that mismatch wrong is one of the more expensive mistakes to fix mid-shoot.',
      },
      {
        type: 'quote',
        text: 'A well-run shoot day does not look like careful planning. It looks like nothing going wrong — which is the whole point.',
      },
      { type: 'h2', text: 'Why this stage gets more time than people expect' },
      {
        type: 'p',
        text: 'Clients are sometimes surprised that pre-production takes longer than the shoot itself. That ratio is intentional. A single shoot day is expensive to get wrong and nearly impossible to fully redo — locations change, talent schedules move on, budgets do not stretch to a reshoot. Every hour spent in pre-production is an hour spent making sure the one irreversible day of the process goes exactly according to plan.',
      },
    ],
  },
  {
    slug: 'one-shoot-day-month-of-content',
    title: 'Turning One Shoot Day Into a Month of Content',
    excerpt:
      'The most efficient content strategy is not shooting more often. It is planning one shoot day well enough to fuel four weeks of posting.',
    category: 'Strategy',
    accent: '#f97316',
    date: 'May 2026',
    readTime: '5 min read',
    coverImage: '/images/portfolio_event.webp',
    author: 'The Slate Cinema Team',
    content: [
      {
        type: 'p',
        text: 'A common assumption is that a consistent content calendar requires a constant stream of new shoots. In practice, most brands posting daily or weekly are not shooting that often — they are planning a smaller number of shoot days with enough intention that a single day of production can be broken into weeks of distinct, purposeful content.',
      },
      { type: 'h2', text: 'Plan for the cutdowns before the shoot, not after' },
      {
        type: 'p',
        text: 'The difference between a shoot day that produces one polished video and a shoot day that produces a month of content usually comes down to a single planning decision: deciding, before anyone arrives on set, exactly which additional pieces the day needs to generate. A hero video, three vertical cutdowns for social, a handful of raw behind-the-scenes clips, and a set of still photography are not five separate projects — they are five specific things a crew can capture in the natural gaps of a single well-run day, if someone planned for them in advance.',
      },
      { type: 'h2', text: 'What to capture beyond the "main" shot list' },
      {
        type: 'list',
        items: [
          'B-roll with no dialogue dependency — the footage that becomes the backbone of social cutdowns because it can be recut into almost anything.',
          'Vertical-native coverage, captured deliberately in that aspect ratio rather than cropped after the fact from horizontal footage.',
          'Candid, unscripted moments between setups — often the highest-performing content of the entire shoot, and the easiest to forget to capture.',
          'Stills pulled during natural pauses, which cost almost nothing in schedule time but fill weeks of feed and ad-creative needs on their own.',
          'Short vertical interviews or reactions that can stand entirely on their own, separate from the main narrative piece.',
        ],
      },
      { type: 'h2', text: 'One narrative, many formats' },
      {
        type: 'p',
        text: 'The strongest multi-format content plans do not treat each platform as a separate creative problem. They start from one clear story and ask how much of it can be told at fifteen seconds, at sixty seconds, in a single still frame, or in an unscripted behind-the-scenes moment. A viewer who sees the fifteen-second cutdown on one platform and the full narrative piece on another should recognize them as the same story told at two different speeds — not two unrelated pieces of content that happen to share a logo.',
      },
      {
        type: 'quote',
        text: 'The goal of a shoot day is not to produce one video. It is to capture enough raw material that the edit becomes the real production.',
      },
      { type: 'h2', text: 'The payoff' },
      {
        type: 'p',
        text: 'Planned this way, a single well-run shoot day routinely fuels three to four weeks of a posting calendar — not through volume of footage alone, but through a deliberate plan that treats the edit, not just the shoot, as where most of the content actually gets made.',
      },
    ],
  },
]

export function getJournalPostBySlug(slug: string) {
  return journalPosts.find((p) => p.slug === slug)
}
