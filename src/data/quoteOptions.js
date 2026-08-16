/**
 * Options for the quote builder (/#quote).
 *
 * Edit freely, the wizard renders whatever is here, so adding a coverage tier
 * or an add-on needs no code change. `type: 'single'` renders radio-style
 * pills; `type: 'multi'` renders checkbox-style pills.
 */

export const quoteGroups = {
  coverage: {
    label: 'How much coverage?',
    hint: 'Roughly how long we need to be there.',
    type: 'single',
    options: [
      '1–2 hours',
      'Half day (≈4 hrs)',
      'Full day (≈8 hrs)',
      'Multi-day / multiple events',
      'Not sure yet',
    ],
  },
  team: {
    label: 'What kind of team?',
    hint: 'Photo only, or photo and film together.',
    type: 'single',
    options: [
      'Photographer only',
      'Photo + Video',
      'Full crew (multi-cam)',
      'Recommend for me',
    ],
  },
  location: {
    label: 'Where is the shoot?',
    type: 'single',
    options: [
      'Our studio',
      'Your home / venue',
      'Outdoor location',
      'Destination (travel needed)',
      'Undecided',
    ],
  },
  deliverables: {
    label: 'What would you like delivered?',
    hint: 'Pick as many as you need.',
    type: 'multi',
    options: [
      'Edited digital photos',
      'Highlight film',
      'Instagram reels / shorts',
      'Printed album',
      'Framed prints',
      'Full raw gallery',
    ],
  },
  addOns: {
    label: 'Any add-ons?',
    hint: 'Optional, skip if none apply.',
    type: 'multi',
    options: [
      'Drone / aerial shots',
      'Second shooter',
      'Hair & makeup artist',
      'Same-day edit',
      'Extra location',
      'Express delivery',
    ],
  },
}

/** Which groups appear on which step of the wizard. */
export const stepGroups = {
  2: ['coverage', 'team', 'location'],
  3: ['deliverables', 'addOns'],
}

export const budgets = [
  'Under LKR 50,000',
  'LKR 50,000 – 100,000',
  'LKR 100,000 – 250,000',
  'LKR 250,000+',
  'Prefer to discuss',
]
