import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="light-shows"
    title="Light Shows"
    cat="SEASONAL"
    catColor="#8B3CF7"
    tagline="The night belongs to us"
    heroImg="/img-light-show.png"
    galleryImgs={["/img-light-show.png"]}

    about="Spectacular waterfront and park light show installations for the holiday season and special events."
    includes={[
      "Full design and planning",
      "LED installation",
      "Nightly operations",
      "Safety and security",
      "Ticketing if needed",
      "Musical sync options",
      "Photo op installations",
      "Teardown",
    ]}
    capacity="All ages"
    duration="Seasonal run"
    pricing="Custom quote"
    parentHref="/seasonal"
    parentLabel="Seasonal"

  />;
}
