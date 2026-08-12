import type { GlobalConfig } from 'payload'

/*
  The closing CTA card ("Your next era starts here") rendered identically
  on Home, How It Works, and Portfolio -- one shared editable source.
*/
export const FinalCTA: GlobalConfig = {
  slug: 'final-cta',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: '// Ready To Scale?' },
    { name: 'headlineLine1', type: 'text', required: true, defaultValue: 'Your next era' },
    { name: 'headlineLine2', type: 'text', required: true, defaultValue: 'starts here' },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        "Don't let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI.",
    },
    { name: 'buttonLabel', type: 'text', required: true, defaultValue: 'Get Started' },
    { name: 'buttonHref', type: 'text', required: true, defaultValue: '/contact' },
    { name: 'trustNote', type: 'text', defaultValue: 'Replies within minutes' },
  ],
}
