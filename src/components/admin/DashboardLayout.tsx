import React from 'react';
import Sidebar from "./SideBar";
import useSidebarLogic from "@/hooks/useSidebarLogic";
import { Outlet } from "react-router-dom";
import { Filter } from "lucide-react";
import { usePageContext } from '@/context/PageContext';
import AnimatedTitle from '@/components/ui/display/AnimatedTitle';
import UserMenu from '@/components/layouts/menu/UserMenu';

const DashboardLayout: React.FC = () => {
    const {
        sidebarItems,
        showMobileMenu,
        handleSidebarItemClick,
        handleMobileMenuToggle,
        handleMobileMenuClose
    } = useSidebarLogic();

    const { pageInfo } = usePageContext();

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-30">
            <div className="flex h-screen">
                {/* Sidebar persistente */}
                <Sidebar
                    items={sidebarItems}
                    showMobileMenu={showMobileMenu}
                    onItemClick={handleSidebarItemClick}
                    onMobileMenuClose={handleMobileMenuClose}
                />

                {/* Contenido principal que cambia con las rutas */}
                <main className="flex-1 flex flex-col min-h-0">
                    {/* Header fijo para todas las páginas */}
                    <header className="backdrop-blur-sm border-b border-gray-200/50  top-0 z-10 shadow-sm">
                        <div className=" flex flex-col md:flex-row    md:items-center responsive-padding-x py-0 md:py-4">
                            {/* Información de la página actual */}
                            {pageInfo && (
                                <>
                                    <div className='flex items-center gap-2 justify-between'>
                                        <button
                                            onClick={handleMobileMenuToggle}
                                            className="lg:hidden p-2"
                                            aria-label="Abrir menú de navegación"
                                        >
                                            <Filter className="w-8 h-8" />
                                        </button>
                                        <span className='sm:hidden'>
                                            <UserMenu
                                                textColor='!black'
                                            />
                                        </span>
                                    </div>
                                    <div className='flex items-center justify-between w-full'>
                                        <div className="animate-fade-in-up text-center md:text-left">
                                            <AnimatedTitle
                                                title={pageInfo.title}
                                                align='left'
                                                size='xl'

                                            />
                                            <p className="text-xs md:text-xl text-gray-600">
                                                {pageInfo.description}
                                            </p>

                                        </div>
                                        <span className='hidden sm:block'>
                                            <UserMenu
                                                textColor='!black'
                                            />
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </header>
                    {/* Aquí se renderizan las páginas específicas */}
                    <div className="responsive-padding-x flex-1 min-h-0 overflow-auto responsive-padding-y">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;