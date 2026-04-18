import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="crawfish-festival"
    title="Crawfish Festivals"
    cat="SEASONAL"
    catColor="#FF6B2B"
    tagline="Full production, full pots"
    heroImg="/img-color-run-1.png"
    galleryImgs={["/img-color-run-1.png"]}

    about="Complete crawfish festival productions from site planning to last boil. We coordinate vendors, secure health permits, handle tenting and stages."
    includes={[
      "Vendor and food court coordination",
      "Tenting and infrastructure",
      "Live music and entertainment",
      "Health permits and compliance",
      "Staffing and security",
      "Ticketing and wristbands",
      "Sanitation",
      "Marketing",
    ]}
    capacity="500–20,000 attendees"
    duration="1–3 days"
    pricing="Custom quote"
    parentHref="/seasonal"
    parentLabel="Seasonal"

  />;
}
