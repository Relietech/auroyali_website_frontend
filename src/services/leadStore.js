// Store service for managing inbound contact leads submitted via website contact forms

const STORAGE_KEY = 'auroyali_contact_leads_v2';
const UPDATE_EVENT = 'auroyali_leads_updated';

export const CONTACT_SERVICES = [
  "Block making",
  "Architectural design",
  "Metal fabrication",
  "Carpentry works",
  "Painting",
  "Other"
];

export const WORKSHOP_PROGRAMS = [
  "CSEB Workshop (Compressed Stabilised Earth Blocks)",
  "Rammed Earth Workshop",
  "Ferro Cement Workshop",
  "Timbrel Vault Workshop",
  "Natural Plasters & Finishes Workshop",
  "Bamboo Construction & Joinery Masterclass"
];

export const WORKSHOP_PROFESSIONS = [
  "Architect / Spatial Designer",
  "Civil / Structural Engineer",
  "Architecture Student / Researcher",
  "Contractor / Master Builder",
  "Homeowner / Eco Enthusiast",
  "Artisan / Craftsperson",
  "Other"
];

export const WORKSHOP_DETAILS = {
  "CSEB Workshop (Compressed Stabilised Earth Blocks)": {
    dates: "02 – 05 December 2026",
    fee: "₹14,000",
    location: "AuroYali Soil Lab & Block Yard, Auroville",
    duration: "4 Days Practical Workshop",
    certificate: "Official AuroYali Eco-Construction Certificate"
  },
  "Rammed Earth Workshop": {
    dates: "16 – 19 December 2026",
    fee: "₹15,000",
    location: "AuroYali Soil Lab & Yard, Kottakarai, Auroville",
    duration: "4 Days Practical Workshop",
    certificate: "Official AuroYali Eco-Construction Certificate"
  },
  "Bamboo Construction & Joinery Masterclass": {
    dates: "12 – 16 November 2026",
    fee: "₹18,500",
    location: "AuroYali Bamboo & Craft Yard, Auroville",
    duration: "5 Days Hands-on Intensive",
    certificate: "Official AuroYali Eco-Construction Certificate"
  },
  "Natural Plasters & Finishes Workshop": {
    dates: "22 – 25 January 2027",
    fee: "₹13,500",
    location: "AuroYali Plaster & Texture Lab, Auroville",
    duration: "4 Days Practical Workshop",
    certificate: "Official AuroYali Eco-Construction Certificate"
  },
  "Ferro Cement Workshop": {
    dates: "10 – 14 February 2027",
    fee: "₹16,000",
    location: "AuroYali Structural Vault Yard, Auroville",
    duration: "5 Days Practical Workshop",
    certificate: "Official AuroYali Eco-Construction Certificate"
  },
  "Timbrel Vault Workshop": {
    dates: "04 – 08 March 2027",
    fee: "₹17,500",
    location: "AuroYali Masonry Yard, Auroville",
    duration: "5 Days Practical Workshop",
    certificate: "Official AuroYali Eco-Construction Certificate"
  }
};

