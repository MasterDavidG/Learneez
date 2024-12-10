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
                <h2>Empowering <strong>Learning</strong> for Every <strong>Student</strong></h2>
                <p>Interactive tools designed to enhance personalized learning experiences for students of all abilities.</p>
                <a href="/register" className="cta-button">Begin Your Journey</a>
            </div>
        </section>

            <main className="main-content">
                <section className="about-section">
                    <h2>About Our App</h2>
                    <p>
                        At <strong>Learneez</strong>, we aim to provide <strong>accessible</strong> and <strong>engaging</strong> tools for students with special needs. 
                        Our platform is designed to make education both <strong>fun</strong> and <strong>effective</strong>.
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
                            <h3>Audio Guidance</h3>
                            <p>Step-by-step audio instructions for enhanced understanding.</p>
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
                            <h2>The Challenge</h2>
                            <p>
                                Many students face challenges with traditional learning methods. <strong>Learneez</strong> provides 
                                <strong>tailored support</strong>, making education more accessible and engaging.
                            </p>
                        </div>
                        <img src={learneezChallenge} alt="Challenge Learneez" className="challenge-image" />
                    </div>
                </section>

                <section className="call-to-action">
                    <h2>Start Your Journey Today!</h2>
                    <p>Join us in transforming education and unlocking potential for every student.</p>
                    <a href="/register" className="cta-button">Sign Up Now</a>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Welcome;
