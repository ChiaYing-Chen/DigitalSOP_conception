import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    if (location.pathname === '/') return '數位流程總覽';
    if (location.pathname.startsWith('/calendar')) return '行事曆排程';
    if (location.pathname.startsWith('/editor')) return '流程編輯器';
    if (location.pathname.startsWith('/run')) return '執行 SOP';
    if (location.pathname.startsWith('/history')) return '執行歷史紀錄';
    if (location.pathname.startsWith('/versions')) return '版次與分類管理';
    return '數位流程指引系統';
  };

  const navItems = [
    { path: '/', label: '數位流程總覽', icon: Icons.Dashboard },
    { path: '/calendar', label: '行事曆', icon: Icons.Calendar },
    { path: '/history', label: '執行紀錄', icon: Icons.History },
    { path: '/versions', label: '版次管理', icon: Icons.GitBranch },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-none bg-[#111827] border-r border-slate-700 flex flex-col z-20 shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-[#1a202c]">
          <div className="flex items-center gap-3 text-blue-500">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <Icons.Flow />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">數位流程指引系統</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
          
          <div className="pt-4 border-t border-slate-800 pb-2 mt-4">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">最近使用</p>
          </div>
          <div className="px-3 py-2 text-sm text-slate-400 hover:text-white cursor-pointer flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
             發票審核流程 v1.3
          </div>
          <div className="px-3 py-2 text-sm text-slate-400 hover:text-white cursor-pointer flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
             新進員工報到 v2.1
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700 bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-800">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-slate-500 truncate">Process Manager</p>
            </div>
            <button className="text-slate-400 hover:text-white">
              <Icons.Settings />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#111827]/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icons.Search />
                </span>
                <input 
                  type="text" 
                  placeholder="搜尋流程..." 
                  className="bg-slate-800 border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 transition-all"
                />
             </div>
             <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors relative">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-auto bg-[#0f172a] scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};