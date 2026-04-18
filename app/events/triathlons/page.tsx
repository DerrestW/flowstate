import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="triathlons"
    title="Triathlons"
    cat="EVENT"
    catColor="#2196F3"
    tagline="Swim, bike, run — fully managed"
    heroImg="/img-triathlon.png"
    galleryImgs={["/img-triathlon.png"]}

    about="Full triathlon productions including water safety, transition zones, bike course management, and certified timing."
    includes={[
      "Water safety crew",
      "Swim course buoys",
      "Transition zone setup",
      "Bike course marshals",
      "Run course marking",
      "Certified timing",
      "Aid stations",
      "Results portal",
    ]}
    capacity="50–2,000 athletes"
    duration="Full day"
    pricing="Custom quote"
    parentHref="/events"
    parentLabel="Events"

  />;
}
