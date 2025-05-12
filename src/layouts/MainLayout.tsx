import { Outlet } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow">
                <Outlet /> 
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;