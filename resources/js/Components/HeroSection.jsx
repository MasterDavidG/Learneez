import React from 'react';
import learneezHero from '@Pages/learneez1.jpg';

const HeroSection = () => {
    return (
        <section className="hero-section">
            <img src={learneezHero} alt="Empowering Learning" className="hero-image" />
            <div className="hero-content">
                <h2>Empowering <strong>Learning</strong> for Every <strong>Student</strong></h2>
                <p>Interactive tools designed to enhance personalized learning experiences for students of all abilities.</p>
                <a href="/register" className="cta-button">Get Started</a>
            </div>
        </section>
    );
};

export default HeroSection;
