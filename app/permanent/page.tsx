import CategoryPage from "@/components/CategoryPage";
export default function PermanentPage() {
  return <CategoryPage
    eyebrow="Permanent" headline={"PERMANENT\nWATERFRONT"} subline="Year-round, revenue-generating waterfront experiences. We set them up, staff them, and manage them so you can focus on your venue."
    heroImg="/img-donut-boat-hut.png"
    formTitle="ADD A PERMANENT EXPERIENCE"
    items={[
      { title:"Donut Boat Rentals", href:"/permanent/donut-boat-rentals", cat:"PERMANENT", img:"/img-donut-boat.png", color:"#FF6B2B", tagline:"Most-photographed rental on water", desc:"Giant novelty donut floats that drive social media, foot traffic, and waterfront energy daily.", includes:["Fleet management","Staff","Maintenance","Ticketing"] },
      { title:"Boat Rentals", href:"/permanent/boat-rentals", cat:"PERMANENT", img:"/img-donut-boat-hut.png", color:"#2196F3", tagline:"Your waterfront, fully activated", desc:"Managed boat rental programs for marinas, parks, and waterfront venues — turnkey.", includes:["Fleet","Staffing","Safety certs","Ticketing"] },
      { title:"Paddle Boards", href:"/permanent/paddle-boards", cat:"PERMANENT", img:"/img-sup-rentals.png", color:"#8B3CF7", tagline:"Stand up and explore", desc:"Staff-run, safety-certified SUP rental operations for any waterfront or lake.", includes:["Board fleet","Safety staff","Instruction","Ticketing"] },
    ]}
  />;
}