// Realistic seed data representing genuine contact page submissions & workshop enrollments
const DEFAULT_CONTACT_LEADS = [
  {
    id: 'lead-ws-2026-001',
    category: 'workshop',
    source: 'Workshop Cohort Modal (/workshops)',
    title: 'CSEB Workshop Enrollment',
    workshopTitle: 'CSEB Workshop (Compressed Stabilised Earth Blocks)',
    batch: '02 – 05 December 2026',
    fee: '₹14,000',
    location: 'AuroYali Soil Lab & Block Yard, Auroville',
    client: {
      name: 'Tara Nair',
      email: 'tara.nair@ecoverse.design',
      phone: '9845019823',
      location: 'Kochi, Kerala',
      profession: 'Architect / Spatial Designer'
    },
    projectDetails: {
      service: 'Workshop Enrollment',
      timeline: 'Dec 02, 2026 Cohort',
      budget: '₹14,000'
    },
    message: 'Goals: Direct hands-on training on manual Auram block pressing and catenary vault arch centering for an ongoing eco-homestay project in Kochi.\nDietary: Strict vegetarian (no onion/garlic).',
    dietaryNotes: 'Strict vegetarian (no onion/garlic)',
    learningGoals: 'Direct physical training on manual Auram block pressing and catenary vault arch centering for an ongoing eco-homestay project.',
    status: 'new',
    priority: 'urgent',
    internalNotes: '',
    createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString()
  },
  {
    id: 'contact-2026-001',
    category: 'contact',
    source: 'Contact Page (/contact)',
    title: 'Architectural design Inquiry',
    client: {
      name: 'Dr. Anand Ramanathan',
      email: 'anand.ramanathan@neurolab.org',
      phone: '9840123890',
      location: 'Kottakarai Green Belt, Auroville',
      profession: 'Researcher'
    },
    projectDetails: {
      service: 'Architectural design',
      timeline: 'Upcoming (3-6 Months)',
      budget: '₹85L - ₹1.1 Cr'
    },
    message: 'We purchased a plot adjoining the green corridor. We want a natural CSEB vault structure with passive solar cooling, lime plastering, and integrated greywater filtration for our orchard. Looking for an initial architectural design consultation.',
    status: 'new',
    priority: 'urgent',
    internalNotes: '',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'lead-ws-2026-002',
    category: 'workshop',
    source: 'Workshop Cohort Modal (/workshops)',
    title: 'Rammed Earth Workshop Enrollment',
    workshopTitle: 'Rammed Earth Workshop',
    batch: '16 – 19 December 2026',
    fee: '₹15,000',
    location: 'AuroYali Soil Lab & Yard, Kottakarai, Auroville',
    client: {
      name: 'Aditya Vardhan',
      email: 'aditya.v@terrahabitat.in',
      phone: '9811234890',
      location: 'Hyderabad, Telangana',
      profession: 'Civil / Structural Engineer'
    },
    projectDetails: {
      service: 'Workshop Enrollment',
      timeline: 'Dec 16, 2026 Cohort',
      budget: '₹15,000'
    },
    message: 'Goals: Training on modular formwork shuttering, tie-rod placement, and pneumatic tamping for monolithic solid earth walls.\nDietary: Standard vegetarian meals.',
    dietaryNotes: 'Standard vegetarian meals',
    learningGoals: 'Modular formwork shuttering, tie-rod placement, and pneumatic tamping for solid monolithic earth walls.',
    status: 'in-review',
    priority: 'high',
    internalNotes: 'Applicant called on phone to ask about guesthouse accommodations in Auroville. Sent partner stay recommendations.',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  },
  {
    id: 'contact-2026-002',
    category: 'contact',
    source: 'Contact Page (/contact)',
    title: 'Block making Inquiry',
    client: {
      name: 'Karthik Balakrishnan',
      email: 'karthik.b@greenscapebuilds.co',
      phone: '9884011223',
      location: 'East Coast Road (ECR), Chennai',
      profession: 'Contractor / Master Builder'
    },
    projectDetails: {
      service: 'Block making',
      timeline: 'Immediate (1-3 Months)',
      budget: 'Bulk supply'
    },
    message: 'We are commencing construction for an eco-resort on ECR near Mahabalipuram. Need supply of 18,000 hydraulically compressed earth blocks (CSEB 240x115x90mm) with 5% cement stabilization. Please share laboratory compression test certificates and a quote with transportation.',
    status: 'in-review',
    priority: 'high',
    internalNotes: 'Sent preliminary technical datasheet. Calculating freight charges for 18k blocks.',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 hours ago
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'lead-ws-2026-003',
    category: 'workshop',
    source: 'Workshop Cohort Modal (/workshops)',
    title: 'Bamboo Construction & Joinery Enrollment',
    workshopTitle: 'Bamboo Construction & Joinery Masterclass',
    batch: '12 – 16 November 2026',
    fee: '₹18,500',
    location: 'AuroYali Bamboo & Craft Yard, Auroville',
    client: {
      name: 'Devika Menon',
      email: 'devika.menon@gmail.com',
      phone: '9740231189',
      location: 'Bengaluru, Karnataka',
      profession: 'Architect / Spatial Designer'
    },
    projectDetails: {
      service: 'Workshop Enrollment',
      timeline: 'Nov 12, 2026 Cohort',
      budget: '₹18,500'
    },
    message: 'Goals: Fish-mouth joints, preservative boron immersion, and curved bamboo lattice roofing for sustainable interior projects.\nDietary: Vegan & lactose-free.',
    dietaryNotes: 'Vegan & lactose-free',
    learningGoals: 'Fish-mouth joints, preservative boron immersion, and curved bamboo lattice roofing.',
    status: 'contacted',
    priority: 'normal',
    internalNotes: 'Devika confirmed interest for next cohort. Waiting for date finalization.',
    createdAt: new Date(Date.now() - 42 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'contact-2026-003',
    category: 'contact',
    source: 'Contact Page (/contact)',
    title: 'Carpentry works Inquiry',
    client: {
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@craftspace.com',
      phone: '9765432109',
      location: 'White Town, Pondicherry',
      profession: 'Restaurateur'
    },
    projectDetails: {
      service: 'Carpentry works',
      timeline: 'Immediate (1-3 Months)',
      budget: '₹12L - ₹18L'
    },
    message: 'Restoring a heritage Franco-Tamil mansion into a bistro in White Town. Need custom live-edge reclaimed teak tables, louvered teak French windows, and bespoke timber cabinetry. Requesting craftsmanship quote and timber catalog.',
    status: 'contacted',
    priority: 'normal',
    internalNotes: 'Master carpenter evaluated drawings. Sample wood finishes sent for approval.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
  },
  {
    id: 'contact-2026-004',
    category: 'contact',
    source: 'Contact Page (/contact)',
    title: 'Metal fabrication Inquiry',
    client: {
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@zenithfarms.in',
      phone: '9870023456',
      location: 'Sadashivanagar, Bengaluru',
      profession: 'Landscape Architect'
    },
    projectDetails: {
      service: 'Metal fabrication',
      timeline: 'Upcoming (3-6 Months)',
      budget: '₹6.5L'
    },
    message: 'Designing an organic farmstead. Looking for weather-resistant Corten steel pergolas, raw iron gates with brass rivets, and custom architectural planter boxes crafted with precision.',
    status: 'contacted',
    priority: 'normal',
    internalNotes: 'Shared fabrication portfolio. Vikram sent CAD layout drawings via WhatsApp for quote calculation.',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
  },
  {
    id: 'contact-2026-005',
    category: 'contact',
    source: 'Contact Page (/contact)',
    title: 'Painting Inquiry',
    client: {
      name: 'Meenakshi Iyer',
      email: 'meenakshi.iyer@gmail.com',
      phone: '9443218765',
      location: 'Alwarpet, Chennai',
      profession: 'Homeowner'
    },
    projectDetails: {
      service: 'Painting',
      timeline: 'Planning (1-2 Months)',
      budget: '₹3L - ₹5L'
    },
    message: 'Require eco-friendly natural lime-wash and earthen textural wall painting for our 3,200 sq.ft home. Looking for color palette options, breathability specs, and a quote for surface preparation.',
    status: 'new',
    priority: 'normal',
    internalNotes: '',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  },
  {
    id: 'contact-2026-006',
    category: 'contact',
    source: 'Contact Page (/contact)',
    title: 'Other Inquiry',
    client: {
      name: 'Siddharth Roy',
      email: 'siddharth@matterstudio.in',
      phone: '9980112344',
      location: 'Indiranagar, Bengaluru',
      profession: 'Design Director'
    },
    projectDetails: {
      service: 'Other',
      timeline: 'Immediate',
      budget: 'Flexible'
    },
    message: 'Inquiring about sustainable interior material sourcing, terra-cotta tile finishes, and on-site acoustic wood panels for our creative agency studio. Would love to discuss a collaboration.',
    status: 'converted',
    priority: 'normal',
    internalNotes: 'Introductory call completed. Client requested an on-site sample kit.',
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  }
];

export const LEAD_STATUSES = [
  { id: 'new', label: 'New', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
  { id: 'in-review', label: 'In Review', color: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
  { id: 'responded', label: 'Responded', color: 'bg-purple-500/10 text-purple-700 border-purple-500/20' },
  { id: 'converted', label: 'Won / Converted', color: 'bg-teal-500/10 text-teal-700 border-teal-500/20' },
  { id: 'archived', label: 'Archived', color: 'bg-stone-500/10 text-stone-600 border-stone-500/20' }
];

/**
 * Fetch all contact and workshop leads from localStorage, fallback to default seed data
 */
export function getStoredLeads() {
  if (typeof window === 'undefined') return DEFAULT_CONTACT_LEADS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy storage to salvage any user contact form submissions
      const legacyRaw = localStorage.getItem('auroyali_leads_v1');
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (Array.isArray(parsedLegacy)) {
            const userSubmissions = parsedLegacy.filter(l => 
              l.category === 'contact' || l.category === 'workshop' || l.source?.includes('Contact Page') || l.source?.includes('Workshop')
            );
            if (userSubmissions.length > 0) {
              const merged = [...userSubmissions, ...DEFAULT_CONTACT_LEADS];
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              return merged;
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTACT_LEADS));
      return DEFAULT_CONTACT_LEADS;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let cleaned = false;
      const updated = parsed.map(l => {
        if (l.status === 'new' && l.internalNotes && (l.id === 'contact-2026-001' || l.id === 'contact-2026-005' || l.id === 'lead-ws-2026-001')) {
          cleaned = true;
          return { ...l, internalNotes: '' };
        }
        return l;
      });

      // Enrich workshop leads with workshop details (fee, location, dates) if missing
      const enriched = updated.map(l => {
        if (l.category === 'workshop' || l.workshopTitle) {
          const detail = WORKSHOP_DETAILS[l.workshopTitle] || {};
          const fee = l.fee || l.projectDetails?.budget || detail.fee || '₹14,000';
          const location = l.location || detail.location || 'AuroYali Soil Lab & Block Yard, Auroville';
          const batch = (l.batch && l.batch !== 'Upcoming Cohort') ? l.batch : (detail.dates || l.batch || 'Upcoming Cohort');
          if (l.fee !== fee || l.location !== location || l.batch !== batch) {
            cleaned = true;
            return {
              ...l,
              fee,
              location,
              batch
            };
          }
        }
        return l;
      });

      if (cleaned) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
      }
      // Ensure both contact and workshop leads are returned
      return enriched.filter(l => 
        l.category === 'contact' || 
        l.category === 'workshop' || 
        l.category === 'quote' || 
        !l.category || 
        l.source?.includes('Contact') || 
        l.source?.includes('Workshop') ||
        !!l.workshopTitle
      );
    }
    return DEFAULT_CONTACT_LEADS;
  } catch (err) {
    console.error('Error loading leads from storage:', err);
    return DEFAULT_CONTACT_LEADS;
  }
}

