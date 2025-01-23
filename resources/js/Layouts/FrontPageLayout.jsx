import { Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import '../../css/Welcome.css'
export default function FrontPageLayout({ children }) {
    return (
        <div className="">
            <Header />
   
            <div className="guest-layout">
                {children}
            </div>
            <Footer />
        </div>
    );
}

