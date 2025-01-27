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
                    Сдружение Учи Лесно - гр. София
Email: info@learneez.eu
Site: www.learneez.eu
Tел.: +359 887 371361
Банкова сметка (BGN)

IBAN: BG16FINV91501217439369
BIC: FINVBGSF
Титуляр: УЧИ ЛЕСНО СДРУЖЕНИЕ
Технически одел:

Tел.: +359 888 032843
Tел.: +359 888 499005
Tел.: +359 898 211411


                                </p>
                </section>
            
            </main>
        </div>
        </FrontPageLayout>
    );
};

export default About;
