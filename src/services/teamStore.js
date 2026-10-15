import {
  MANAGEMENT_SECTION,
  ADMINISTRATION_SECTION,
  SITE_ENGINEERS_SECTION,
  ARTISANS_SECTION,
  CSEB_PRODUCTION_SECTION,
  CARETAKERS_SECTION,
} from '../data/teamData';

const TEAM_STORAGE_KEY = 'auroyali_team_data_v1';
const TEAM_UPDATE_EVENT = 'auroyali_team_updated';

// Section keys and their human-friendly labels
export const TEAM_SECTIONS = [
  { key: 'management', label: 'Leadership', description: 'Management & Strategic Direction' },
  { key: 'administration', label: 'Administration', description: 'Administration & Resource Flow' },
  { key: 'siteEngineers', label: 'Site Engineers', description: 'Site Engineering & Supervision' },
  { key: 'artisans', label: 'Artisans', description: 'Master Artisans & Guild Craftsmen' },
  { key: 'csebProduction', label: 'CSEB Production Team', description: 'On-Site Hydraulic Block Pressing' },
  { key: 'caretakers', label: 'Caretakers', description: 'Studio & Site Caretakers' },
];

/**
 * Build default team data from seed file
 */
export function getDefaultTeamData() {
  const siteEngineersList = Array.isArray(SITE_ENGINEERS_SECTION.members)
    ? SITE_ENGINEERS_SECTION.members
    : SITE_ENGINEERS_SECTION.member
    ? [SITE_ENGINEERS_SECTION.member]
    : [];

  return {
    management: {
      ...MANAGEMENT_SECTION,
      members: MANAGEMENT_SECTION.members.map((m) => ({ ...m })),
    },
    administration: {
      ...ADMINISTRATION_SECTION,
      members: ADMINISTRATION_SECTION.members.map((m) => ({ ...m })),
    },
    siteEngineers: {
      ...SITE_ENGINEERS_SECTION,
      members: siteEngineersList.map((m) => ({ ...m })),
    },
    artisans: {
      ...ARTISANS_SECTION,
      members: ARTISANS_SECTION.members.map((m) => ({ ...m })),
    },
    csebProduction: {
      ...CSEB_PRODUCTION_SECTION,
    },
    caretakers: {
      ...CARETAKERS_SECTION,
      members: CARETAKERS_SECTION.members.map((m) => ({ ...m })),
    },
  };
}

/**
 * Fetch all team data from localStorage, fallback to default seed data
 */
export function getStoredTeamData() {
  if (typeof window === 'undefined') return getDefaultTeamData();

  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) {
      const seeded = getDefaultTeamData();
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);

    // Safeguard missing sections
    const defaultData = getDefaultTeamData();
    return {
      management: parsed.management || defaultData.management,
      administration: parsed.administration || defaultData.administration,
      siteEngineers: parsed.siteEngineers || defaultData.siteEngineers,
      artisans: parsed.artisans || defaultData.artisans,
      csebProduction: parsed.csebProduction || defaultData.csebProduction,
      caretakers: parsed.caretakers || defaultData.caretakers,
    };
  } catch (err) {
    console.error('Failed to parse team data from localStorage:', err);
    return getDefaultTeamData();
  }
}

/**
 * Persist team data to localStorage and dispatch update events
 */
function persistTeamData(data) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(TEAM_UPDATE_EVENT, { detail: data }));
  } catch (err) {
    console.error('Failed to save team data to localStorage:', err);
  }
}

/**
 * Subscribe to team updates (cross-tab and within-app)
 */
export function subscribeToTeam(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e) => {
    callback(e.detail);
  };

  const handleStorage = (e) => {
    if (e.key === TEAM_STORAGE_KEY) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed);
      } catch (err) {
        console.error('Error handling storage event for team data:', err);
      }
    }
  };

  window.addEventListener(TEAM_UPDATE_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(TEAM_UPDATE_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Add or Update a team member in a specified section
 * @param {string} sectionKey - 'management' | 'administration' | 'siteEngineers' | 'artisans' | 'caretakers'
 * @param {object} memberData - { id?, name, role, trade, image, height? }
 */
export function saveTeamMember(sectionKey, memberData) {
  const data = getStoredTeamData();
  const section = data[sectionKey];

  if (!section || !Array.isArray(section.members)) {
    console.error(`Invalid section key: ${sectionKey}`);
    return null;
  }

  const members = [...section.members];
  const nowId = memberData.id || `member-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  const existingIdx = members.findIndex((m) => m.id === nowId);

  const formattedMember = {
    ...memberData,
    id: nowId,
    name: memberData.name?.trim() || 'Guild Member',
    role: memberData.role?.trim() || 'Craftsperson',
    trade: memberData.trade?.trim() || '',
    image: memberData.image || '',
    ...(sectionKey === 'artisans' && {
      height: Number(memberData.height) || 500,
    }),
  };

  if (existingIdx !== -1) {
    // Update existing member
    members[existingIdx] = {
      ...members[existingIdx],
      ...formattedMember,
    };
  } else {
    // Add new member to start or end of section
    members.push(formattedMember);
  }

  data[sectionKey].members = members;
  persistTeamData(data);
  return formattedMember;
}

/**
 * Delete a team member from a section
 */
export function deleteTeamMember(sectionKey, memberId) {
  const data = getStoredTeamData();
  const section = data[sectionKey];

  if (!section || !Array.isArray(section.members)) return false;

  data[sectionKey].members = section.members.filter((m) => m.id !== memberId);
  persistTeamData(data);
  return true;
}

/**
 * Update the CSEB Production Team group card
 */
export function updateCsebProduction(csebData) {
  const data = getStoredTeamData();
  data.csebProduction = {
    ...data.csebProduction,
    ...csebData,
  };
  persistTeamData(data);
  return data.csebProduction;
}

/**
 * Reset all team data back to the default guild seed roster
 */
export function resetTeamToDefault() {
  const defaults = getDefaultTeamData();
  persistTeamData(defaults);
  return defaults;
}

/**
 * Export all team data to a JSON string
 */
export function exportTeamToJSON() {
  const data = getStoredTeamData();
  return JSON.stringify(data, null, 2);
}
