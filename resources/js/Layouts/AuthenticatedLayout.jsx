import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import '../../css/AuthenticatedLayout.css';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="layout-container">
            <nav className="authnavbar">
                <div className="nav-inner">
                    <div className="nav-logo">
                        <Link href="/">
                            <ApplicationLogo />
                        </Link>
                    </div>

                    <div className="desktop-nav">
                        <NavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </NavLink>
                    </div>

                    <div className="user-section">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="user-wrapper">
                                    <button
                                        type="button"
                                        className="user-button"
                                    >
                                        {user.name}
                                        <svg
                                            className="dropdown-icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    <div className="mobile-toggle">
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(!showingNavigationDropdown)
                            }
                        >
                            <svg className="hamburger" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {!showingNavigationDropdown ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {showingNavigationDropdown && (
                    <div className="mobile-nav">
                        <div className="mobile-links">
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>

                        <div className="mobile-user">
                            <div className="mobile-user-info">
                                <div className="user-name">{user.name}</div>
                                <div className="user-email">{user.email}</div>
                            </div>

                            <div className="mobile-user-links">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="header-section">
                    <div className="header-inner">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
