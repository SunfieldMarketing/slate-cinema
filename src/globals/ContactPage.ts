import type { GlobalConfig } from 'payload'

// Every lucide-react icon used anywhere across the Contact page's cards/
// badges, in one shared option list rather than a dozen near-duplicate
// per-field selects.
const CONTACT_ICONS = [
  'FileText', 'PhoneCall', 'FileCheck2', 'Clapperboard', 'Receipt', 'Repeat', 'BadgeCheck',
  'HelpCircle', 'ClipboardList', 'CalendarClock',
  'Timer', 'ShieldCheck', 'Mail',
  'Clock3', 'Users', 'Wallet', 'Target', 'Sparkles',
  'MessageCircleMore', 'Phone', 'MapPin',
].map((v) => ({ label: v, value: v }))

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  versions: { drafts: true },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Get Started' },
        { name: 'titleLine1', type: 'text', defaultValue: "Let's get" },
        { name: 'titleLine2', type: 'text', defaultValue: 'you started' },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue: "Tell us where you're at and we'll point you to the right next step. We reply within minutes.",
        },
      ],
    },
    {
      name: 'whatHappensNext',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '// After You Reach Out' },
        { name: 'headline', type: 'text', defaultValue: 'What happens next' },
        { name: 'subhead', type: 'text', defaultValue: "From hello until final delivery, here's the road map laid out." },
        { name: 'formPrompt', type: 'text', defaultValue: 'Fill out a form below' },
        {
          name: 'badges',
          type: 'array',
          fields: [
            { name: 'icon', type: 'select', options: CONTACT_ICONS, required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
        {
          name: 'steps',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'icon', type: 'select', options: CONTACT_ICONS, required: true },
            { name: 'step', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'desc', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'stageRouter',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '// Get Started' },
        { name: 'headline', type: 'text', defaultValue: 'What stage are you at?' },
        { name: 'subhead', type: 'text', defaultValue: "No wrong answer here, pick whichever fits where you're at now." },
        {
          name: 'stages',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'icon', type: 'select', options: CONTACT_ICONS, required: true },
            { name: 'step', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'desc', type: 'text', required: true },
            { name: 'ctaLabel', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            { name: 'accent', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'leadForm',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '// Not Sure Yet' },
        { name: 'headline', type: 'text', defaultValue: 'Drop us a line' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            "Not sure exactly what you need yet? Totally fine — most people aren't at first. Leave your info and a real person on our team will reach out with the right next step, no matter how vague the ask.",
        },
        {
          name: 'badges',
          type: 'array',
          fields: [
            { name: 'icon', type: 'select', options: CONTACT_ICONS, required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
        { name: 'submitLabel', type: 'text', defaultValue: 'Send Message' },
        { name: 'successMessage', type: 'text', defaultValue: "We'll be in touch within minutes." },
      ],
    },
    {
      name: 'contactMethods',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Or Reach Us Directly' },
        { name: 'headline', type: 'text', defaultValue: 'Real Humans. Real Work.' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: "No forms, no queue — email, call, or stop by the studio directly. Whatever's easiest for you.",
        },
        {
          name: 'badges',
          type: 'array',
          admin: { description: '"Handled With Care" per client feedback (was "No Bots, Ever")' },
          fields: [
            { name: 'icon', type: 'select', options: CONTACT_ICONS, required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'studioLocation',
      type: 'group',
      admin: { description: 'Address/hours/email pull from Site Settings > Contact -- this only covers section copy' },
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '// The Studio' },
        { name: 'headlineLine1', type: 'text', defaultValue: 'Based in Brooklyn,' },
        { name: 'headlineLine2', type: 'text', defaultValue: 'shooting everywhere.' },
      ],
    },
  ],
}
