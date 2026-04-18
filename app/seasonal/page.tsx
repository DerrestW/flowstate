import CategoryPage from "@/components/CategoryPage";
export default function SeasonalPage() {
  return <CategoryPage
    eyebrow="Seasonal" headline={"SEASONAL\nEXPERIENCES"} subline="Time-limited activations designed around seasons, holidays, and community moments. We build them, staff them, and operate them."
    heroImg="/img-light-show.png"
    formTitle="BOOK A SEASONAL EXPERIENCE"
    items={[
      { title:"Crawfish Festivals", href:"/seasonal/crawfish-festival", cat:"SEASONAL", img:"/img-color-run-1.png", color:"#FF6B2B", tagline:"Full production, full pots", desc:"Complete crawfish festival productions — tents, vendors, live music, staffing, and operations.", includes:["Vendor coordination","Tenting","Music/entertainment","Health permits"] },
      { title:"Light Shows", href:"/seasonal/light-shows", cat:"SEASONAL", img:"/img-light-show.png", color:"#8B3CF7", tagline:"The night belongs to us", desc:"Spectacular waterfront and park light show installations with full production support.", includes:["Design","Installation","Nightly operations","Teardown"] },
      { title:"Movies on the Lake", href:"/seasonal/movies-on-the-lake", cat:"SEASONAL", img:"/img-sup-rentals.png", color:"#2196F3", tagline:"Cinema reimagined on water", desc:"Floating and lakeside cinema experiences for waterfronts, parks, and venues.", includes:["Screen & sound","Boat coordination","Staff","Concessions support"] },
    ]}
  />;
}
