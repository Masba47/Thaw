/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ProjectDashboard } from './components/ProjectDashboard';
import { LedgerView } from './components/LedgerView';
import { CommunityView } from './components/CommunityView';
import { CommitmentDetailModal } from './components/CommitmentDetailModal';
import { EvidenceUploadModal } from './components/EvidenceUploadModal';
import { Droplets, Shield, Cpu } from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    activeTab, 
    selectedCommitmentId, 
    setSelectedCommitmentId, 
    isUploadModalOpen,
    isVerifyModalOpen,
    setIsVerifyModalOpen,
    setActiveTab,
    language,
    t
  } = useApp();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-interface selection:bg-sky-100 selection:text-sky-950">
      {/* Top Header & Role Switcher */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <ProjectDashboard />}
        {activeTab === 'ledger' && <LedgerView />}
        {activeTab === 'community' && <CommunityView />}
      </main>

      {/* Footer with subtle ice-melting aesthetic */}
      <footer className="mt-auto border-t border-sky-100 bg-white/80 backdrop-blur-xs py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">Thaw</span>
            <span>• {language === 'es' ? 'Trazabilidad y Cumplimiento Socioambiental en Avalanche' : 'Transparent Socio-Environmental Compliance on Avalanche'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.subnetTitle} #431140</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'es' ? 'Notarización SHA-256 en Navegador' : 'Client-Side SHA-256 Notarization'}</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modal Overlays */}
      {selectedCommitmentId && (
        <CommitmentDetailModal
          commitmentId={selectedCommitmentId}
          onClose={() => setSelectedCommitmentId(null)}
        />
      )}

      {isUploadModalOpen && <EvidenceUploadModal />}

      {/* When verify modal is requested globally, direct to ledger view */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl border border-sky-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'es' ? 'Abriendo Estación de Verificación' : 'Opening Cryptographic Verifier'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'es' 
                  ? 'Redirigiendo a la estación del registro donde puede arrastrar o cargar cualquier documento para recalcular su huella SHA-256.' 
                  : 'Navigating to the on-chain ledger verification station where you can drag-and-drop any document to re-calculate its SHA-256 fingerprint.'}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVerifyModalOpen(false);
                setActiveTab('ledger');
              }}
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              {language === 'es' ? 'Continuar al Verificador' : 'Continue to Ledger Verifier'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
