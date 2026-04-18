import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="fundraisers"
    title="Fundraisers"
    cat="EVENT"
    catColor="#FF6B2B"
    tagline="Raise more. Give more."
    heroImg="/img-fundraiser.png"
    galleryImgs={["/img-fundraiser.png"]}

    about="Custom fundraising events built around activations that break attendance and donation records."
    includes={[
      "Activation design",
      "Sponsorship deck",
      "Ticketing setup",
      "Marketing campaign",
      "Staff and volunteers",
      "Day-of operations",
      "Donor recognition",
      "Post-event reporting",
    ]}
    capacity="100–10,000 participants"
    duration="Half to full day"
    pricing="Custom quote"
    parentHref="/events"
    parentLabel="Events"

  />;
}
