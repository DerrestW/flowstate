import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="5k-events"
    title="5K and Marathons"
    cat="EVENT"
    catColor="#8B3CF7"
    tagline="Community at full speed"
    heroImg="/img-color-run-2.png"
    galleryImgs={["/img-color-run-2.png"]}

    about="Professionally timed and managed 5K and marathon events for municipalities, charities, and corporate sponsors."
    includes={[
      "Certified chip timing",
      "Course design and marking",
      "Aid stations",
      "Start/finish arch",
      "Staffing and volunteers",
      "Medal ceremony",
      "Results portal",
      "Sponsor activation",
    ]}
    capacity="100–10,000 participants"
    duration="Half to full day"
    pricing="Custom quote"
    parentHref="/events"
    parentLabel="Events"

  />;
}
