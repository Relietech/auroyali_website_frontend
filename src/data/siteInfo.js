export const siteInfo = {
  name: "AUROYALI",
  tagline: "Sustainable Architecture & Natural Earth Construction",
  established: 2012,
  location: {
    address: "International Zone, Kottakarai Village",
    city: "Auroville",
    state: "Tamil Nadu",
    pincode: "605101",
    country: "India"
  },
  contact: {
    phone: "+91 89400 00126",
    emailGeneral: "auroyali@auroville.org.in",
    emailDesign: "auroyali-design@auroville.org.in",
    hours: "Monday – Saturday: 8:30 AM – 5:30 PM (IST)"
  },
  socials: {
    instagram: "https://www.instagram.com/auroyali_auroville/?hl=en",
    facebook: "https://www.facebook.com/people/auroyali_auroville/100072066965911/",
    linkedin: "https://www.linkedin.com/company/auroyali/"
  },
  mission: "Manifesting a new consciousness in architecture and building construction through climate-responsive design, Compressed Stabilized Earth Blocks (CSEB), engineered bamboo, and artisanal craftsmanship."
};

export const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  {
    name: "Services",
    path: "/services",
    submenu: [
      { name: "Architecture", path: "/services/architecture", desc: "Bioclimatic & Sustainable Space Planning" },
      { name: "Construction & CSEB", path: "/services/construction", desc: "Earth Masonry & Turnkey Eco-Building" },
      { name: "Carpentry & Joinery", path: "/services/carpentry", desc: "Reclaimed Woodcraft & Structural Timber" },
      { name: "Metal Fabrication", path: "/services/metal-fabrication", desc: "Artisanal Steel & Structural Metalwork" },
    ]
  },
  { name: "Projects", path: "/projects" },
  {
    name: "Workshops",
    path: "/workshops",
    submenu: [
      { name: "All Workshops", path: "/workshops", desc: "Hands-on Natural Building Programs" },
      { name: "Bamboo Craft Workshop", path: "/workshops/bamboo", desc: "Joinery, Treatment & Tensile Shells" },
    ]
  },

  { name: "Contact", path: "/contact" },
];
