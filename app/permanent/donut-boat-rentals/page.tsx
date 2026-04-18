import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="donut-boat"
    title="Donut Boat Rentals"
    cat="PERMANENT"
    catColor="#FF6B2B"
    tagline="Most-photographed rental on water"
    heroImg="/img-donut-boat.png"
    galleryImgs={["/img-donut-boat.png", "/img-donut-boat-hut.png"]}
  videoId="DN7p1Ja4h40"
    about="Giant novelty donut float rentals that drive social media traffic and waterfront energy. A full turnkey rental operation."
    includes={[
      "Full fleet management",
      "Trained rental staff",
      "Safety briefings",
      "Maintenance and storage",
      "Ticketing and POS",
      "Social media assets",
      "Daily operations",
    ]}
    capacity="All ages"
    duration="Daily operation"
    pricing="Revenue share available"
    parentHref="/permanent"
    parentLabel="Permanent"

  />;
}
