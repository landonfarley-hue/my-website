/* ============ VENDOR DIRECTORY: edit this file to add businesses ============
   Each business is one block between { and }, followed by a comma. Copy the example at the bottom of this
   comment, remove the // marks, and fill it in. Only "name" and "category" are required, and the category
   must match one in the list below. Every business automatically gets its own profile page.

   name         business name
   category     must match the category list below
   services     one short line shown on the search result card
   area         where they work
   about        a short paragraph for the profile page
   offerings    a list of services, for example ["Mowing", "Snow removal"]
   highlights   a list of short selling points, for example ["Locally owned", "Insured"]
   phone, website, email, facebook, instagram, quoteUrl (a "request an estimate" page)
   note         "Landon's note" shown on the profile (only add this if you wrote it)
   rating       for example 5.0     reviewCount   for example 28
   ratingSource where the rating comes from, for example "Google"     ratingUrl   link to those reviews
   reviews      optional list of {author, text, rating, date, source}. Only add a review with the reviewer's
                words exactly as written, and say where it came from in "source".

   Tip: only list businesses you would stand behind. If you get paid for any referral, say so in the note
   (and check the rules for lenders and title companies before accepting any referral fee).
*/
window.VENDOR_CATEGORIES = [
  "Lenders & Mortgage",
  "Title & Closing",
  "Real Estate Attorneys",
  "Home Inspectors",
  "Insurance",
  "General Contractors",
  "Plumbers",
  "Electricians",
  "Heating & Cooling",
  "Roofing & Gutters",
  "Painters",
  "Flooring",
  "Landscaping & Snow Removal",
  "Cleaning Services",
  "Movers",
  "Handyman",
  "Windows & Doors",
  "Garage Doors",
  "Pest Control",
  "Appliance Repair",
  "Staging & Photography"
];

window.VENDORS = [
  {
    name: "Lawn Wolf LLC",
    category: "Landscaping & Snow Removal",
    services: "Lawn care, snow removal and ice control",
    area: "Sioux Falls",
    about: "Lawn Wolf LLC is a locally owned and insured lawn care company serving homes and businesses in Sioux Falls. They work year round, from summer mowing and seasonal cleanup to winter snow removal and ice management.",
    offerings: [
      "Lawn care and routine mowing",
      "Residential and commercial snow removal",
      "Ice control",
      "Storm debris cleanup",
      "Aeration and dethatching",
      "Overseeding",
      "Hedge and shrub trimming",
      "Weed control",
      "Top dressing and leveling",
      "Pet waste removal"
    ],
    highlights: ["Locally owned and insured", "Year-round service", "Homes and businesses", "Online estimate requests"],
    phone: "(605) 709-7488",
    website: "https://lawnwolfllc.com/",
    facebook: "https://www.facebook.com/lawnwolfllc/",
    instagram: "https://www.instagram.com/lawnwolfllc",
    quoteUrl: "https://lawnwolfllc.com/",
    rating: 5.0,
    reviewCount: 28,
    ratingSource: "Google",
    ratingUrl: "https://g.co/kgs/bVXgF7V",
    infoDate: "November 2026"
  },
];
