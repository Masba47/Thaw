import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { 
  Droplets, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Users, 
  Search, 
  RotateCcw, 
  ChevronDown,
  Check
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    language,
    setLanguage,
    t,
    activeTab, 
    setActiveTab, 
    currentBlock, 
    openVerifyModal,
    resetToDemo,
    setSelectedCommitmentId
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const rolesConfig: Record<Role, {
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    permissions: string[];
  }> = {
    project_owner: {
      label: t.role_project_owner,
      sublabel: t.role_project_owner_sub,
      icon: <Building2 className="w-3.5 h-3.5 text-sky-600" />,
      permissions: t.perm_owner,
    },
    reviewer: {
      label: t.role_reviewer,
      sublabel: t.role_reviewer_sub,
      icon: <UserCheck className="w-3.5 h-3.5 text-cyan-600" />,
      permissions: t.perm_reviewer,
    },
    regulator: {
      label: t.role_regulator,
      sublabel: t.role_regulator_sub,
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
      permissions: t.perm_regulator,
    },
    community: {
      label: t.role_community,
      sublabel: t.role_community_sub,
      icon: <Users className="w-3.5 h-3.5 text-teal-600" />,
      permissions: t.perm_community,
    },
  };

  const currentRoleConfig = rolesConfig[role];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-sky-100/60 transition-colors">
      {/* Telemetry Strip: Minimal, unboxed, quiet Alpine atmosphere */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-interface border-b border-slate-100/60">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-sky-800 font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </span>
            {t.subnetTitle}
          </span>
          <span className="text-slate-200">/</span>
          <span className="font-mono text-slate-500">
            {t.block} #{currentBlock.toLocaleString()}
          </span>
          <span className="text-slate-200 hidden sm:inline">/</span>
          <span className="text-slate-400 hidden sm:inline">
            {t.finalityNotice}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle: Clean text pairing */}
          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setLanguage('es')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'es'
                  ? 'text-sky-900 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              ES
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'en'
                  ? 'text-sky-900 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              EN
            </button>
          </div>

          <span className="text-slate-200">·</span>

          <button
            onClick={resetToDemo}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-700 transition-colors"
            title="Reset data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.resetDemo}</span>
          </button>
        </div>
      </div>

      {/* Main Bar: Pure text tabs, Hark-inspired serif brand, Notion-style role selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand: Delicate editorial serif inspired by Hark */}
        <div 
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedCommitmentId(null);
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 transition-transform group-hover:scale-105">
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl tracking-tight text-slate-900 group-hover:text-sky-900 transition-colors">
                Thaw
              </span>
              <span className="font-interface text-[10px] tracking-widest uppercase text-slate-400 font-medium">
                Avalanche
              </span>
            </div>
          </div>
        </div>

        {/* Pure Text Navigation Tabs (User Answer: Cabecera fija sin bordes con pestanas de texto puro) */}
        <nav className="flex items-center gap-6 sm:gap-8 h-full">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedCommitmentId(null);
            }}
            className={`relative py-2 text-sm font-interface transition-colors ${
              activeTab === 'dashboard'
                ? 'text-slate-950 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{t.tabDashboard}</span>
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-600 rounded-full animate-in fade-in duration-200"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('ledger');
              setSelectedCommitmentId(null);
            }}
            className={`relative py-2 text-sm font-interface transition-colors ${
              activeTab === 'ledger'
                ? 'text-slate-950 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{t.tabLedger}</span>
            {activeTab === 'ledger' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-600 rounded-full animate-in fade-in duration-200"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('community');
              setSelectedCommitmentId(null);
            }}
            className={`relative py-2 text-sm font-interface transition-colors ${
              activeTab === 'community'
                ? 'text-slate-950 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{t.tabCommunity}</span>
            {activeTab === 'community' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-600 rounded-full animate-in fade-in duration-200"></span>
            )}
          </button>
        </nav>

        {/* Right Section: Quick Verify & Notion-like Role Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openVerifyModal(null)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-sky-800 hover:bg-sky-50/60 rounded-md transition-colors"
            title="Verify evidence hash"
          >
            <Search className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-interface font-medium">{t.verifyEvidenceBtn}</span>
          </button>

          {/* Role Dropdown: Styled like Notion property picker */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100/70 text-xs font-interface text-slate-700 transition-colors"
            >
              <div className="p-0.5">{currentRoleConfig.icon}</div>
              <span className="font-medium hidden sm:inline">{currentRoleConfig.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200/80 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseLeave={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.switchRole}
                </div>

                <div className="space-y-0.5">
                  {(Object.keys(rolesConfig) as Role[]).map((rKey) => {
                    const cfg = rolesConfig[rKey];
                    const isSelected = role === rKey;
                    return (
                      <button
                        key={rKey}
                        onClick={() => {
                          setRole(rKey);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                          isSelected 
                            ? 'bg-sky-50/80 text-sky-950 font-medium' 
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {cfg.icon}
                          <div>
                            <div className="leading-tight">{cfg.label}</div>
                            <div className="text-[10px] text-slate-400">{cfg.sublabel}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-slate-100 px-2.5 py-1 text-[11px] text-slate-400">
                  <div className="font-medium text-slate-600 mb-0.5">{t.roleActions} {currentRoleConfig.label}:</div>
                  <ul className="space-y-0.5 list-disc list-inside text-slate-500 text-[10px]">
                    {currentRoleConfig.permissions.slice(0, 2).map((perm, idx) => (
                      <li key={idx} className="truncate">{perm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
