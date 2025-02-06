import React, { useState } from 'react';
import '../../css/Welcome.css';
import learneezHero from './language-development-4-5-years_narrow.jpg';
import learneezFeature from './learneez1.jpg';
import learneezChallenge from './Blog-Covers-1.png';
import Footer from '../Components/Footer';
import { FaBars, FaTimes, FaPenFancy, FaHeadphones, FaUserCheck, FaChartLine } from 'react-icons/fa';
import Header from '@/Components/Header';

const Welcome = () => {
    const [isNavVisible, setIsNavVisible] = useState(false);

    const toggleNavigation = () => {
        setIsNavVisible(!isNavVisible);
    };

    return (
        <div className="welcome-container">
  <Header></Header>

  <section className="hero-section">
            <img src={learneezHero} alt="Empowering Learning" className="hero-image" />
            <div className="hero-content">
                <h2> <strong>Решавай</strong> задачите си <strong>самостоятелно</strong></h2>
                <p> Кажете край на затруднението!</p>
                <a href="/register" className="cta-button">Започнете</a>
            </div>
        </section>

            <main className="main-content">
                <section className="about-section">
                    <h2>За Нас</h2>
                    <p>
                    Организацията подпомага ученици с дислексия интерактивно да решават своите домашни работи със специялно разработени инструменти.
                     </p>
                </section>

                <section className="features">
                    <h2>Key Features</h2>
                    <div className="feature-grid">
                        <div className="feature-item">
                            <FaPenFancy size={40} color="#0056b3" />
                            <h3>Interactive Drawing Tools</h3>
                            <p>Express and learn creatively with our intuitive tools.</p>
                        </div>
                        <div className="feature-item">
                            <FaHeadphones size={40} color="#0056b3" />
                            <h3>Аудио инструкции</h3>
                            <p>Затруднението в четенето се елиминира напълно с интерактивни аудио битони.</p>
                        </div>
                        <div className="feature-item">
                            <FaUserCheck size={40} color="#0056b3" />
                            <h3>User-Friendly Interface</h3>
                            <p>Designed for simplicity and ease of use.</p>
                        </div>
                        <div className="feature-item">
                            <FaChartLine size={40} color="#0056b3" />
                            <h3>Track Your Progress</h3>
                            <p>Monitor achievements and celebrate milestones.</p>
                        </div>
                    </div>
                </section>

                <section className="problem">
                    <div className="problem-content">
                        <div className="text">
                            <h2>Нашата цел</h2>
                            <p>
                            Целите, които сме си поставили са насочени към това, учениците да са максимално мотивирани да положат усилия, за да се справят с домашните си сами, използвайки познатите им електронни устройства и модерни технологии.
                             </p>
                        </div>
                    </div>
                </section>

                <section className="call-to-action">
                    <h2>Започнете сега</h2>
                    <p>Нужна е единствено регистрация</p>
                    <a href="/register" className="cta-button">Старт</a>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Welcome;
