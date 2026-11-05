/* ============ CLIENT REVIEWS: edit this file to add or change reviews ============
   1. Add each review as a block between { and }, followed by a comma. Copy one of the examples below.
      author    (required)  the reviewer's name as they want it shown
      text      (required)  the review, word for word
      rating    1 to 5
      date      optional, for example "October 2026"
      source    optional, for example "Google". Only label a review "Google" if it is really from Google.
      image     optional photo that goes with the review, for example "images/review-ryan.jpg"
      imageAlt  describes that photo for screen readers

   2. Fill in GOOGLE_PROFILE once you have your Google Business Profile link:
      url       the link to your Google reviews (shown as a "Read all reviews on Google" button)
      writeUrl  the link people use to leave you a review (shown as a "Leave a review" button)
      rating    for example 5.0
      count     the number of Google reviews, for example 42
   Leave a value as "" (or 0) to hide that part.
*/
window.GOOGLE_PROFILE = { url: "", writeUrl: "", rating: 0, count: 0 };

window.REVIEWS = [
  {
    "author": "Ryan",
    "text": "Landon does very good work! Handled everything from beginning to end! If any issues arose he was quick to let me know and get them resolved.",
    "rating": 5,
    "image": "images/review-ryan.jpg",
    "imageAlt": "Brick home with a two-car garage at sunset in Sioux Falls"
  },
  {
    "author": "Marv & Sandy",
    "text": "Landon went above and beyond as our realtor. He helped us find a place that we really liked and make the offer that was accepted. Then, we felt some pressure to get ours sold. He listened to our concerns and kept us informed about what was going on with our house and was positive about getting it sold in time to make the deadline for the house we were buying. We had open houses and lots of showings. He got us the…",
    "rating": 5,
    "image": "images/review-marv-sandy.jpg",
    "imageAlt": "Brick and siding ranch home with a two-car garage"
  },
  {
    "author": "Fredrick",
    "text": "Landon is an incredibly knowledgeable and competent person when it comes to realty. I was stuck in an incredibly hard spot with needing to find a place right away because my landlord sold the house out from under me. I needed to get out of there in a hurry but I also wanted to find a place that wasn’t just something I got into just because and had to stick with it. Landon literally worked night and day while I was at work…",
    "rating": 5,
    "image": "images/review-fredrick.jpg",
    "imageAlt": "Dark gray ranch home with a mature tree in the yard"
  }
];
