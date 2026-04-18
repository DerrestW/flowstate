import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="movies-on-the-lake"
    title="Movies on the Lake"
    cat="SEASONAL"
    catColor="#2196F3"
    tagline="Cinema reimagined on water"
    heroImg="/img-sup-rentals.png"
    galleryImgs={["/img-sup-rentals.png"]}

    about="Floating and lakeside cinema experiences for waterfronts, parks, and venues."
    includes={[
      "Giant inflatable screen",
      "Cinema-grade sound",
      "Boat and board coordination",
      "Staff and safety",
      "Concessions support",
      "Ticketing",
      "Film licensing",
    ]}
    capacity="50–2,000 attendees"
    duration="Evening events"
    pricing="Custom quote"
    parentHref="/seasonal"
    parentLabel="Seasonal"

  />;
}
