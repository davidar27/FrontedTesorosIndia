import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { usePageContext } from '@/context/PageContext';

const MainLayout = () => {
    const { isEditMode, toggleEditMode } = usePageContext();

    return (
        <div className="flex flex-col min-h-screen ">
            <Header 
                isEditMode={isEditMode}
                onToggleEditMode={toggleEditMode}
            />

            <main className="flex-grow">
                <Outlet /> 
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;