import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import "../../css/GuestLayout.css";
import "../../css/Welcome.css";
import FrontPageLayout from "./FrontPageLayout";
export default function GuestLayout({ children }) {
    return (
        <FrontPageLayout>
            <div className="logo-container">
                <Link href="/">
                </Link>
            </div>
            <div className="content-container">{children}</div>
       </FrontPageLayout>
    );
}