/**
 * Persist array of leads to localStorage and dispatch event
 */
function persistLeads(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Error saving leads to storage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { count: leads.length } }));
  }
}

/**
 * Fetch single lead by ID
 */
export function getLeadById(id) {
  const leads = getStoredLeads();
  return leads.find(l => l.id === id) || null;
}

/**
 * Create a new lead from public contact form, workshop modal, or admin manual entry
 */
export function createLead(leadData) {
  const current = getStoredLeads();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const newId = `lead-${dateStr}-${randomSuffix}`;

  const isWorkshop = leadData.category === 'workshop' || 
    leadData.source?.toLowerCase().includes('workshop') || 
    !!leadData.workshopTitle ||
    leadData.service?.toLowerCase().includes('workshop');

  const newLead = {
    id: newId,
    category: isWorkshop ? 'workshop' : (leadData.category || 'contact'),
    source: leadData.source || (isWorkshop ? 'Workshop Cohort Modal (/workshops)' : 'Contact Page (/contact)'),
    title: leadData.title || (isWorkshop 
      ? `${leadData.workshopTitle || 'Workshop'} Enrollment` 
      : (leadData.service ? `${leadData.service} Inquiry` : 'Contact Form Inquiry')),
    workshopTitle: leadData.workshopTitle || (isWorkshop ? (leadData.service !== 'Workshop Enrollment' ? leadData.service : 'CSEB Workshop (Compressed Stabilised Earth Blocks)') : ''),
    batch: leadData.batch || (isWorkshop ? (leadData.timeline || WORKSHOP_DETAILS[leadData.workshopTitle]?.dates || 'Upcoming Cohort') : ''),
    fee: leadData.fee || (isWorkshop ? (leadData.budget || WORKSHOP_DETAILS[leadData.workshopTitle]?.fee || '₹14,000') : ''),
    location: leadData.location || (isWorkshop ? (WORKSHOP_DETAILS[leadData.workshopTitle]?.location || 'AuroYali Soil Lab & Block Yard, Auroville') : ''),
    dietaryNotes: leadData.dietaryNotes || '',
    learningGoals: leadData.learningGoals || leadData.message || leadData.comments || '',
    client: {
      name: leadData.name || leadData.client?.name || 'Inbound Prospect',
      email: leadData.email || leadData.client?.email || '',
      phone: leadData.phone || leadData.client?.phone || '',
      location: leadData.location || leadData.client?.location || '',
      profession: leadData.profession || leadData.client?.profession || 'Architect / Spatial Designer'
    },
    projectDetails: {
      service: isWorkshop ? (leadData.workshopTitle || leadData.service || 'Workshop Enrollment') : (leadData.service || leadData.projectDetails?.service || 'General Inquiry'),
      timeline: leadData.timeline || leadData.projectDetails?.timeline || leadData.batch || '',
      budget: leadData.fee || leadData.budget || leadData.projectDetails?.budget || ''
    },
    message: leadData.message || leadData.comments || '',
    status: leadData.status || 'new',
    priority: leadData.priority || 'normal',
    internalNotes: leadData.internalNotes || '',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  const updated = [newLead, ...current];
  persistLeads(updated);
  return newLead;
}

/**
 * Update lead status
 */
export function updateLeadStatus(id, newStatus) {
  const current = getStoredLeads();
  const updated = current.map(lead => {
    if (lead.id === id) {
      return {
        ...lead,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
    }
    return lead;
  });
  persistLeads(updated);
  return updated;
}

/**
 * Update lead priority
 */
export function updateLeadPriority(id, newPriority) {
  const current = getStoredLeads();
  const updated = current.map(lead => {
    if (lead.id === id) {
      return {
        ...lead,
        priority: newPriority,
        updatedAt: new Date().toISOString()
      };
    }
    return lead;
  });
  persistLeads(updated);
  return updated;
}

/**
 * Update internal team notes for a lead
 */
export function updateLeadNotes(id, notes) {
  const current = getStoredLeads();
  const updated = current.map(lead => {
    if (lead.id === id) {
      return {
        ...lead,
        internalNotes: notes,
        updatedAt: new Date().toISOString()
      };
    }
    return lead;
  });
  persistLeads(updated);
  return updated;
}

/**
 * Delete a lead
 */
export function deleteLead(id) {
  const current = getStoredLeads();
  const updated = current.filter(lead => lead.id !== id);
  persistLeads(updated);
  return updated;
}

/**
 * Reset leads back to default seeds
 */
export function resetLeadsToDefault() {
  persistLeads(DEFAULT_CONTACT_LEADS);
  return DEFAULT_CONTACT_LEADS;
}

/**
 * Export leads to CSV file with dedicated workshop inquiry fields
 * @param {'all' | 'contact' | 'workshop'} [categoryFilter='all']
 */
export function exportLeadsToCSV(categoryFilter = 'all') {
  let leads = getStoredLeads();
  if (categoryFilter === 'contact') {
    leads = leads.filter(l => l.category !== 'workshop' && !l.workshopTitle);
  } else if (categoryFilter === 'workshop') {
    leads = leads.filter(l => l.category === 'workshop' || !!l.workshopTitle);
  }

  const isWorkshopOnly = categoryFilter === 'workshop';
  const isContactOnly = categoryFilter === 'contact';

  const headers = isWorkshopOnly ? [
    'Date Received',
    'Category',
    'Source',
    'Status',
    'Priority',
    'Applicant Name',
    'Email',
    'Phone',
    'Profession',
    'Location / City',
    'Workshop Program',
    'Scheduled Cohort / Batch Dates',
    'Tuition Fee',
    'Training Venue / Lab',
    'Goals & Project Intent',
    'Dietary Preferences / Notes',
    'Internal Admin Notes'
  ] : isContactOnly ? [
    'Date Received',
    'Category',
    'Source',
    'Status',
    'Priority',
    'Client Name',
    'Email',
    'Phone',
    'Service Requested',
    'Timeline',
    'Budget',
    'Message Brief',
    'Internal Admin Notes'
  ] : [
    'Date Received',
    'Category',
    'Source',
    'Status',
    'Priority',
    'Client Name',
    'Email',
    'Phone',
    'Profession',
    'Workshop Enquired',
    'Workshop Cohort/Batch',
    'Service Requested',
    'Message Brief',
    'Internal Notes'
  ];

  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map(l => {
    if (isWorkshopOnly) {
      return [
        new Date(l.createdAt).toLocaleDateString('en-IN'),
        'Workshop Enquiry',
        l.source || 'Workshops Page (/workshops)',
        l.status,
        l.priority,
        l.client?.name || '',
        l.client?.email || '',
        l.client?.phone || '',
        l.client?.profession || '',
        l.client?.location || l.location || '',
        l.workshopTitle || l.title || '',
        l.batch || '',
        l.fee || l.projectDetails?.budget || '',
        l.location || '',
        l.learningGoals || l.message || '',
        l.dietaryNotes || '',
        l.internalNotes || ''
      ].map(escapeCSV).join(',');
    }
    if (isContactOnly) {
      return [
        new Date(l.createdAt).toLocaleDateString('en-IN'),
        'Contact Lead',
        l.source || 'Contact Page (/contact)',
        l.status,
        l.priority,
        l.client?.name || '',
        l.client?.email || '',
        l.client?.phone || '',
        l.projectDetails?.service || l.title || '',
        l.projectDetails?.timeline || '',
        l.projectDetails?.budget || '',
        l.message || '',
        l.internalNotes || ''
      ].map(escapeCSV).join(',');
    }
    return [
      new Date(l.createdAt).toLocaleDateString('en-IN'),
      l.category === 'workshop' ? 'Workshop Enquiry' : 'Contact Lead',
      l.source || 'Website Form',
      l.status,
      l.priority,
      l.client?.name || '',
      l.client?.email || '',
      l.client?.phone || '',
      l.client?.profession || '',
      l.workshopTitle || (l.category === 'workshop' ? l.title : ''),
      l.batch || '',
      l.projectDetails?.service || l.title || '',
      l.message || '',
      l.internalNotes || ''
    ].map(escapeCSV).join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filename = isWorkshopOnly
    ? `auroyali_workshop_enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    : isContactOnly
    ? `auroyali_contact_leads_${new Date().toISOString().slice(0, 10)}.csv`
    : `auroyali_leads_${new Date().toISOString().slice(0, 10)}.csv`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export leads to JSON file
 */
export function exportLeadsToJSON() {
  const leads = getStoredLeads();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `auroyali_contact_leads_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Subscribe to reactive lead updates
 */
export function subscribeToLeads(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    callback(getStoredLeads());
  };

  window.addEventListener(UPDATE_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(UPDATE_EVENT, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}
