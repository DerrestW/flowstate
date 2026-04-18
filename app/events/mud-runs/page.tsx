import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="mud-run"
    title="Mud Runs"
    cat="EVENT"
    catColor="#C8A96E"
    tagline="Get dirty. Get loud."
    heroImg="/img-mud-run-2.png"
    galleryImgs={["/img-mud-run-2.png", "/img-mud-run-1.png"]}

    about="Full obstacle course mud run productions from course design to day-of operations. We handle timing, branding, safety, and staffing."
    includes={[
      "Course design and layout",
      "Professional timing",
      "Obstacle setup and safety",
      "Branded start/finish gates",
      "Staff and safety officers",
      "Music and MC",
      "Participant medals",
      "Photography ops",
    ]}
    capacity="500–10,000 people"
    duration="Full day"
    pricing="Custom quote"
    parentHref="/events"
    parentLabel="Events"

  />;
}
