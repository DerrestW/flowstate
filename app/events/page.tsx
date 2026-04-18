import CategoryPage from "@/components/CategoryPage";
export default function EventsPage() {
  return <CategoryPage
    eyebrow="Events" headline={"EVENTS WE\nPRODUCE"} subline="From conventions to 5Ks, obstacle courses to urban slides — we design, permit, staff, and operate full-scale events for cities and venues."
    heroImg="/img-color-run-1.png"
    formTitle="BRING AN EVENT TO YOUR CITY"
    items={[
      { title:"Urban Slide", href:"/events/urban-slide", cat:"EVENT", img:"/img-urban-slide.png", color:"#2196F3", tagline:"500 feet of pure summer", desc:"A 500-foot modular water slide on city streets. Our flagship activation.", includes:["Full permitting","Traffic control","Day-of ops","Insurance"] },
      { title:"Mud Runs", href:"/events/mud-runs", cat:"EVENT", img:"/img-mud-run-2.png", color:"#C8A96E", tagline:"Get dirty. Get loud.", desc:"Obstacle course mud run productions from course design to operations.", includes:["Course design","Timing","Staffing","Branding"] },
      { title:"Color / Graffiti Runs", href:"/events/color-runs", cat:"EVENT", img:"/img-color-run-1.png", color:"#E86B9A", tagline:"Every finish line is a canvas", desc:"5K color powder runs that turn your city into a living rainbow.", includes:["Color stations","Timing","Start/finish","Photography"] },
      { title:"5K / Marathons", href:"/events/5k-marathons", cat:"EVENT", img:"/img-color-run-2.png", color:"#8B3CF7", tagline:"Community at full speed", desc:"Professionally timed and managed 5K events for any cause or city.", includes:["Certified timing","Course setup","Staffing","Medal ceremony"] },
      { title:"Triathlons", href:"/events/triathlons", cat:"EVENT", img:"/img-triathlon.png", color:"#2196F3", tagline:"Swim, bike, run — fully managed", desc:"Full triathlon productions including transition zones, water safety, and timing.", includes:["Water safety","Transition zones","Bike course","Timing"] },
      { title:"Conventions", href:"/events/conventions", cat:"EVENT", img:"/img-convention.png", color:"#2196F3", tagline:"Where ideas meet scale", desc:"Full convention production — floor management, vendor coordination, and logistics.", includes:["Floor planning","Vendor mgmt","A/V","Registration"] },
      { title:"Trade Shows", href:"/events/trade-shows", cat:"EVENT", img:"/img-trade-show.png", color:"#8B3CF7", tagline:"Your brand on the floor", desc:"Trade show operations, booth coordination, and attendee experience.", includes:["Booth setup","Traffic flow","Staffing","Logistics"] },
      { title:"Fundraisers", href:"/events/fundraisers", cat:"EVENT", img:"/img-fundraiser.png", color:"#FF6B2B", tagline:"Raise more. Give more.", desc:"Custom fundraising activations that break attendance and donation records.", includes:["Sponsorship decks","Ticketing","Marketing","Day-of ops"] },
    ]}
  />;
}
