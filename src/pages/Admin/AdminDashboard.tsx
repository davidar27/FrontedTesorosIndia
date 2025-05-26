import React, { useState } from 'react';
import { defaultSidebarItems } from '@/components/admin/GenericManagent';
import FarmsManagement from '@/components/admin/farms/FarmSection';
import EntrepreneursManagement from '@/components/admin/entrepreneurs/EntrepreneursManagement';
import PackagesManagement from '@/components/admin/packages/PackagesManagement';
import CategoriesManagement from '@/components/admin/categories/CategoriesManagement';

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('emprendedores');

  const renderSection = () => {
    switch (activeSection) {
      case 'fincas':
        return <FarmsManagement />;
      case 'emprendedores':
        return <EntrepreneursManagement />;
      case 'paquetes':
        return <PackagesManagement />;
      case 'categorias':
        return <CategoriesManagement />;
      default:
        return <FarmsManagement />;
    }
  };

  // Actualizar sidebar items con el activo
  const sidebarItems = defaultSidebarItems.map(item => ({
    ...item,
    active: item.id === activeSection
  }));

  return (
    <div>
      {React.cloneElement(renderSection(), {
        sidebarItems,
        onSidebarItemClick: setActiveSection
      })}
    </div>
  );
}