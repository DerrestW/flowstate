import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="urban-slide"
    title="Urban Slide"
    cat="EVENT"
    catColor="#2196F3"
    tagline="1,000 feet of pure summer"
    heroImg="/img-urban-slide.png"
    galleryImgs={["/img-urban-slide.png", "/img-urban-slide-splash.png"]}
  videoId="yxdALAzbnqc"
    about="Our flagship activation. A 1,000-foot modular water slide that shuts down streets and opens up cities. The most-photographed day of the summer — fully managed from permits to teardown."
    includes={[
      "Full permitting support",
      "Traffic control planning",
      "Day-of operations crew",
      "Insurance documentation",
      "Site plan design",
      "Equipment transport",
      "Safety staff",
      "Post-event recap",
    ]}
    capacity="500–15,000 people"
    duration="4–8 hours"
    pricing="Custom quote"
    parentHref="/events"
    parentLabel="Events"
  stats={[
      { value: "65+", label: "Events operated" },
      { value: "330K+", label: "Participants" },
      { value: "8K+", label: "Largest single event" },
    ]}
  />;
}
