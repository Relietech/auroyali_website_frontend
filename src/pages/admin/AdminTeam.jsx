import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  HardHat,
  Award,
  Layers,
  Coffee,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import {
  getStoredTeamData,
  saveTeamMember,
  deleteTeamMember,
  updateCsebProduction,
  resetTeamToDefault,
  subscribeToTeam,
  TEAM_SECTIONS
} from '../../services/teamStore';

const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='%23e5d5c0'%3E%3Crect width='200' height='200' fill='%23d2b48c'/%3E%3Ccircle cx='100' cy='75' r='40' fill='%23faf6f1'/%3E%3Cpath d='M30 180 c0-40 30-65 70-65 s70 25 70 65' fill='%23faf6f1'/%3E%3C/svg%3E";

// Helper to read and compress local photo files to safe base64 Data URLs
const readImageFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select an image file (PNG, JPG, WebP)'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize to maximum 1200x1200 preserving aspect ratio
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read photo file'));
    reader.readAsDataURL(file);
  });
};

export function AdminTeam() {
  const [teamData, setTeamData] = useState(() => getStoredTeamData());
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'management' | 'administration' | 'siteEngineers' | 'artisans' | 'csebProduction' | 'caretakers'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & form state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // null when adding
  const [selectedSection, setSelectedSection] = useState('management');
  const [memberForm, setMemberForm] = useState({
    id: '',
    name: '',
    role: '',
    trade: '',
    image: '',
    height: 500
  });

  const [isCsebModalOpen, setIsCsebModalOpen] = useState(false);
  const [csebForm, setCsebForm] = useState({
    name: '',
    role: '',
    image: ''
  });

  const [deletingTarget, setDeletingTarget] = useState(null); // { sectionKey, member }
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Subscribe to persistent store updates
  useEffect(() => {
    const unsubscribe = subscribeToTeam((updated) => {
      setTeamData(updated);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Metrics
  const metrics = useMemo(() => {
    const managementCount = teamData.management?.members?.length || 0;
    const adminCount = teamData.administration?.members?.length || 0;
    const siteEngCount = teamData.siteEngineers?.members?.length || 0;
    const artisansCount = teamData.artisans?.members?.length || 0;
    const caretakersCount = teamData.caretakers?.members?.length || 0;
    const totalMembers = managementCount + adminCount + siteEngCount + artisansCount + caretakersCount + 1; // +1 for CSEB team

    return {
      total: totalMembers,
      management: managementCount,
      administration: adminCount,
      siteEngineers: siteEngCount,
      artisans: artisansCount,
      caretakers: caretakersCount
    };
  }, [teamData]);

  // Aggregate members with sectionKey tagged
  const allCategorizedMembers = useMemo(() => {
    const list = [];

    (teamData.management?.members || []).forEach((m) => {
      list.push({ ...m, sectionKey: 'management', sectionLabel: 'Leadership' });
    });
    (teamData.administration?.members || []).forEach((m) => {
      list.push({ ...m, sectionKey: 'administration', sectionLabel: 'Administration' });
    });
    (teamData.siteEngineers?.members || []).forEach((m) => {
      list.push({ ...m, sectionKey: 'siteEngineers', sectionLabel: 'Site Engineers' });
    });
    (teamData.artisans?.members || []).forEach((m) => {
      list.push({ ...m, sectionKey: 'artisans', sectionLabel: 'Artisans' });
    });
    (teamData.caretakers?.members || []).forEach((m) => {
      list.push({ ...m, sectionKey: 'caretakers', sectionLabel: 'Caretakers' });
    });

    return list;
  }, [teamData]);

  // Filtered list based on active tab and search query
  const displayedMembers = useMemo(() => {
    return allCategorizedMembers.filter((m) => {
      if (activeTab !== 'all' && m.sectionKey !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name?.toLowerCase().includes(q);
        const matchRole = m.role?.toLowerCase().includes(q);
        const matchTrade = m.trade?.toLowerCase().includes(q);
        const matchSection = m.sectionLabel?.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchTrade && !matchSection) {
          return false;
        }
      }
      return true;
    });
  }, [allCategorizedMembers, activeTab, searchQuery]);

  // Open modal to add a new member
  const handleOpenAddModal = (defaultSec = 'management') => {
    setEditingMember(null);
    setSelectedSection(defaultSec === 'all' || defaultSec === 'csebProduction' ? 'management' : defaultSec);
    setMemberForm({
      id: '',
      name: '',
      role: '',
      trade: '',
      image: '',
      height: 500
    });
    setIsMemberModalOpen(true);
  };

  // Open modal to edit existing member
  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setSelectedSection(member.sectionKey);
    setMemberForm({
      id: member.id,
      name: member.name || '',
      role: member.role || '',
      trade: member.trade || '',
      image: member.image || '',
      height: member.height || 500
    });
    setIsMemberModalOpen(true);
  };

  // Handle Photo File Upload
  const handlePhotoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const dataUrl = await readImageFileAsDataUrl(file);
      setMemberForm((prev) => ({ ...prev, image: dataUrl }));
      e.target.value = '';
    } catch (err) {
      showToast(err.message || 'Failed to load photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Save member
  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!memberForm.name.trim()) {
      showToast('Please enter member name');
      return;
    }

    const saved = saveTeamMember(selectedSection, memberForm);
    if (saved) {
      showToast(editingMember ? `Updated ${saved.name}` : `Added ${saved.name} to ${TEAM_SECTIONS.find(s => s.key === selectedSection)?.label}`);
      setIsMemberModalOpen(false);
      setEditingMember(null);
    }
  };

  // Delete member
  const handleConfirmDelete = () => {
    if (!deletingTarget) return;
    deleteTeamMember(deletingTarget.sectionKey, deletingTarget.member.id);
    showToast(`Removed ${deletingTarget.member.name}`);
    setDeletingTarget(null);
  };

  // Open CSEB edit modal
  const handleOpenCsebModal = () => {
    const cseb = teamData.csebProduction || {};
    setCsebForm({
      name: cseb.name || 'Kumar and Team',
      role: cseb.role || 'On-Site Hydraulic Block Pressing',
      image: cseb.image || ''
    });
    setIsCsebModalOpen(true);
  };

  const handleCsebPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const dataUrl = await readImageFileAsDataUrl(file);
      setCsebForm((prev) => ({ ...prev, image: dataUrl }));
      e.target.value = '';
    } catch (err) {
      showToast(err.message || 'Failed to load photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveCseb = (e) => {
    e.preventDefault();
    updateCsebProduction(csebForm);
    showToast('Updated CSEB Production Team details');
    setIsCsebModalOpen(false);
  };

  // Reset all to defaults
  const handleResetDefaults = () => {
    resetTeamToDefault();
    showToast('Reset all team sections to default guild roster');
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body">
      {/* 1. PAGE TITLE & PRIMARY ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Users size={11} />
              <span>Guild Directory</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              {metrics.total} active artisans & directors
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            About Page Team & Guild
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light">
            Manage member profiles, roles, and portraits displayed on the website's About page across Leadership, Administration, Site Engineers, Artisans, CSEB Production, and Caretakers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Reset all team sections back to default seed roster"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCsebModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#7A8B69] text-[#2F1F13] hover:text-[#7A8B69] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <HardHat size={14} className="text-[#7A8B69]" />
            <span>Edit CSEB Team</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal(activeTab)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION STATS OVERVIEW - KPI CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Leadership', count: metrics.management, key: 'management', icon: Users, color: '#B5532F', desc: 'Strategy & Leads' },
          { label: 'Administration', count: metrics.administration, key: 'administration', icon: Building, color: '#865430', desc: 'Studio Ops' },
          { label: 'Site Engineers', count: metrics.siteEngineers, key: 'siteEngineers', icon: HardHat, color: '#7A8B69', desc: 'Site Engineering' },
          { label: 'Artisans', count: metrics.artisans, key: 'artisans', icon: Award, color: '#C98A4B', desc: 'Master Crafts' },
          { label: 'CSEB Team', count: 1, key: 'csebProduction', icon: Layers, color: '#524336', desc: 'Hydraulic Press', isCollective: true },
          { label: 'Caretakers', count: metrics.caretakers, key: 'caretakers', icon: Coffee, color: '#7A8B69', desc: 'Site Custodians' }
        ].map((stat) => {
          const IconComp = stat.icon;
          const isActive = activeTab === stat.key;
          return (
            <div
              key={stat.key}
              onClick={() => setActiveTab(stat.key)}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden group hover:shadow-xs select-none ${
                isActive
                  ? 'border-[#B5532F] ring-2 ring-[#B5532F]/15 shadow-sm'
                  : 'border-[#E5D7C5] hover:border-[#B5532F]/40'
              }`}
            >
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider truncate font-semibold">
                  {stat.label}
                </span>
                <IconComp size={15} style={{ color: stat.color }} />
              </div>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="font-sans font-black text-2xl sm:text-3xl text-[#2F1F13] tracking-tight tabular-nums">
                  {stat.count}
                </span>
                <span className="text-[10px] text-[#524336]/60 font-mono">
                  {stat.isCollective ? 'collective' : stat.count === 1 ? 'member' : 'members'}
                </span>
              </div>
              <p className="text-[11px] text-[#524336]/70 mt-1 truncate">
                {stat.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* 3. CONTROLS BAR: TABS & SEARCH */}
      <section className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E5D7C5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Department Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#B5532F] text-white shadow-2xs'
                : 'text-[#524336] hover:bg-[#FAF7F2] hover:text-[#B5532F]'
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#865430] border border-[#E5D7C5]'
              }`}
            >
              {allCategorizedMembers.length}
            </span>
          </button>

          {TEAM_SECTIONS.map((sec) => {
            const count = sec.key === 'csebProduction' ? 1 : (metrics[sec.key] || 0);
            const isCurrent = activeTab === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveTab(sec.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#B5532F] text-white shadow-2xs'
                    : 'text-[#524336] hover:bg-[#FAF7F2] hover:text-[#B5532F]'
                }`}
              >
                <span>{sec.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#865430] border border-[#E5D7C5]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#865430]" />
          <input
            type="text"
            placeholder="Search by name, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#865430] hover:text-red-500 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </section>

      {/* 4. CSEB PRODUCTION TEAM SPECIAL BANNER (Shown when 'all' or 'csebProduction') */}
      {(activeTab === 'all' || activeTab === 'csebProduction') && (
        <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-6 shadow-xs relative overflow-hidden group hover:border-[#7A8B69]/40 transition-colors">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-stone-900 border border-[#E5D7C5] shadow-xs shrink-0 group-hover:shadow-md transition-shadow">
              <img
                src={teamData.csebProduction?.image || FALLBACK_AVATAR}
                alt={teamData.csebProduction?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-bold bg-[#7A8B69] text-white shadow-xs">
                  Collective
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A8B69] font-bold">
                  CSEB Production Team
                </span>
                <span className="text-xs text-[#865430]/40">•</span>
                <span className="text-xs font-mono text-[#524336]/70">Guild Entity</span>
              </div>

              <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#2F1F13] tracking-tight">
                {teamData.csebProduction?.name || 'Kumar and Team'}
              </h3>

              <p className="text-xs font-mono text-[#B5532F] font-bold uppercase tracking-wider">
                {teamData.csebProduction?.role || 'On-Site Hydraulic Block Pressing'}
              </p>

              <p className="text-xs text-[#524336] max-w-2xl font-light leading-relaxed pt-0.5">
                Featured on the About page as the dedicated collective responsible for on-site hydraulic soil block fabrication and earthen brick production.
              </p>
            </div>

            <div className="shrink-0 self-center sm:self-start mt-2 sm:mt-0">
              <button
                type="button"
                onClick={handleOpenCsebModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EBE0] border border-[#E5D7C5] hover:border-[#7A8B69] text-xs font-mono uppercase tracking-wider text-[#2F1F13] hover:text-[#7A8B69] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <Edit2 size={13} className="text-[#7A8B69]" />
                <span>Edit Team Details</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. TEAM MEMBERS CARDS GRID */}
      {displayedMembers.length === 0 && activeTab !== 'csebProduction' ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E5D7C5] space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center mx-auto text-[#B5532F]">
            <Users size={24} />
          </div>
          <h3 className="font-heading font-bold text-2xl text-[#2F1F13]">No guild members found</h3>
          <p className="text-xs sm:text-sm text-[#524336] max-w-sm mx-auto">
            {searchQuery
              ? `No members matching "${searchQuery}". Try clearing your search filter.`
              : 'There are currently no members listed in this section.'}
          </p>
          <button
            type="button"
            onClick={() => handleOpenAddModal(activeTab)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] text-white text-xs font-mono uppercase font-bold shadow-2xs cursor-pointer hover:bg-[#9C4424] transition-colors"
          >
            <Plus size={14} />
            <span>Add Member to this Section</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedMembers.map((member) => (
            <div
              key={member.id}
              className="group bg-white rounded-2xl border border-[#E5D7C5] hover:border-[#B5532F]/50 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badge */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-900 border border-[#E5D7C5] mb-3">
                  <img
                    src={member.image || FALLBACK_AVATAR}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider bg-white/95 text-[#2F1F13] shadow-xs">
                      {member.sectionLabel}
                    </span>
                  </div>
                  {member.height && (
                    <div className="absolute bottom-2 right-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/60 text-white backdrop-blur-xs">
                        {member.height}px
                      </span>
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-lg text-[#2F1F13] group-hover:text-[#B5532F] transition-colors leading-tight truncate">
                    {member.name}
                  </h4>
                  <p className="text-xs font-mono text-[#B5532F] font-semibold truncate">
                    {member.role || 'Craftsperson'}
                  </p>
                  {member.trade && (
                    <p className="text-[11px] text-[#524336] line-clamp-2 leading-relaxed font-light">
                      {member.trade}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-[#F1E8DC] flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-[#865430]/60 uppercase">
                  ID: {member.id.substring(0, 10)}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(member)}
                    className="p-1.5 rounded-lg border border-[#E5D7C5] hover:border-[#B5532F] hover:text-[#B5532F] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    title={`Edit ${member.name}`}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingTarget({ sectionKey: member.sectionKey, member })}
                    className="p-1.5 rounded-lg border border-[#E5D7C5] hover:border-red-400 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title={`Delete ${member.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT TEAM MEMBER */}
      {/* ======================================================== */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5D7C5] p-6 space-y-5 max-h-[90vh] overflow-y-auto font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5532F] font-bold block">
                  Guild Profile Form
                </span>
                <h3 className="font-heading font-black text-xl text-[#2F1F13]">
                  {editingMember ? `Edit ${editingMember.name}` : 'Add Guild Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(false)}
                className="p-1.5 rounded-lg text-[#865430] hover:text-[#2F1F13] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMember} className="space-y-4 text-xs font-mono">
              {/* Department Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Guild Department / Section *
                </label>
                <div className="relative">
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-semibold text-[#2F1F13] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                  >
                    {TEAM_SECTIONS.filter((s) => s.key !== 'csebProduction').map((sec) => (
                      <option key={sec.key} value={sec.key}>
                        {sec.label} — ({sec.description})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#865430] pointer-events-none" />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Member Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohan, Subbulakshmi, Kannan..."
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Role Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive, Head Mason, Site Supervisor, Chef..."
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Height option for Artisans */}
              {selectedSection === 'artisans' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                    Masonry Card Height (Pixels for Staggered Grid)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={360}
                      max={700}
                      step={20}
                      value={memberForm.height}
                      onChange={(e) => setMemberForm({ ...memberForm, height: Number(e.target.value) })}
                      className="w-28 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none"
                    />
                    <div className="flex gap-1">
                      {[440, 480, 520, 560].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setMemberForm({ ...memberForm, height: h })}
                          className={`px-2 py-1 rounded text-[10px] border cursor-pointer ${
                            memberForm.height === h
                              ? 'bg-[#B5532F] text-white border-[#B5532F]'
                              : 'bg-white border-[#E5D7C5] text-[#524336]'
                          }`}
                        >
                          {h}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Member Photo (Upload or URL) */}
              <div className="space-y-2 pt-2 border-t border-[#F0E6D8]">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Member Portrait Photo
                </label>

                {memberForm.image ? (
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5]">
                    <img
                      src={memberForm.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover bg-stone-900 border border-[#E5D7C5] shrink-0"
                    />
                    <div className="space-y-1">
                      <p className="text-[11px] text-[#2F1F13] font-bold">Active Portrait Image</p>
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-[#B5532F] hover:underline cursor-pointer font-bold flex items-center gap-1">
                          <Upload size={11} />
                          <span>Replace</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoFileUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[#865430]/40">•</span>
                        <button
                          type="button"
                          onClick={() => setMemberForm({ ...memberForm, image: '' })}
                          className="text-[11px] text-red-600 hover:underline cursor-pointer font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Upload File */}
                    <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[#E5D7C5] hover:border-[#B5532F] rounded-xl bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 transition-all cursor-pointer text-center group">
                      <Upload size={18} className="text-[#B5532F] mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-bold text-[#2F1F13] group-hover:text-[#B5532F]">
                        {isUploadingPhoto ? 'Uploading...' : 'Upload from Device'}
                      </span>
                      <span className="text-[10px] text-[#865430]/70 mt-0.5">PNG, JPG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileUpload}
                        className="hidden"
                        disabled={isUploadingPhoto}
                      />
                    </label>

                    {/* Or Paste URL */}
                    <div className="flex flex-col justify-center p-3 border border-[#E5D7C5] rounded-xl bg-white space-y-1">
                      <span className="text-[10px] font-bold text-[#865430] uppercase">
                        Or Paste Image URL:
                      </span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={memberForm.image}
                        onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E5D7C5] text-[11px] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E6D8]">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase text-[#524336] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase font-bold shadow-xs cursor-pointer"
                >
                  <Check size={14} />
                  <span>{editingMember ? 'Update Member' : 'Save Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT CSEB PRODUCTION TEAM */}
      {/* ======================================================== */}
      {isCsebModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5D7C5] p-6 space-y-5 font-sans"
          >
            <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5532F] font-bold block">
                  Collective Profile
                </span>
                <h3 className="font-heading font-black text-xl text-[#2F1F13]">
                  Edit CSEB Production Team
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCsebModalOpen(false)}
                className="p-1.5 rounded-lg text-[#865430] hover:text-[#2F1F13] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCseb} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Collective Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kumar and Team"
                  value={csebForm.name}
                  onChange={(e) => setCsebForm({ ...csebForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Collective Role / Operational Subtitle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. On-Site Hydraulic Block Pressing"
                  value={csebForm.role}
                  onChange={(e) => setCsebForm({ ...csebForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Photo */}
              <div className="space-y-2 pt-2 border-t border-[#F0E6D8]">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Team Cover Photo
                </label>

                {csebForm.image && (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-900 border border-[#E5D7C5]">
                    <img src={csebForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-1.5 p-2.5 border border-dashed border-[#E5D7C5] hover:border-[#B5532F] rounded-xl bg-[#FAF7F2] cursor-pointer text-center font-bold">
                    <Upload size={13} className="text-[#B5532F]" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCsebPhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="Or paste photo URL..."
                    value={csebForm.image}
                    onChange={(e) => setCsebForm({ ...csebForm, image: e.target.value })}
                    className="px-2.5 py-2 rounded-xl bg-white border border-[#E5D7C5] text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E6D8]">
                <button
                  type="button"
                  onClick={() => setIsCsebModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase text-[#524336]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B5532F] text-white text-xs font-mono uppercase font-bold shadow-xs cursor-pointer hover:bg-[#9C4424]"
                >
                  <Check size={14} />
                  <span>Save CSEB Team</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {deletingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E5D7C5] p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-xl text-[#2F1F13]">Remove Guild Member?</h3>
              <p className="text-xs text-[#524336] leading-relaxed">
                Are you sure you want to remove <strong>"{deletingTarget.member.name}"</strong> ({deletingTarget.member.role}) from the About page?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTarget(null)}
                className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase text-[#524336] hover:bg-[#FAF7F2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase font-bold shadow-xs cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: RESET CONFIRMATION */}
      {/* ======================================================== */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E5D7C5] p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] text-[#B5532F] flex items-center justify-center mx-auto">
              <RotateCcw size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-xl text-[#2F1F13]">Reset to Seed Roster?</h3>
              <p className="text-xs text-[#524336] leading-relaxed">
                This will reset all sections (Leadership, Administration, Site Engineers, Artisans, CSEB, Caretakers) back to the original Auroville guild roster.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase text-[#524336] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase font-bold shadow-xs cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#2F1F13] text-white text-xs font-mono shadow-2xl border border-[#E5D7C5]/30 animate-fadeIn">
          <CheckCircle2 size={15} className="text-[#7A8B69] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default AdminTeam;
