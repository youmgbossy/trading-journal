import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { APP_NAME, APP_LOGO_SRC } from '../lib/constants';
import DashboardV2 from '../components/Dashboard_v2';
import AddTrade from '../components/AddTrade';
import TradeLog from '../components/TradeLog';
import { DailyJournalRedesign } from '../components/journal/daily-journal/DailyJournalRedesign';
import Playbooks from '../components/Playbooks';
import ReportsPage from './ReportsPage';
import Tools from '../components/Tools';
import ImportTrades from '../components/ImportTrades';
import TradeDetailsPage from './TradeDetailsPage';
import SettingsPage from './SettingsPage';
import TradeReviewSystem from '../components/TradeReviewSystem';
import navigationContextService from '../lib/navigationContextService';

const Index: React.FC = () => {
  const { tradeId } = useParams<{ tradeId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [showImportTrades, setShowImportTrades] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle URL changes for special pages
  useEffect(() => {
    if (tradeId) {
      // Check if this is a trade review route
      if (location.pathname.includes('/trade/')) {
        setCurrentPage('trade-review');
        // Don't override navigation context - let it persist from the source
      } else {
        setCurrentPage('trade-details');
      }
      setShowAddTrade(false);
      setShowImportTrades(false);
    } else if (location.pathname === '/settings') {
      setCurrentPage('settings');
      setShowAddTrade(false);
      setShowImportTrades(false);
    } else if (location.pathname === '/') {
      // Check if we have navigation state for specific page
      const navigationState = location.state as { page?: string } | null;
      
      if (navigationState?.page) {
        setCurrentPage(navigationState.page);
      } else {
        // Reset to dashboard when on home page
        setCurrentPage('dashboard');
      }
      setShowAddTrade(false);
      setShowImportTrades(false);
    }
  }, [tradeId, location.pathname, location.state, location.search]);

  const handlePageChange = (page: string) => {
    setSidebarOpen(false);

    // Handle URL navigation for special pages
    if (page === 'settings') {
      navigate('/settings');
      return;
    }
    
    // For all other pages, navigate to clean root URL if coming from settings
    if (location.pathname === '/settings') {
      navigate('/');
    }
    
    setCurrentPage(page);
    setShowAddTrade(false);
    setShowImportTrades(false);
  };

  const handleAddTrade = () => {
    setShowAddTrade(true);
    setShowImportTrades(false);
  };

  const handleImportTrades = () => {
    setShowImportTrades(true);
    setShowAddTrade(false);
  };

  const handleCloseAddTrade = () => {
    setShowAddTrade(false);
    setCurrentPage('trades');
  };

  const handleCloseImportTrades = () => {
    setShowImportTrades(false);
    setCurrentPage('trades');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardV2 />;
      case 'trades':
        return <TradeLog />;
      case 'daily-journal':
        return <DailyJournalRedesign />;
      case 'reports':
        return <ReportsPage />;
      case 'playbooks':
        return <Playbooks />;
      case 'tools':
        return <Tools />;
      case 'trade-details':
        return tradeId ? <TradeDetailsPage isEmbedded={true} /> : <TradeLog />;
      case 'trade-review':
        return tradeId ? (
          <TradeReviewSystem 
            tradeId={tradeId}
            initialMode={getTradeReviewMode()}
            onNavigateBack={handleTradeReviewBack}
            embedded={true}
          />
        ) : <TradeLog />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardV2 />;
    }
  };

  // Helper function to determine trade review mode from URL
  const getTradeReviewMode = () => {
    if (location.pathname.includes('/review')) {
      return 'review';
    } else if (location.pathname.includes('/edit')) {
      return 'edit';
    }
    return 'view';
  };

  // Handle navigation back from trade review
  const handleTradeReviewBack = () => {
    if (tradeId) {
      const context = navigationContextService.getContext();
      if (context) {
        // Navigate back to the source based on navigation context
        switch (context.source as any) {
          case 'dashboard':
            navigate('/', { state: { page: 'dashboard' } });
            break;
          case 'calendar':
            // Calendar is part of dashboard, navigate back to dashboard
            navigate('/', { state: { page: 'dashboard' } });
            break;
          case 'trade-list':
          case 'trades':
            navigate('/', { state: { page: 'trades' } });
            break;
          case 'search':
            navigate('/', { state: { page: 'trades' } }); // Search results are in trades page
            break;
          case 'analytics':
            navigate('/', { state: { page: 'reports' } });
            break;
          default:
            navigate('/', { state: { page: 'dashboard' } });
        }
      } else {
        // Fallback to dashboard if no context
        navigate('/', { state: { page: 'dashboard' } });
      }
    }
  };

  return (
    <div className="flex h-[100dvh] bg-gray-100 overflow-hidden">
      <Sidebar 
        currentPage={showAddTrade ? 'add-trade' : showImportTrades ? 'import-trades' : (currentPage === 'trade-review' ? 'trades' : currentPage)} 
        onPageChange={handlePageChange}
        onAddTrade={handleAddTrade}
        onImportTrades={handleImportTrades}
        mobileOpen={sidebarOpen}
        onMobileOpenChange={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 bg-slate-900 text-white px-3 py-2.5 shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-lg hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src={APP_LOGO_SRC}
            alt=""
            className="h-8 w-8 rounded-md object-cover shrink-0"
          />
          <span className="text-xs font-bold tracking-wide truncate">{APP_NAME}</span>
        </header>
        <main className={`flex-1 min-w-0 overflow-x-hidden overflow-y-auto ${currentPage === 'trade-review' ? 'bg-gray-50 p-0' : 'bg-gray-100 p-3 sm:p-4 md:p-6'}`}>
          {renderCurrentPage()}
        </main>
      </div>
      
      {/* Modal Overlays */}
      {showAddTrade && (
        <AddTrade onClose={handleCloseAddTrade} />
      )}
      
      {showImportTrades && (
        <ImportTrades onClose={handleCloseImportTrades} />
      )}
    </div>
  );
};

export default Index;
