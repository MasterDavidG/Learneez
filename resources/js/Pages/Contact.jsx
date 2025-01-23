import React from 'react';
import '../../css/Welcome.css'; // Ensure the path is correct
import learneez1 from './learneez1.jpg'; // Adjust the path based on your folder structure
import Footer from '../Components/Footer';
import FrontPageLayout from '@/Layouts/FrontPageLayout';
const About = () => {
    return (
        <FrontPageLayout>
        <div className="welcome-container">
  
            <main className="main-content">
                <img src={learneez1} alt="Learneez" className="welcome-image" />
                <section className="intro">
                    <h2>About us</h2>
                    <p>
                        Learneez is designed to support students with special educational needs. 
                        Our platform provides interactive tools to enhance learning experiences, ensuring every student receives personalized attention.
                    </p>
                </section>
                
                <section className="problem">
                    <h2>The Challenge</h2>
                    <p>
                        Many students struggle with traditional learning methods. 
                        Learneez addresses these challenges by offering tailored support, making education accessible and enjoyable for everyone.
                    </p>
                </section>
                <section className="call-to-action">
                    <h2>Get Started Today!</h2>
                    <p>Join us in transforming education for special needs students.</p>
                    <a href="/register" className="cta-button">Start Learning</a>
                </section>
            </main>
        </div>
        </FrontPageLayout>
    );
};

export default About;
