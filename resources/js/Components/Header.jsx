import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isNavVisible, setIsNavVisible] = useState(false);

    const toggleNav = () => {
        setIsNavVisible(!isNavVisible);
    };

    return (
        <header className="header">
            <h1>Учи Лесно</h1>
            <nav className={`navbar ${isNavVisible ? 'visible' : ''}`}>
                <ul>
                    <li><a href="/">Начало</a></li>
                    <li><a href="/features">Продукт</a></li>
                    <li><a href="/about">За нас</a></li>
                    <li><a href="/contact">Контакти</a></li>
                </ul>
                <div className="auth-buttons">
                    <a href="/login" className="login-button">Вход</a>
                    <a href="/register" className="register-button">Регистрация</a>
                </div>
            </nav>
            <button className="nav-toggle-button" onClick={toggleNav}>
                {isNavVisible ? <FaTimes /> : <FaBars />}
            </button>
        </header>
    );
};

export default Header;
