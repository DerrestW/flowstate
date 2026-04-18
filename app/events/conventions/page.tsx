import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="conventions"
    title="Conventions"
    cat="EVENT"
    catColor="#2196F3"
    tagline="Where ideas meet scale"
    heroImg="/img-convention.png"
    galleryImgs={["/img-convention.png", "/img-trade-show.png"]}

    about="Full convention production and floor management. We coordinate vendors, manage registration, handle A/V and signage, and run smooth multi-day events."
    includes={[
      "Floor planning and layout",
      "Vendor coordination",
      "Registration management",
      "A/V and staging",
      "Signage and wayfinding",
      "Security staffing",
      "Catering coordination",
      "Exhibitor services",
    ]}
    capacity="100–10,000 attendees"
    duration="1–5 days"
    pricing="Custom quote"
    parentHref="/events"
    parentLabel="Events"

  />;
}
