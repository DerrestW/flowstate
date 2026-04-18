import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="trade-shows"
    title="Trade Shows"
    cat="EVENT"
    catColor="#8B3CF7"
    tagline="Your brand on the floor"
    heroImg="/img-trade-show.png"
    galleryImgs={["/img-trade-show.png"]}

    about="Trade show operations done right. Booth coordination, attendee experience, traffic flow, staffing, and full logistics."
    includes={[
      "Booth assignment and setup",
      "Traffic flow planning",
      "Exhibitor services",
      "Badge and registration",
      "Staffing",
      "A/V support",
      "Catering coordination",
      "Lead retrieval",
    ]}
    capacity="100–5,000 attendees"
    duration="1–3 days"
    pricing="Custom quote"
    parentHref="/events"
    parentLabel="Events"

  />;
}
