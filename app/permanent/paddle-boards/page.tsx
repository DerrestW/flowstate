import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="paddle-boards"
    title="Paddle Board Rentals"
    cat="PERMANENT"
    catColor="#8B3CF7"
    tagline="Stand up and explore"
    heroImg="/img-sup-rentals.png"
    galleryImgs={["/img-sup-rentals.png"]}

    about="Staff-run, safety-certified SUP rental operations for any waterfront or lake venue."
    includes={[
      "Board and equipment fleet",
      "Safety-certified staff",
      "Beginner instruction",
      "Ticketing and POS",
      "Maintenance",
      "Life jackets and safety gear",
      "Marketing",
    ]}
    capacity="All ages"
    duration="Daily operation"
    pricing="Revenue share available"
    parentHref="/permanent"
    parentLabel="Permanent"

  />;
}
