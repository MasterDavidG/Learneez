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
                      
Самоподготовка

Целите, които сме си поставили са насочени към това, учениците да са максимално мотивирани да положат усилия, за да се справят с домашните си сами, използвайки познатите им електронни устройства и модерни технологии.
Родителски контрол

                         </p>
                </section>
                
                <section className="problem">
                    <h2>The Challenge</h2>
                    <p>
                       
Разработените приложения заместват родителя и подкрепата, от която се нуждаят малките ученици. Нуждата от индивидуално внимание е минимална. Улесняват родителският контрол, върху работата на детето.
Свободно време

Децата с дислексия полагат многократно повече усилия, при писане и четене, съответно и много бързо се изморяват. Концентрацията им бързо се изчерпва, предвид и малката им възраст. Имат нужда от дълги и по-чести почивки. Новите технологии щадят силите на децата и техните родители. Освобождават време за любими занимания.

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
