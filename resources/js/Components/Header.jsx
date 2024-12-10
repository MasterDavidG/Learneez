import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isNavVisible, setIsNavVisible] = useState(false);

    const toggleNav = () => {
        setIsNavVisible(!isNavVisible);
    };

    return (
        <header className="header">
            <h1>Learneez</h1>
            <nav className={`navbar ${isNavVisible ? 'visible' : ''}`}>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/features">Features</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
                <div className="auth-buttons">
                    <a href="/login" className="login-button">Login</a>
                    <a href="/register" className="register-button">Register</a>
                </div>
            </nav>
            <button className="nav-toggle-button" onClick={toggleNav}>
                {isNavVisible ? <FaTimes /> : <FaBars />}
            </button>
        </header>
    );
};

export default Header;
