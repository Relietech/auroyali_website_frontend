import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  X,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  MoreVertical,
  Star,
  Download,
  RotateCcw,
  MapPin,
  Building,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import {
  getStoredProjects,
  getProjectBySlug,
  saveProject,
  deleteProject,
  duplicateProject,
  toggleProjectStatus,
  toggleProjectFeatured,
  resetProjectsToDefault,
  exportProjectsToJSON,
  subscribeToProjects
} from '../../services/projectStore';

const ALL_CATEGORIES = [
  'Residential',
  'Commercial & Structural',
  'Institutional',
  'Specialized Craft'
];

const ALL_STATUSES = ['Published', 'Draft'];

export function AdminProjects() {
  const [projects, setProjects] = useState([]);

  // Ant Design Table Features State
  const [sortField, setSortField] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [tableDensity, setTableDensity] = useState('middle'); // 'compact' | 'middle' | 'large'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [quickJumpPage, setQuickJumpPage] = useState('');

  // Ant Design Field Search & Filters State
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null); // 'title' | 'category' | 'location' | 'year' | 'status' | null

  const [titleFilter, setTitleFilter] = useState('');
  const [tempTitleFilter, setTempTitleFilter] = useState('');

  const [categoryFilter, setCategoryFilter] = useState([]);
  const [tempCategoryFilter, setTempCategoryFilter] = useState([]);

  const [locationFilter, setLocationFilter] = useState('');
  const [tempLocationFilter, setTempLocationFilter] = useState('');

  const [yearFilter, setYearFilter] = useState('');
  const [tempYearFilter, setTempYearFilter] = useState('');

  const [statusFilter, setStatusFilter] = useState([]);
  const [tempStatusFilter, setTempStatusFilter] = useState([]);

  // Modals & toast state
  const [viewingProject, setViewingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [openActionRowId, setOpenActionRowId] = useState(null);

  // Load projects from persistent store
  useEffect(() => {
    setProjects(getStoredProjects());
    const unsubscribe = subscribeToProjects((updated) => {
      setProjects(updated);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Toggle filter popover & sync temporary input values
  const toggleFilterDropdown = (field) => {
    if (activeFilterDropdown === field) {
      setActiveFilterDropdown(null);
    } else {
      setActiveFilterDropdown(field);
      if (field === 'title') setTempTitleFilter(titleFilter);
      if (field === 'category') setTempCategoryFilter([...categoryFilter]);
      if (field === 'location') setTempLocationFilter(locationFilter);
      if (field === 'year') setTempYearFilter(yearFilter);
      if (field === 'status') setTempStatusFilter([...statusFilter]);
    }
  };

  const handleApplyTitleFilter = () => {
    setTitleFilter(tempTitleFilter);
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };
  const handleResetTitleFilter = () => {
    setTitleFilter('');
    setTempTitleFilter('');
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };

  const handleApplyCategoryFilter = () => {
    setCategoryFilter(tempCategoryFilter);
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };
  const handleResetCategoryFilter = () => {
    setCategoryFilter([]);
    setTempCategoryFilter([]);
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };

  const handleApplyLocationFilter = () => {
    setLocationFilter(tempLocationFilter);
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };
  const handleResetLocationFilter = () => {
    setLocationFilter('');
    setTempLocationFilter('');
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };

  const handleApplyYearFilter = () => {
    setYearFilter(tempYearFilter);
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };
  const handleResetYearFilter = () => {
    setYearFilter('');
    setTempYearFilter('');
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };

  const handleApplyStatusFilter = () => {
    setStatusFilter(tempStatusFilter);
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };
  const handleResetStatusFilter = () => {
    setStatusFilter([]);
    setTempStatusFilter([]);
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(titleFilter.trim()) ||
    categoryFilter.length > 0 ||
    statusFilter.length > 0;

  const clearAllFilters = () => {
    setTitleFilter('');
    setTempTitleFilter('');
    setCategoryFilter([]);
    setTempCategoryFilter([]);
    setLocationFilter('');
    setTempLocationFilter('');
    setYearFilter('');
    setTempYearFilter('');
    setStatusFilter([]);
    setTempStatusFilter([]);
    setActiveFilterDropdown(null);
    setCurrentPage(1);
    showToast('All column filters cleared');
  };

  // Column header click sorter (Ant Design style)
  const handleColumnSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortField('updatedAt');
      setSortOrder('desc');
    }
  };

  // Projects filtered by individual column search/filters and sorted
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        // Project title search
        if (titleFilter.trim()) {
          const match = p.title?.toLowerCase().includes(titleFilter.toLowerCase().trim());
          if (!match) return false;
        }

        // Category multi-select
        if (categoryFilter.length > 0) {
          const match = categoryFilter.some(
            (c) => c.toLowerCase() === (p.category || '').toLowerCase()
          );
          if (!match) return false;
        }

        // Location search
        if (locationFilter.trim()) {
          const match = p.location?.toLowerCase().includes(locationFilter.toLowerCase().trim());
          if (!match) return false;
        }

        // Year search
        if (yearFilter.trim()) {
          const match = (p.year || '').toString().includes(yearFilter.trim());
          if (!match) return false;
        }

        // Status multi-select
        if (statusFilter.length > 0) {
          const match = statusFilter.some(
            (s) => s.toLowerCase() === (p.status || 'Published').toLowerCase()
          );
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let compare = 0;
        if (sortField === 'year') {
          compare = parseInt(a.year || 0) - parseInt(b.year || 0);
        } else if (sortField === 'title') {
          compare = (a.title || '').localeCompare(b.title || '');
        } else if (sortField === 'category') {
          compare = (a.category || '').localeCompare(b.category || '');
        } else if (sortField === 'location') {
          compare = (a.location || '').localeCompare(b.location || '');
        } else if (sortField === 'status') {
          compare = (a.status || 'Published').localeCompare(b.status || 'Published');
        } else {
          compare = new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
        }
        return sortOrder === 'desc' ? -compare : compare;
      });
  }, [projects, titleFilter, categoryFilter, locationFilter, yearFilter, statusFilter, sortField, sortOrder]);

  // Reset pagination & actions on search, filter, sort, or page size change
  useEffect(() => {
    setCurrentPage(1);
    setOpenActionRowId(null);
  }, [titleFilter, categoryFilter, locationFilter, yearFilter, statusFilter, sortField, sortOrder, pageSize]);

  useEffect(() => {
    setOpenActionRowId(null);
  }, [currentPage]);

  // Ant Design Pagination calculations
  const totalItems = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

  // Ant Design Row Selection
  const allOnPageSelected =
    paginatedProjects.length > 0 &&
    paginatedProjects.every((p) => selectedRowKeys.includes(p.id));

  const isIndeterminate =
    paginatedProjects.some((p) => selectedRowKeys.includes(p.id)) && !allOnPageSelected;

  const handleSelectAllOnPage = () => {
    if (allOnPageSelected) {
      setSelectedRowKeys((prev) => prev.filter((id) => !paginatedProjects.some((p) => p.id === id)));
    } else {
      const pageIds = paginatedProjects.map((p) => p.id);
      setSelectedRowKeys((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    selectedRowKeys.forEach((id) => deleteProject(id));
    showToast(`Deleted ${selectedRowKeys.length} selected projects`);
    setSelectedRowKeys([]);
    setBatchDeleteConfirm(false);
  };

  const handleBatchStatus = (newStatus) => {
    selectedRowKeys.forEach((id) => {
      const proj = getProjectBySlug(id);
      if (proj && proj.status !== newStatus) {
        saveProject({ ...proj, status: newStatus });
      }
    });
    showToast(`Updated ${selectedRowKeys.length} projects to "${newStatus}"`);
    setSelectedRowKeys([]);
  };

  // Ant Design Density padding
  const densityPadding = {
    compact: 'py-2 px-3 text-xs',
    middle: 'py-3.5 px-4 text-xs sm:text-sm',
    large: 'py-4.5 px-5 text-sm',
  }[tableDensity] || 'py-3.5 px-4 text-xs sm:text-sm';

  // Sorter arrow renderer (Ant Design style)
  const renderSorter = (field) => {
    const isCurrent = sortField === field;
    return (
      <span className="inline-flex flex-col items-center justify-center ml-1.5 w-3 text-[9px] leading-[7px] text-[#865430]/40 select-none">
        <span className={isCurrent && sortOrder === 'asc' ? 'text-[#B5532F] font-black' : 'group-hover/sort:text-[#B5532F]'}>▲</span>
        <span className={isCurrent && sortOrder === 'desc' ? 'text-[#B5532F] font-black' : 'group-hover/sort:text-[#B5532F]'}>▼</span>
      </span>
    );
  };

  // Metric stats
  const metrics = useMemo(() => {
    const total = projects.length;
    const published = projects.filter((p) => (p.status || 'Published') === 'Published').length;
    const drafts = total - published;
    const featured = projects.filter((p) => p.featured).length;
    const categoriesCount = new Set(projects.map((p) => p.category).filter(Boolean)).size;

    return { total, published, drafts, featured, categoriesCount };
  }, [projects]);

  // Actions
  const handleDuplicate = (id) => {
    const duplicated = duplicateProject(id);
    if (duplicated) {
      showToast(`Project duplicated: "${duplicated.title}"`);
    }
  };

  const handleToggleStatus = (id) => {
    const updated = toggleProjectStatus(id);
    if (updated) {
      showToast(`Status updated to "${updated.status}"`);
    }
  };

  const handleToggleFeatured = (id) => {
    const updated = toggleProjectFeatured(id);
    if (updated) {
      showToast(updated.featured ? 'Pinned to Featured showcase' : 'Removed from Featured');
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingProject) return;
    deleteProject(deletingProject.id);
    showToast(`Project "${deletingProject.title}" deleted`);
    setDeletingProject(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all projects back to the default portfolio showcase? Any custom edits will be replaced.')) {
      resetProjectsToDefault();
      showToast('Projects reset to default data');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-body">
      {/* 1. PAGE TITLE & PRIMARY ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5D7C5]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles size={11} />
              <span>Portfolio Registry</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">• Architectural Catalog</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            Project Management
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light">
            Curate, register, and publish AuroYali's residential builds, earthen structures, and craft milestones.
          </p>
        </div>

        {/* Primary Page Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Reset portfolio to initial seed projects"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={exportProjectsToJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#524336] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Download full project catalog as JSON"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>New Project</span>
          </Link>
        </div>
      </div>
        
        {/* KPI METRIC CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {/* Total Projects */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#B5532F]/40 transition-colors">
            <div className="flex items-center justify-between text-[#865430]">
              <span className="text-[11px] font-mono uppercase tracking-wider">Total Projects</span>
              <Building size={16} className="text-[#B5532F]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading font-black text-3xl sm:text-4xl text-[#2F1F13]">{metrics.total}</span>
              <span className="text-xs text-[#7A8B69] font-mono">active</span>
            </div>
            <p className="text-[11px] text-[#524336]/70 mt-1">Across all spatial disciplines</p>
          </div>

          {/* Published */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#7A8B69]/40 transition-colors">
            <div className="flex items-center justify-between text-[#865430]">
              <span className="text-[11px] font-mono uppercase tracking-wider">Published Live</span>
              <CheckCircle2 size={16} className="text-[#7A8B69]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading font-black text-3xl sm:text-4xl text-[#7A8B69]">{metrics.published}</span>
              <span className="text-xs text-[#524336]/60 font-mono">public</span>
            </div>
            <p className="text-[11px] text-[#524336]/70 mt-1">Visible on visitor website</p>
          </div>

          {/* Drafts */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#C98A4B]/40 transition-colors">
            <div className="flex items-center justify-between text-[#865430]">
              <span className="text-[11px] font-mono uppercase tracking-wider">Drafts & Staging</span>
              <Layers size={16} className="text-[#C98A4B]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading font-black text-3xl sm:text-4xl text-[#C98A4B]">{metrics.drafts}</span>
              <span className="text-xs text-[#524336]/60 font-mono">hidden</span>
            </div>
            <p className="text-[11px] text-[#524336]/70 mt-1">In review or unreleased</p>
          </div>

          {/* Featured Highlights */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#B5532F]/40 transition-colors">
            <div className="flex items-center justify-between text-[#865430]">
              <span className="text-[11px] font-mono uppercase tracking-wider">Featured Spots</span>
              <Star size={16} className="text-[#B5532F] fill-[#B5532F]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading font-black text-3xl sm:text-4xl text-[#B5532F]">{metrics.featured}</span>
              <span className="text-xs text-[#524336]/60 font-mono">pinned</span>
            </div>
            <p className="text-[11px] text-[#524336]/70 mt-1">Highlighted on homepage showcase</p>
          </div>
        </section>

        {/* 3. PROJECTS TABLE DISPLAY */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E5D7C5] space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center mx-auto text-[#B5532F]">
              <Building size={24} />
            </div>
            <h3 className="font-heading font-bold text-2xl text-[#2F1F13]">No projects found</h3>
            <p className="text-xs sm:text-sm text-[#524336] max-w-sm mx-auto">
              Your architectural portfolio has no entries yet. Add your first project using the "New Project" button above.
            </p>
          </div>
        ) : (
          /* ANT DESIGN STYLE TABLE VIEW */
          <div className="space-y-3">
            {/* Batch Action Toolbar when rows are selected */}
            {selectedRowKeys.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#B5532F]/30 text-xs font-mono shadow-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-[#2F1F13]">
                  <div className="w-4 h-4 rounded-[4px] bg-[#B5532F] text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>Selected <strong>{selectedRowKeys.length}</strong> {selectedRowKeys.length === 1 ? 'item' : 'items'}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedRowKeys([])}
                    className="text-[#B5532F] hover:underline cursor-pointer ml-1 font-semibold"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBatchStatus('Published')}
                    className="px-3 py-1 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#7A8B69] hover:text-[#5C6E4B] text-xs font-mono font-semibold transition-colors cursor-pointer"
                  >
                    Set Published
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBatchStatus('Draft')}
                    className="px-3 py-1 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#C98A4B] hover:text-[#9C6530] text-xs font-mono font-semibold transition-colors cursor-pointer"
                  >
                    Set Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchDeleteConfirm(true)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-mono font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    Delete Selected ({selectedRowKeys.length})
                  </button>
                </div>
              </div>
            )}

            {/* Active Column Filters Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono text-[#524336] shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-[#865430] text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <Filter size={11} className="text-[#B5532F]" />
                    <span>Active Filters:</span>
                  </span>
                  {titleFilter && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#E5D7C5] text-[11px] text-[#2F1F13]">
                      Project: <strong className="text-[#B5532F]">"{titleFilter}"</strong>
                      <button
                        type="button"
                        onClick={() => { setTitleFilter(''); setTempTitleFilter(''); }}
                        className="hover:text-red-500 cursor-pointer ml-0.5"
                        title="Clear project filter"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {categoryFilter.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#E5D7C5] text-[11px] text-[#2F1F13]">
                      Category: <strong className="text-[#B5532F]">{categoryFilter.join(', ')}</strong>
                      <button
                        type="button"
                        onClick={() => { setCategoryFilter([]); setTempCategoryFilter([]); }}
                        className="hover:text-red-500 cursor-pointer ml-0.5"
                        title="Clear category filter"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  )}

                  {statusFilter.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#E5D7C5] text-[11px] text-[#2F1F13]">
                      Status: <strong className="text-[#B5532F]">{statusFilter.join(', ')}</strong>
                      <button
                        type="button"
                        onClick={() => { setStatusFilter([]); setTempStatusFilter([]); }}
                        className="hover:text-red-500 cursor-pointer ml-0.5"
                        title="Clear status filter"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-mono text-[#B5532F] hover:underline font-bold cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Invisible backdrop to dismiss any open filter popover or action menu on outside click */}
            {(activeFilterDropdown || openActionRowId) && (
              <div
                className="fixed inset-0 z-30"
                onClick={() => {
                  setActiveFilterDropdown(null);
                  setOpenActionRowId(null);
                }}
              />
            )}

            <div className="bg-white rounded-xl border border-[#E5D7C5] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-h-[220px]">
                  <thead>
                    <tr className="border-b border-[#E5D7C5] bg-[#FAF7F2] text-[11px] font-mono uppercase tracking-wider text-[#524336]">
                      {/* Ant Design Selection Checkbox Header */}
                      <th className="py-3 px-3.5 w-10 text-center font-semibold">
                        <div
                          role="checkbox"
                          aria-checked={allOnPageSelected ? true : isIndeterminate ? 'mixed' : false}
                          onClick={handleSelectAllOnPage}
                          className={`w-4 h-4 rounded-[4px] border transition-all flex items-center justify-center mx-auto cursor-pointer ${
                            allOnPageSelected || isIndeterminate
                              ? 'bg-[#B5532F] border-[#B5532F] text-white shadow-2xs'
                              : 'border-[#D2B48C] hover:border-[#B5532F] bg-white'
                          }`}
                          title={allOnPageSelected ? 'Deselect page' : 'Select page'}
                        >
                          {allOnPageSelected && <Check size={12} strokeWidth={3} />}
                          {isIndeterminate && <div className="w-2 h-0.5 bg-white rounded-xs" />}
                        </div>
                      </th>

                      {/* Pin */}
                      <th className="py-3 px-2 w-10 text-center font-semibold">Pin</th>

                      {/* Project & Cover (Search Filter) */}
                      <th className="py-3 px-4 font-semibold select-none relative">
                        <div className="flex items-center justify-between gap-1">
                          <span>Project & Cover</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFilterDropdown('title');
                            }}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              titleFilter
                                ? 'bg-[#B5532F]/15 text-[#B5532F] font-bold ring-1 ring-[#B5532F]/30'
                                : 'text-[#865430]/40 hover:text-[#B5532F] hover:bg-[#FAF7F2]'
                            }`}
                            title={titleFilter ? `Active search: "${titleFilter}"` : 'Search project title'}
                          >
                            <Search size={12} strokeWidth={titleFilter ? 2.5 : 2} />
                          </button>
                        </div>

                        {/* Title Search Popover */}
                        {activeFilterDropdown === 'title' && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-2 top-full mt-1.5 z-40 w-64 bg-white rounded-xl shadow-2xl border border-[#E5D7C5] p-3 text-xs space-y-2.5 font-sans"
                          >
                            <div className="font-mono text-[11px] font-bold text-[#865430] uppercase tracking-wider">
                              Search Project
                            </div>
                            <input
                              type="text"
                              placeholder="Type project title..."
                              value={tempTitleFilter}
                              onChange={(e) => setTempTitleFilter(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleApplyTitleFilter()}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5D7C5] bg-[#FAF7F2] text-xs text-[#2F1F13] focus:outline-none focus:ring-1 focus:ring-[#B5532F]"
                              autoFocus
                            />
                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={handleResetTitleFilter}
                                className="px-2.5 py-1 text-xs font-mono uppercase text-[#865430] hover:text-[#B5532F] rounded-md hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                              >
                                Reset
                              </button>
                              <button
                                type="button"
                                onClick={handleApplyTitleFilter}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                <Search size={11} />
                                <span>Search</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </th>

                      {/* Category (Multi-Select Filter) */}
                      <th className="py-3 px-4 font-semibold select-none relative">
                        <div className="flex items-center justify-between gap-1">
                          <span>Category</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFilterDropdown('category');
                            }}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              categoryFilter.length > 0
                                ? 'bg-[#B5532F]/15 text-[#B5532F] font-bold ring-1 ring-[#B5532F]/30'
                                : 'text-[#865430]/40 hover:text-[#B5532F] hover:bg-[#FAF7F2]'
                            }`}
                            title={categoryFilter.length > 0 ? `Filter: ${categoryFilter.length} selected` : 'Filter categories'}
                          >
                            <Filter size={12} strokeWidth={categoryFilter.length > 0 ? 2.5 : 2} />
                          </button>
                        </div>

                        {/* Category Filter Popover */}
                        {activeFilterDropdown === 'category' && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-2 top-full mt-1.5 z-40 w-60 bg-white rounded-xl shadow-2xl border border-[#E5D7C5] p-3 text-xs space-y-2 font-sans"
                          >
                            <div className="font-mono text-[11px] font-bold text-[#865430] uppercase tracking-wider">
                              Filter Categories
                            </div>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {ALL_CATEGORIES.map((cat) => {
                                const checked = tempCategoryFilter.includes(cat);
                                return (
                                  <label
                                    key={cat}
                                    className="flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-[#FAF7F2] cursor-pointer text-[#2F1F13]"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        setTempCategoryFilter((prev) =>
                                          checked ? prev.filter((c) => c !== cat) : [...prev, cat]
                                        );
                                      }}
                                      className="w-3.5 h-3.5 accent-[#B5532F] rounded cursor-pointer"
                                    />
                                    <span className="text-xs truncate">{cat}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-[#F1E8DC]">
                              <button
                                type="button"
                                onClick={handleResetCategoryFilter}
                                className="px-2.5 py-1 text-xs font-mono uppercase text-[#865430] hover:text-[#B5532F] rounded-md hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                              >
                                Reset
                              </button>
                              <button
                                type="button"
                                onClick={handleApplyCategoryFilter}
                                className="px-3 py-1 bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        )}
                      </th>

                      {/* Location */}
                      <th className="py-3 px-4 font-semibold select-none">Location</th>

                      {/* Year & Area (Sortable) */}
                      <th className="py-3 px-4 font-semibold select-none">
                        <div
                          onClick={() => handleColumnSort('year')}
                          className="flex items-center gap-1 cursor-pointer group/sort hover:text-[#B5532F] transition-colors inline-flex"
                          title="Click to sort by year"
                        >
                          <span>Year & Area</span>
                          {renderSorter('year')}
                        </div>
                      </th>

                      {/* Status (Multi-Select Filter) */}
                      <th className="py-3 px-4 font-semibold select-none relative text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span>Status</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFilterDropdown('status');
                            }}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              statusFilter.length > 0
                                ? 'bg-[#B5532F]/15 text-[#B5532F] font-bold ring-1 ring-[#B5532F]/30'
                                : 'text-[#865430]/40 hover:text-[#B5532F] hover:bg-[#FAF7F2]'
                            }`}
                            title={statusFilter.length > 0 ? `Filter: ${statusFilter.join(', ')}` : 'Filter status'}
                          >
                            <Filter size={12} strokeWidth={statusFilter.length > 0 ? 2.5 : 2} />
                          </button>
                        </div>

                        {/* Status Filter Popover */}
                        {activeFilterDropdown === 'status' && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-2 top-full mt-1.5 z-40 w-48 bg-white rounded-xl shadow-2xl border border-[#E5D7C5] p-3 text-xs space-y-2 font-sans text-left"
                          >
                            <div className="font-mono text-[11px] font-bold text-[#865430] uppercase tracking-wider">
                              Filter Status
                            </div>
                            <div className="space-y-1">
                              {ALL_STATUSES.map((status) => {
                                const checked = tempStatusFilter.includes(status);
                                return (
                                  <label
                                    key={status}
                                    className="flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-[#FAF7F2] cursor-pointer text-[#2F1F13]"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        setTempStatusFilter((prev) =>
                                          checked ? prev.filter((s) => s !== status) : [...prev, status]
                                        );
                                      }}
                                      className="w-3.5 h-3.5 accent-[#B5532F] rounded cursor-pointer"
                                    />
                                    <span className="text-xs">{status}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-[#F1E8DC]">
                              <button
                                type="button"
                                onClick={handleResetStatusFilter}
                                className="px-2.5 py-1 text-xs font-mono uppercase text-[#865430] hover:text-[#B5532F] rounded-md hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                              >
                                Reset
                              </button>
                              <button
                                type="button"
                                onClick={handleApplyStatusFilter}
                                className="px-3 py-1 bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        )}
                      </th>

                      {/* Actions */}
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1E8DC] text-xs sm:text-sm">
                    {paginatedProjects.map((project, index) => {
                      const isSelected = selectedRowKeys.includes(project.id);
                      return (
                        <tr
                          key={project.id}
                          className={`transition-colors group ${
                            isSelected ? 'bg-[#B5532F]/5 hover:bg-[#B5532F]/10' : 'hover:bg-[#FAF7F2]/80 bg-white'
                          }`}
                        >
                          {/* Row Selection Checkbox */}
                          <td className={`${densityPadding} text-center`}>
                            <div
                              role="checkbox"
                              aria-checked={isSelected}
                              onClick={() => handleSelectRow(project.id)}
                              className={`w-4 h-4 rounded-[4px] border transition-all flex items-center justify-center mx-auto cursor-pointer ${
                                isSelected
                                  ? 'bg-[#B5532F] border-[#B5532F] text-white shadow-2xs'
                                  : 'border-[#D2B48C] hover:border-[#B5532F] bg-white'
                              }`}
                            >
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          </td>

                          {/* Pin Star */}
                          <td className={`${densityPadding} text-center`}>
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(project.id)}
                              className="p-1 rounded-md text-[#C98A4B] hover:scale-110 transition-transform cursor-pointer"
                              title={project.featured ? 'Featured on home showcase' : 'Click to feature'}
                            >
                              <Star
                                size={15}
                                className={project.featured ? 'fill-[#B5532F] text-[#B5532F]' : 'text-[#D2B48C] hover:text-[#B5532F]'}
                              />
                            </button>
                          </td>

                          {/* Project title and cover thumbnail */}
                          <td className={densityPadding}>
                            <div className="flex items-center gap-3.5 min-w-[220px]">
                              <div className="w-13 h-10 rounded-md overflow-hidden shrink-0 bg-[#2F1F13] border border-[#E5D7C5] relative group/img shadow-2xs">
                                <img
                                  src={project.heroImage}
                                  alt={project.title}
                                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h4 className="font-heading font-bold text-sm sm:text-base text-[#2F1F13] group-hover:text-[#B5532F] transition-colors leading-tight">
                                  {project.title}
                                </h4>
                              </div>
                            </div>
                          </td>

                          {/* Category (Ant Design Tag) */}
                          <td className={densityPadding}>
                            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono text-[#524336] uppercase tracking-wider bg-[#FAF7F2] border border-[#E5D7C5]">
                              {project.category || 'Architecture'}
                            </span>
                          </td>

                          {/* Location */}
                          <td className={`${densityPadding} text-[#524336] font-mono text-xs`}>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-[#B5532F] shrink-0" />
                              <span className="truncate max-w-[150px]">{project.location}</span>
                            </div>
                          </td>

                          {/* Year & Area */}
                          <td className={`${densityPadding} text-xs font-mono text-[#524336]`}>
                            <span className="font-bold text-[#2F1F13]">{project.year}</span>
                            <span className="text-[#865430] block text-[11px]">{project.area || '—'}</span>
                          </td>

                          {/* Status toggle pill (Ant Design Badge Tag) */}
                          <td className={`${densityPadding} text-center`}>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(project.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                (project.status || 'Published') === 'Published'
                                  ? 'bg-[#EBF5E5] text-[#4A7C36] border border-[#CDE5C2] hover:bg-[#DEF0D6]'
                                  : 'bg-[#FFF4E5] text-[#B86B1B] border border-[#FFE0B2] hover:bg-[#FEE8CC]'
                              }`}
                              title="Click to toggle Published / Draft"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                (project.status || 'Published') === 'Published' ? 'bg-[#52C41A]' : 'bg-[#FAAD14]'
                              }`} />
                              <span>{project.status || 'Published'}</span>
                            </button>
                          </td>

                          {/* Actions (Three-Dots Dropdown Menu) */}
                          <td className={`${densityPadding} text-right relative`}>
                            <div className="relative inline-block text-left">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionRowId(openActionRowId === project.id ? null : project.id);
                                }}
                                className={`w-7 h-7 inline-flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                                  openActionRowId === project.id
                                    ? 'bg-[#B5532F] text-white border-[#B5532F] shadow-2xs'
                                    : 'text-[#865430] hover:text-[#B5532F] bg-white hover:bg-[#FAF7F2] border-[#E5D7C5]'
                                }`}
                                title="Actions"
                              >
                                <MoreVertical size={14} />
                              </button>

                              {openActionRowId === project.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className={`absolute right-0 z-40 w-44 bg-white rounded-xl shadow-xl border border-[#E5D7C5] py-1 text-xs font-mono text-[#2F1F13] divide-y divide-[#F5EFE6] ${
                                    index >= paginatedProjects.length - 2 && paginatedProjects.length >= 3
                                      ? 'bottom-full mb-1.5'
                                      : 'top-full mt-1.5'
                                  }`}
                                >
                                  <div className="py-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenActionRowId(null);
                                        setViewingProject(project);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAF7F2] hover:text-[#B5532F] transition-colors cursor-pointer text-left"
                                    >
                                      <Eye size={13} className="text-[#865430]" />
                                      <span>View</span>
                                    </button>
                                    <Link
                                      to={`/projects/${project.slug}`}
                                      target="_blank"
                                      onClick={() => setOpenActionRowId(null)}
                                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAF7F2] hover:text-[#B5532F] transition-colors"
                                    >
                                      <ExternalLink size={13} className="text-[#865430]" />
                                      <span>Preview</span>
                                    </Link>
                                    <Link
                                      to={`/admin/projects/edit/${project.id || project.slug}`}
                                      onClick={() => setOpenActionRowId(null)}
                                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAF7F2] hover:text-[#B5532F] transition-colors"
                                    >
                                      <Edit3 size={13} className="text-[#865430]" />
                                      <span>Edit</span>
                                    </Link>
                                  </div>
                                  <div className="py-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenActionRowId(null);
                                        setDeletingProject(project);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-medium"
                                    >
                                      <Trash2 size={13} />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Ant Design Pagination Footer */}
              <div className="p-3.5 sm:p-4 border-t border-[#E5D7C5] bg-[#FAF7F2]/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-[#524336]">
                <div className="flex items-center gap-2">
                  <span>Total <strong>{totalItems}</strong> entries</span>
                  {selectedRowKeys.length > 0 && (
                    <span className="text-[#B5532F]">• {selectedRowKeys.length} selected</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Page size changer */}
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none pl-2.5 pr-7 py-1 rounded-md bg-white border border-[#E5D7C5] text-xs font-mono text-[#2F1F13] focus:outline-none focus:ring-1 focus:ring-[#B5532F] cursor-pointer"
                    >
                      <option value={5}>5 / page</option>
                      <option value={10}>10 / page</option>
                      <option value={20}>20 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#865430] pointer-events-none" />
                  </div>

                  {/* Prev button */}
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-md bg-white border border-[#E5D7C5] flex items-center justify-center text-[#524336] hover:border-[#B5532F] hover:text-[#B5532F] disabled:opacity-40 disabled:hover:border-[#E5D7C5] disabled:hover:text-[#524336] disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {pageNumbers.map((p, idx) => (
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">•••</span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-md font-mono text-xs flex items-center justify-center transition-all cursor-pointer ${
                            currentPage === p
                              ? 'bg-[#B5532F] text-white font-bold border border-[#B5532F] shadow-2xs'
                              : 'bg-white border border-[#E5D7C5] text-[#524336] hover:border-[#B5532F] hover:text-[#B5532F]'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next button */}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="w-7 h-7 rounded-md bg-white border border-[#E5D7C5] flex items-center justify-center text-[#524336] hover:border-[#B5532F] hover:text-[#B5532F] disabled:opacity-40 disabled:hover:border-[#E5D7C5] disabled:hover:text-[#524336] disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>

                  {/* Quick Jump */}
                  <div className="flex items-center gap-1 text-[11px] text-[#865430] pl-1">
                    <span>Go to</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={quickJumpPage}
                      onChange={(e) => setQuickJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt(quickJumpPage);
                          if (val >= 1 && val <= totalPages) {
                            setCurrentPage(val);
                            setQuickJumpPage('');
                          }
                        }
                      }}
                      placeholder={currentPage}
                      className="w-10 px-1 py-1 rounded-md bg-white border border-[#E5D7C5] text-center text-xs font-mono text-[#2F1F13] focus:outline-none focus:ring-1 focus:ring-[#B5532F]"
                    />
                    <span>page</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



      {/* =========================================================================
          6. DELETE CONFIRMATION MODALS
          ========================================================================= */}
      <AnimatePresence>
        {/* Single project delete modal */}
        {deletingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-lenis-prevent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingProject(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              data-lenis-prevent
              className="relative w-full max-w-md bg-white rounded-2xl border border-[#E5D7C5] p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-[#2F1F13]">Delete Project?</h3>
                <p className="text-xs sm:text-sm text-[#524336] mt-1 leading-relaxed">
                  Are you sure you want to permanently delete <strong>"{deletingProject.title}"</strong>?
                  This action will remove it from the website portfolio and catalog.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeletingProject(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase tracking-wider text-[#524336] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-md cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Batch delete modal */}
        {batchDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-lenis-prevent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBatchDeleteConfirm(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              data-lenis-prevent
              className="relative w-full max-w-md bg-white rounded-2xl border border-[#E5D7C5] p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-[#2F1F13]">Delete {selectedRowKeys.length} Selected Projects?</h3>
                <p className="text-xs sm:text-sm text-[#524336] mt-1 leading-relaxed">
                  Are you sure you want to permanently delete all <strong>{selectedRowKeys.length}</strong> selected projects?
                  This action cannot be undone.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBatchDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase tracking-wider text-[#524336] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBatchDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-md cursor-pointer"
                >
                  Delete Selected ({selectedRowKeys.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Project View Modal */}
        {viewingProject && (
          <ProjectViewModal
            project={viewingProject}
            onClose={() => setViewingProject(null)}
          />
        )}
      </AnimatePresence>

      {/* =========================================================================
          7. FLOATING TOAST NOTIFICATION
          ========================================================================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#2F1F13] text-[#FAF7F2] px-4 py-3 rounded-2xl shadow-2xl border border-[#E5D7C5]/30 flex items-center gap-2.5 text-xs font-mono font-medium"
          >
            <CheckCircle2 size={16} className="text-[#7A8B69]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. DEDICATED ADMIN CONSOLE FOOTER */}
      <footer className="mt-16 border-t border-[#E5D7C5] bg-white/70 py-4 text-center text-xs font-mono text-[#865430]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} AuroYali Architecture • Studio Console</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-[#B5532F] transition-colors">Website Home</Link>
            <span>•</span>
            <Link to="/projects" target="_blank" className="hover:text-[#B5532F] transition-colors">Live Portfolio</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

// ============================================================================
// SUBCOMPONENT: PROJECT VIEW MODAL
// ============================================================================
function ProjectViewModal({ project, onClose }) {
  const [selectedImage, setSelectedImage] = useState(
    project.heroImage || project.gallery?.[0] || ''
  );

  useEffect(() => {
    setSelectedImage(project.heroImage || project.gallery?.[0] || '');
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const allImages = useMemo(() => {
    const set = new Set();
    if (project.heroImage) set.add(project.heroImage);
    if (Array.isArray(project.gallery)) {
      project.gallery.forEach((img) => img && set.add(img));
    }
    return Array.from(set);
  }, [project]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 select-none font-body" data-lenis-prevent>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-[#E5D7C5] shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* 1. Header */}
        <div className="p-4 sm:p-6 border-b border-[#E5D7C5] bg-[#FAF7F2] flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#FAF7F2] border border-[#E5D7C5] text-[#B5532F]">
                {project.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold border ${
                project.status === 'Published'
                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
              }`}>
                {project.status || 'Published'}
              </span>
              {project.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#B5532F]/10 text-[#B5532F] border border-[#B5532F]/20">
                  <Star size={10} className="fill-[#B5532F]" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-[#2F1F13] tracking-tight leading-snug truncate">
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="text-xs sm:text-sm text-[#524336] font-light truncate">
                {project.subtitle}
              </p>
            )}
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/projects/${project.slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#7A8B69] text-[#2F1F13] hover:text-[#7A8B69] text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-2xs"
              title="View on public site"
            >
              <ExternalLink size={13} className="text-[#7A8B69]" />
              <span>Live Site</span>
            </Link>

            <Link
              to={`/admin/projects/edit/${project.id || project.slug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-[#E5D7C5] bg-white text-[#524336] hover:text-[#B5532F] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">

          {/* Featured Visual Showcase */}
          {selectedImage && (
            <div className="space-y-3">
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-[#E5D7C5] bg-[#2F1F13]/5 shadow-xs">
                <img
                  src={selectedImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gallery Thumbnails Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#B5532F] scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#E5D7C5]'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Architectural Specifications Grid */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] shadow-2xs space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#865430] font-bold flex items-center gap-1.5">
              <Building size={14} className="text-[#B5532F]" />
              Architectural Specifications
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs text-[#2F1F13]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#865430] block">Site Location</span>
                <span className="font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-[#B5532F] shrink-0" />
                  <span className="truncate">{project.location || 'Auroville'}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#865430] block">Completion Year</span>
                <span className="font-mono font-semibold flex items-center gap-1 mt-0.5">
                  <Calendar size={12} className="text-[#865430] shrink-0" />
                  <span>{project.year || '2023'}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#865430] block">Built Scale / Area</span>
                <span className="font-semibold flex items-center gap-1 mt-0.5">
                  <Layers size={12} className="text-[#865430] shrink-0" />
                  <span>{project.area || 'N/A'}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#865430] block">Construction Timeline</span>
                <span className="font-mono text-[#524336] flex items-center gap-1 mt-0.5">
                  <Clock size={12} className="text-[#865430] shrink-0" />
                  <span>{project.timeTaken || 'N/A'}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#865430] block">Architectural Design</span>
                <span className="font-semibold text-[#2F1F13] truncate block mt-0.5">
                  {project.architect || 'AuroYali Studio'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#865430] block">Construction Execution</span>
                <span className="font-semibold text-[#2F1F13] truncate block mt-0.5">
                  {project.construction || 'AuroYali'}
                </span>
              </div>

              {project.client && (
                <div className="col-span-2 sm:col-span-3 pt-2 border-t border-[#E5D7C5]/60 flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-[#865430]">Client / Patrons:</span>
                  <span className="font-semibold text-[#2F1F13]">{project.client}</span>
                </div>
              )}
            </div>
          </div>

          {/* Architectural Narrative ("About") */}
          {project.about && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#865430] font-bold block">
                Architectural Narrative & Design Concept
              </span>
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] leading-relaxed whitespace-pre-line font-light shadow-2xs">
                {project.about}
              </div>
            </div>
          )}

          {/* Materiality Palette */}
          {Array.isArray(project.materials) && project.materials.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#865430] font-bold block">
                Craftsmanship & Material Palette
              </span>
              <div className="flex flex-wrap gap-2">
                {project.materials.map((mat, mIdx) => (
                  <span
                    key={mIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono text-[#524336] font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5532F]" />
                    <span>{mat}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 3. Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E5D7C5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#865430]">
            <span>Project Slug: <strong className="text-[#2F1F13]">{project.slug}</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to={`/admin/projects/edit/${project.id || project.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Edit Project</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#2F1F13] hover:bg-[#1B140E] text-white text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default AdminProjects;
