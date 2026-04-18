import ActivationPageDynamic from "@/components/ActivationPageDynamic";

export default function Page() {
  return <ActivationPageDynamic
    slug="boat-rentals"
    title="Boat Rentals"
    cat="PERMANENT"
    catColor="#2196F3"
    tagline="Your waterfront, fully activated"
    heroImg="/img-donut-boat-hut.png"
    galleryImgs={["/img-donut-boat-hut.png"]}

    about="Managed boat rental programs for marinas, parks, and waterfront venues. Completely turnkey."
    includes={[
      "Fleet supply and management",
      "Certified safety staff",
      "Ticketing and POS",
      "Maintenance",
      "Insurance",
      "Marketing assets",
      "Revenue reporting",
    ]}
    capacity="All ages"
    duration="Daily operation"
    pricing="Revenue share available"
    parentHref="/permanent"
    parentLabel="Permanent"

  />;
}
