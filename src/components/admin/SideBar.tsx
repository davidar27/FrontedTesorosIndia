import React from 'react';

import logo from '@/assets/icons/logotesorosindiaPequeño.webp';
import Picture from '@/components/ui/display/Picture';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import UserMenu from '../layouts/menu/UserMenu';

export interface SidebarItem {
    id: string;
    label: string;
    icon: LucideIcon;
    path: string;
    active?: boolean;
}

const Sidebar: React.FC<{
    items: SidebarItem[];
    showMobileMenu: boolean;
    onItemClick: (itemId: string) => void;
    onMobileMenuClose: () => void;

}> = React.memo(({ items, showMobileMenu, onItemClick, onMobileMenuClose }) => {
    const navigate = useNavigate();


    return (
        <>
            <aside className={`bg-white border-r border-gray-200 transition-all duration-300 shadow-lg
                ${showMobileMenu ? 'fixed left-0 top-0 translate-x-0 overflow-y-auto' : 'fixed left-0 top-0 -translate-x-full'}
                lg:translate-x-0 lg:relative lg:left-auto lg:top-auto
                z-30 w-64 h-screen`}>
                <div className="p-6 border-b border-gray-200  ">
                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 animate-fade-in-right cursor-pointer hover:bg-gray-50 transition-all duration-200 ">
                        
                        <Picture
                            src={logo}
                            alt="Logo"
                            className="w-10 h-10 object-center object-contain"
                        />
                        <div>
                            <h1 className="font-bold text-gray-800 text-md lg:text-xl">Tesoros de la India</h1>
                            <p className="text-sm text-gray-500 ">Gestión del Sistema</p>
                        </div>

                    </div>
                </div>

                <nav className="p-4">
                    <span className='sm:hidden'>
                        <UserMenu
                            textColor='!black'
                        />
                    </span>
                    <ul className="space-y-2">
                        {items.map((item, index) => (
                            <li
                                key={item.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <button
                                    onClick={() => {
                                        if (item.id === 'home') {
                                            navigate('/');
                                        } else {
                                            onItemClick(item.id);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${item.active
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Mobile menu overlay */}
            {showMobileMenu && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={onMobileMenuClose}
                />
            )}
        </>
    );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;


