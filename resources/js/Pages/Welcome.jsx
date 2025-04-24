import React, { useState } from "react";
import "../../css/Welcome.css";
import learneezHero from "./language-development-4-5-years_narrow.jpg";
import learneezChallenge from "./Blog-Covers-1.png";
import Footer from "../Components/Footer";
import {
    FaBars,
    FaTimes,
    FaPenFancy,
    FaHeadphones,
    FaUserCheck,
    FaChartLine,
} from "react-icons/fa";
import Header from "@/Components/Header";

const Welcome = () => {
    const [isNavVisible, setIsNavVisible] = useState(false);

    const toggleNavigation = () => {
        setIsNavVisible(!isNavVisible);
    };

    return (
        <div className="welcome-container">
            <Header></Header>

            <section className="hero-section">
                <img
                    src={learneezHero}
                    alt="Empowering Learning"
                    className="hero-image"
                />
                <div className="hero-content">
                    <h2>
                        {" "}
                        <strong>Решавай</strong> задачите си{" "}
                        <strong>самостоятелно</strong>
                    </h2>
                    <p> Кажете край на затруднението!</p>
                    <a href="/register" className="cta-button">
                        Започнете
                    </a>
                </div>
            </section>

            <main className="main-content">
                <section className="about-section">
                    <h2>Какво е "Учи Лесно"</h2>
                    <p>
                        Приложението подпомага ученици с дислексия интерактивно
                        да решават своите домашни работи със специално
                        разработени спомагателни инструменти. Препоръчително е
                        да се използва в сътрудничество с училището и
                        преподавателите, за да подкрепя ученици с различни
                        затруднения.
                    </p>
                </section>

                <section className="features">
                    <h2></h2>
                    <div className="feature-grid">
                        <div className="feature-item">
                            <div className="feature-top">
                                <FaUserCheck size={40} color="#0056b3" />
                                <h3>&emsp; Предназначен за деца</h3>
                            </div>

                            <p>
                                Интуитивен интерфейс за удобство на учениците.
                            </p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-top">
                                <FaPenFancy size={40} color="#0056b3" />
                                <h3>&emsp;Помощ в училище</h3>
                            </div>
                            <p>
                                Попълвайте учебните тетрадки за училище на
                                таблет или с интерактивна дъска.
                            </p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-top">
                                <FaHeadphones size={40} color="#0056b3" />
                                <h3>&emsp;Аудио инструкции</h3>
                            </div>
                            <p>
                                Затруднението в четенето се елиминира напълно с
                                интерактивни аудио бутони.
                            </p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-top">
                                <FaChartLine size={40} color="#0056b3" />
                                <h3>&emsp;Край с хартията</h3>
                            </div>
                            <p>
                                Попълвайте учебни материали директно в
                                приложението.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="problem">
                    <div className="problem-content">
                        <div className="text">
                             <header>Нашата цел</header>
                            <p>
                                Целта ни е да помогнем на учениците да са максимално мотивирани
                                да положат усилия, за да се справят с домашните
                                си сами, използвайки познатите им електронни
                                устройства и модерни технологии.
                                <br></br>
                                Ако желаете да дарите сума по ваше желание за
                                развитието на този сайт можете да го направите на: <br></br>
                                <strong>
                                    IBAN: BG16FINV91501217439369
                                </strong>{" "} (BGN) 
                                <br></br>
                                BIC: FINVBGSF
Титуляр: УЧИ ЛЕСНО СДРУЖЕНИЕ
<br></br>Всяка подкрепа е важна за нас.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="call-to-action">
                    <h2>Започнете сега</h2>
                    <p>Нужна е единствено регистрация</p>
                    <a href="/register" className="cta-button">
                        Старт
                    </a>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Welcome;
