import React from 'react';
import '../../css/Welcome.css'; // Ensure the path is correct
import Footer from '../Components/Footer';
import FrontPageLayout from '@/Layouts/FrontPageLayout';
const About = () => {
    return (
        <FrontPageLayout>
        <div className="welcome-container">
  
            <main className="main-content">
                <section className="about-section">
                    <h2>Контакти</h2>
                    <p>
                    Сдружение Учи Лесно - гр. София<br/>
Email: info@learneez.eu <br/>
Site: www.learneez.eu<br/>
Tел.: +359 887 371361<br/>
Банкова сметка (BGN)<br/>

IBAN: BG16FINV91501217439369<br/>
BIC: FINVBGSF<br/>
Титуляр: УЧИ ЛЕСНО СДРУЖЕНИЕ<br/>
Технически одел:<br/>

Tел.: +359 888 032843<br/>
Tел.: +359 888 499005<br/>
Tел.: +359 898 211411<br/>
Докладвайте за нередности поискайте помощ на Email: dpanamski@gmail.com

                                </p>
                </section>
            
            </main>
        </div>
        </FrontPageLayout>
    );
};

export default About;
