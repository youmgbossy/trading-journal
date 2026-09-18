import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  TrendingUp, 
  BarChart3,
  Play,
  Calculator,
  Plus,
  Upload,
  LogOut,
  User,
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { APP_NAME, APP_LOGO_SRC } from '@/lib/constants';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onAddTrade: () => void;
  onImportTrades: () => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trades', label: 'Trades', icon: TrendingUp },
  { id: 'daily-journal', label: 'Daily Journal', icon: BookOpen },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'playbooks', label: 'Playbooks', icon: Play },
  { id: 'tools', label: 'Tools', icon: Calculator },
];

interface SidebarContentProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onAddTrade: () => void;
  onImportTrades: () => void;
  compact?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  currentPage,
  onPageChange,
  onAddTrade,
  onImportTrades,
  compact = false,
}) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className={cn('border-b border-slate-700', compact ? 'p-3 pt-12' : 'p-4')}>
        <img
          src={APP_LOGO_SRC}
          alt="Young Bossy Trades"
          className={cn(
            'rounded-xl object-cover mx-auto',
            compact ? 'h-14 w-14' : 'w-full max-h-40'
          )}
        />
        <p className="mt-2 text-center text-xs font-bold tracking-widest text-slate-200">
          {APP_NAME}
        </p>
      </div>

      <div className="p-4 space-y-2">
        <button 
          type="button"
          onClick={onAddTrade}
          className="w-full bg-custom-purple hover:bg-custom-purple/90 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Trade</span>
        </button>
        
        <button 
          type="button"
          onClick={onImportTrades}
          className="w-full bg-custom-blue hover:bg-custom-blue/90 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span className="font-medium">Import Trades</span>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                currentPage === item.id
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
            <AvatarFallback className="bg-purple-600">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPageChange('settings')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  onAddTrade,
  onImportTrades,
  mobileOpen = false,
  onMobileOpenChange,
}) => {
  const closeMobile = () => onMobileOpenChange?.(false);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    closeMobile();
  };

  const handleAddTrade = () => {
    onAddTrade();
    closeMobile();
  };

  const handleImportTrades = () => {
    onImportTrades();
    closeMobile();
  };

  useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobile();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen, onMobileOpenChange]);

  return (
    <>
      <aside className="hidden md:flex w-64 bg-slate-900 text-white h-screen flex-col shrink-0">
        <SidebarContent
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onAddTrade={handleAddTrade}
          onImportTrades={handleImportTrades}
        />
      </aside>

      {mobileOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div
            onClick={closeMobile}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 'min(288px, 85vw)',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              zIndex: 9998,
            }}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="bg-slate-900 text-white shadow-2xl"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 'min(288px, 85vw)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              pointerEvents: 'auto',
            }}
          >
            <button
              type="button"
              onClick={closeMobile}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent
              compact
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onAddTrade={handleAddTrade}
              onImportTrades={handleImportTrades}
            />
          </aside>
        </>,
        document.body
      )}
    </>
  );
};

export default Sidebar;
