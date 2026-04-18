import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="color-run"
    title="Color / Graffiti Runs"
    cat="EVENT"
    catColor="#E86B9A"
    tagline="Every finish line is a canvas"
    heroImg="/img-color-run-1.png"
    galleryImgs={["/img-color-run-1.png", "/img-color-run-2.png"]}

    about="5K color powder runs that turn your city into a living rainbow. Family-friendly, photogenic, and a social media magnet that drives thousands."
    includes={[
      "Color powder stations",
      "Start and finish gates",
      "Professional timing",
      "Photography ops",
      "Branded merchandise tent",
      "Sound system and MC",
      "Safety staff",
      "Clean-up crew",
    ]}
    capacity="500–15,000 people"
    duration="Half day"
    pricing="Custom quote"
    parentHref="/events"
    parentLabel="Events"

  />;
}
