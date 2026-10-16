import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CommitmentCategory, CommitmentStatus } from '../types';
import { getDeadlineInfo } from '../utils/crypto';
import { 
  FileText, 
  Upload, 
  Search, 
  ShieldAlert, 
  MapPin, 
  Building2, 
  Scale,
  Mountain,
  Droplets,
  Wind,
  Trees,
  Users,
  Briefcase,
  Layers,
  Table as TableIcon,
  List as ListIcon,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ProjectDashboard: React.FC = () => {
  const { 
    project, 
    commitments, 
    evidenceList, 
    disputes, 
    role, 
    language,
    t,
    setSelectedCommitmentId, 
    openUploadModalForCommitment,
    setActiveTab
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CommitmentStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CommitmentCategory>('all');

  // Category Icon & Label
  const getCategoryDetails = (cat: CommitmentCategory) => {
    switch (cat) {
      case 'water':
        return { icon: <Droplets className="w-3.5 h-3.5 text-sky-600" />, label: t.cat_water };
      case 'air':
        return { icon: <Wind className="w-3.5 h-3.5 text-cyan-600" />, label: t.cat_air };
      case 'biodiversity':
        return { icon: <Trees className="w-3.5 h-3.5 text-emerald-600" />, label: t.cat_biodiversity };
      case 'tailings':
        return { icon: <Mountain className="w-3.5 h-3.5 text-amber-600" />, label: t.cat_tailings };
      case 'community':
        return { icon: <Users className="w-3.5 h-3.5 text-indigo-600" />, label: t.cat_community };
      case 'labor':
        return { icon: <Briefcase className="w-3.5 h-3.5 text-purple-600" />, label: t.cat_labor };
      default:
        return { icon: <Layers className="w-3.5 h-3.5 text-slate-500" />, label: cat };
    }
  };

  // Status Indicator: Subtle Notion dot + unboxed text (Zero-pill discipline)
  const renderStatus = (status: CommitmentStatus) => {
    switch (status) {
      case 'validated':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-interface">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{t.status_validated}</span>
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-sky-700 font-interface">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span>{t.status_submitted}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-interface">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>{t.status_pending}</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 font-medium font-interface">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>{t.status_overdue}</span>
          </span>
        );
    }
  };

  // Stats calculation
  const totalCommitments = commitments.length;
  const validatedCount = commitments.filter(c => c.status === 'validated').length;
  const submittedCount = commitments.filter(c => c.status === 'submitted').length;
  const pendingCount = commitments.filter(c => c.status === 'pending').length;
  const overdueCount = commitments.filter(c => c.status === 'overdue').length;
  const compliancePercentage = Math.round((validatedCount / totalCommitments) * 100);

  // Filtered commitments
  const filteredCommitments = useMemo(() => {
    return commitments.filter(c => {
      const matchesSearch = 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clauseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [commitments, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-8 font-interface">
      {/* Notion Workspace Page Header: Clean Alpine Cover & Editorial Typography */}
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-50/50 via-white to-white border border-sky-100/70 p-6 sm:p-8 space-y-6">
        {/* Subtle ice water reflection glow in top right */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-sky-200/25 via-cyan-100/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        {/* Page Title & Biome icon */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-sky-600 font-medium">🏔️ {project.biome}</span>
            <span>·</span>
            <span>{t.permitApproved}: {project.approvedDate}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            {project.name}
          </h1>

          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-light">
            {project.description}
          </p>
        </div>

        {/* Notion-Style Properties Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-6 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-start gap-2">
            <Scale className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 text-[11px]">{t.legalCitation}</div>
              <div className="font-medium text-slate-800 font-mono">{project.permitNumber}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 text-[11px]">{t.operator}</div>
              <div className="font-medium text-slate-800">{project.operator}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 text-[11px]">{language === 'es' ? 'Ubicación' : 'Location'}</div>
              <div className="font-medium text-slate-800 truncate max-w-[200px]" title={project.location}>
                {project.location}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 text-[11px]">{language === 'es' ? 'Autoridad Fiscalizadora' : 'Regulatory Body'}</div>
              <div className="font-medium text-slate-800">{project.regulatoryBody}</div>
            </div>
          </div>
        </div>

        {/* Notion Linear Compliance Gauge */}
        <div className="pt-2 border-t border-slate-100/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">{t.complianceRating}:</span>
              <span className="font-editorial text-lg text-slate-900">{compliancePercentage}%</span>
              <span className="text-slate-400">({validatedCount} / {totalCommitments} {language === 'es' ? 'cumplidos' : 'validated'})</span>
            </div>
            {overdueCount > 0 ? (
              <span className="text-rose-600 text-[11px] font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {overdueCount} {language === 'es' ? 'compromiso vencido con observaciones' : 'overdue item requiring remediation'}
              </span>
            ) : (
              <span className="text-emerald-600 text-[11px] font-medium">{t.inGoodStanding}</span>
            )}
          </div>

          {/* Minimal 3px Progress Line */}
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden flex">
            <div style={{ width: `${(validatedCount / totalCommitments) * 100}%` }} className="bg-emerald-500 h-full" />
            <div style={{ width: `${(submittedCount / totalCommitments) * 100}%` }} className="bg-sky-400 h-full" />
            <div style={{ width: `${(pendingCount / totalCommitments) * 100}%` }} className="bg-amber-400 h-full" />
            <div style={{ width: `${(overdueCount / totalCommitments) * 100}%` }} className="bg-rose-500 h-full" />
          </div>
        </div>
      </div>

      {/* Notion Database Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Left: View Switcher (Table / List) and Search */}
        <div className="flex items-center gap-3">
          {/* Notion View Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100/80 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-medium'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Tabla' : 'Table'}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs font-medium'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Lista' : 'List'}</span>
            </button>
          </div>

          {/* Minimal Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'es' ? 'Filtrar compromisos...' : 'Filter commitments...'}
              className="pl-8 pr-3 py-1 text-xs bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white border border-slate-200/70 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 w-44 sm:w-56 transition-all"
            />
          </div>
        </div>

        {/* Right: Category/Status Filters & Primary Action */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs py-1 px-2.5 bg-white border border-slate-200/80 rounded-md text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">{language === 'es' ? 'Todos los estados' : 'All statuses'}</option>
            <option value="validated">{t.status_validated}</option>
            <option value="submitted">{t.status_submitted}</option>
            <option value="pending">{t.status_pending}</option>
            <option value="overdue">{t.status_overdue}</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs py-1 px-2.5 bg-white border border-slate-200/80 rounded-md text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">{t.cat_all}</option>
            <option value="water">{t.cat_water}</option>
            <option value="air">{t.cat_air}</option>
            <option value="biodiversity">{t.cat_biodiversity}</option>
            <option value="tailings">{t.cat_tailings}</option>
            <option value="community">{t.cat_community}</option>
            <option value="labor">{t.cat_labor}</option>
          </select>

          {role === 'project_owner' && (
            <button
              onClick={() => openUploadModalForCommitment()}
              className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-md shadow-2xs transition-colors shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.notarizeEvidence}</span>
            </button>
          )}

          {role === 'community' && (
            <button
              onClick={() => setActiveTab('community')}
              className="flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-md shadow-2xs transition-colors shrink-0"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.submitDispute}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notion Database View (Table or List) */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
        {filteredCommitments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <p>{t.noCommitmentsFound}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="text-sky-600 hover:underline"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLA NOTION (High-Density Spreadsheet-like Database Table) */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50/60 text-slate-400 font-normal uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-4 font-medium w-24">Cláusula</th>
                  <th className="py-2.5 px-4 font-medium min-w-[280px]">Compromiso Socioambiental</th>
                  <th className="py-2.5 px-4 font-medium">Categoría</th>
                  <th className="py-2.5 px-4 font-medium">Responsable</th>
                  <th className="py-2.5 px-4 font-medium">Plazo</th>
                  <th className="py-2.5 px-4 font-medium">Estado</th>
                  <th className="py-2.5 px-4 font-medium text-right">Pruebas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCommitments.map((comm) => {
                  const deadline = getDeadlineInfo(comm.deadline, language);
                  const commEvidence = evidenceList.filter(e => e.commitmentId === comm.id);
                  const cat = getCategoryDetails(comm.category);
                  const commDisputes = disputes.filter(d => d.commitmentId === comm.id && d.status !== 'dismissed');

                  return (
                    <tr
                      key={comm.id}
                      onClick={() => setSelectedCommitmentId(comm.id)}
                      className="hover:bg-sky-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Clause ID */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        <span className="group-hover:text-sky-700 transition-colors font-medium">
                          {comm.clauseId}
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0" />
                          <span className="font-medium text-slate-900 group-hover:text-sky-950 transition-colors line-clamp-1">
                            {comm.title}
                          </span>
                          {commDisputes.length > 0 && (
                            <span className="text-[10px] text-rose-600 font-medium shrink-0 flex items-center gap-0.5">
                              ⚠️ {commDisputes.length}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {cat.icon}
                          <span className="text-xs">{cat.label}</span>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap max-w-[160px] truncate" title={comm.owner}>
                        {comm.owner}
                      </td>

                      {/* Deadline */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        <div className="text-xs">{comm.deadline}</div>
                        <div className={`text-[10px] ${deadline.isOverdue ? 'text-rose-600 font-medium' : 'text-slate-400'}`}>
                          {deadline.label}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatus(comm.status)}
                      </td>

                      {/* Evidence Count */}
                      <td className="py-3 px-4 text-right font-mono text-slate-500 text-xs whitespace-nowrap">
                        <span className="group-hover:text-sky-600 font-medium">
                          {commEvidence.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* LISTA NOTION (Clean, Uncluttered Editorial List View) */
          <div className="divide-y divide-slate-100">
            {filteredCommitments.map((comm) => {
              const deadline = getDeadlineInfo(comm.deadline, language);
              const commEvidence = evidenceList.filter(e => e.commitmentId === comm.id);
              const cat = getCategoryDetails(comm.category);
              const commDisputes = disputes.filter(d => d.commitmentId === comm.id && d.status !== 'dismissed');

              return (
                <div
                  key={comm.id}
                  onClick={() => setSelectedCommitmentId(comm.id)}
                  className="py-3.5 px-4 sm:px-6 hover:bg-sky-50/40 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0" />
                    <span className="font-mono text-xs text-slate-400 font-medium shrink-0">
                      {comm.clauseId}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-medium text-slate-900 group-hover:text-sky-950 truncate">
                      {comm.title}
                    </span>
                    {commDisputes.length > 0 && (
                      <span className="text-rose-600 text-xs font-medium shrink-0 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {commDisputes.length}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0 pl-7 sm:pl-0">
                    <div className="flex items-center gap-1">
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>

                    <span className="text-slate-200">·</span>

                    <span className="text-[11px] text-slate-400">
                      {commEvidence.length} {language === 'es' ? 'pruebas' : 'proofs'}
                    </span>

                    <span className="text-slate-200">·</span>

                    <div>{renderStatus(comm.status)}</div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Database Footer */}
        <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{filteredCommitments.length} {language === 'es' ? 'registros en total' : 'records total'}</span>
          <span className="hidden sm:inline">{language === 'es' ? 'Haga clic en una fila para abrir la página del compromiso' : 'Click any row to open commitment detail page'}</span>
        </div>
      </div>
    </div>
  );
};
