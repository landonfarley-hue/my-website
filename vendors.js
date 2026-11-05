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
   phone, website, email, facebook, instagram
   address      a list of office addresses, for example ["123 Main St., Sioux Falls, SD 57104"]
   quoteUrl     optional link for a big button, and quoteLabel for its words (default "Request an estimate")
   infoSource   where the details came from (default: the business's own website)
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
    name: "First Dakota Title",
    category: "Title & Closing",
    services: "Title and closing services",
    area: "Sioux Falls and Lincoln County",
    about: "First Dakota Title is a Sioux Falls title company with a main office downtown and a closing office on the south side of town in Lincoln County.",
    address: ["Main office: 600 S. Main Ave., Suite 101, Sioux Falls, SD 57104", "Lincoln County closing office: 6340 S. Western Ave., Suite 100, Sioux Falls, SD 57108"],
    phone: "(605) 338-6505",
    website: "https://thetitleresourcenetwork.com/",
    infoSource: "public business directories",
    infoDate: "November 2026"
  },
  {
    name: "Getty Abstract & Title Company",
    category: "Title & Closing",
    services: "Abstract, title and closing services",
    area: "Sioux Falls",
    about: "Getty Abstract & Title Company (also listed as Getty-Midwest Abstract & Title Company) is a Sioux Falls title company on the south side of town.",
    address: ["5800 S. Remington Pl., Suite 120, Sioux Falls, SD 57108"],
    phone: "(605) 336-0490",
    website: "https://www.getty-midwest.com/",
    infoSource: "public business directories",
    infoDate: "November 2026"
  },
  {
    name: "Anthem Title",
    category: "Title & Closing",
    services: "Title and closing services",
    area: "Sioux Falls",
    about: "Anthem Title (Anthem Title Escrow Services) is a Sioux Falls title and escrow company and a member of the Home Builders Association of the Sioux Empire.",
    address: ["6300 S. Old Village Pl., Suite 200, Sioux Falls, SD 57108"],
    phone: "(605) 306-3400",
    website: "https://www.anthemtitle.com/",
    infoSource: "public business directories",
    infoDate: "November 2026"
  },
  {
    name: "Land Title Guaranty & Co.",
    category: "Title & Closing",
    services: "Title and closing services",
    area: "Sioux Falls",
    about: "Land Title Guaranty & Co. is a Sioux Falls title company.",
    address: ["3809 S. Kiwanis Cir., Sioux Falls, SD 57105"],
    phone: "(605) 336-1095",
    infoSource: "public business directories",
    infoDate: "November 2026"
  },
  {
    name: "Stewart Title Company, Sioux Falls",
    category: "Title & Closing",
    services: "Title insurance, closing and escrow",
    area: "Sioux Falls, Brandon, Valley Springs and Harrisburg",
    about: "Stewart Title\u2019s Sioux Falls office provides title insurance and closing and escrow services for residential and commercial transactions, and describes its service as a personal, friendly experience with support during and after a transaction.",
    offerings: ["Title insurance", "Closing and escrow for residential and commercial transactions", "Online title order form", "Closing cost, seller proceeds and title fee estimates", "Guides for first-time homebuyers"],
    address: ["6216 S. Pinnacle Pl., Suite 102, Sioux Falls, SD 57108"],
    phone: "(605) 339-3199",
    website: "https://www.stewart.com/sioux-falls",
    quoteUrl: "https://www.stewart.com/sioux-falls",
    quoteLabel: "Get a quote",
    infoDate: "November 2026"
  },
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
