import React from "react";
import "../../css/Welcome.css"; // Ensure the path is correct
import learneez1 from "./learneez1.jpg"; // Adjust the path based on your folder structure
import Footer from "../Components/Footer";
import FrontPageLayout from "@/Layouts/FrontPageLayout";
const About = () => {
    return (
        <FrontPageLayout>
            <img src={learneez1} alt="Learneez" className="welcome-image" />
            <section className="intro">
                <h2>За нас</h2>
                <p>
                “Учи лесно” е сдружение с нестопанска цел, извършващо дейност в частна полза. Предметът на дейност на сдружението е свързан с разработки на методи за обучение на деца с дислексия в ученическа възраст. Сдружението извършва приоритетно дейности, по въвеждане на интегрирани системи за независима помощ при работа с учебните помагала, мултимедийни средства за обучение включени в задължителните учебни процеси определени от МОН.
За изпълнение на целите си сдружението използва следните средства:

– обединяване и подпомагане на усилията на компетентните организации, държавни органи, членовете на сдружението и всички заинтересувани лица при провеждането на ефективна политика за модернизиране и адаптиране на средствата, използвани в образователната система към нуждите на деца със специални образователни потребности (СОП)
– разработка на тестови модели на софтуерни системи и тяхното синхронизиране с електронни устройства
– изготвяне на анализи и проучвания, методики и указания за работа с новите технологии
– изработване, популяризиране и прилагане на актуални софтуерни продукти
– въвеждането на съвременния опит на други успешни програми към технологичните средства за обучение.
– подпомагане на въвеждането и поддържането на високи стандарти за осъществяване на дейността при максимална ефективност
– събиране и разпространение на информация за постигане на свободен достъп при разпространението и сред всички заинтересувани
– обучение и тренинг за повишаване квалификацията на кадри
– издаването и разпространението на материали за популяризирането на системите за обучение
– организиране и участие във всякакви дейности и мероприятия в страната и в чужбина, спомагащи за провеждане на ефективна образователна политика, международно сътрудничество, партньорство и трансфер на опит.
                </p>
            </section>

            <section className="problem">
                <h2>The Challenge</h2>
                <p>
                    Many students struggle with traditional learning methods.
                    Learneez addresses these challenges by offering tailored
                    support, making education accessible and enjoyable for
                    everyone.
                </p>
            </section>
            <section className="call-to-action">
                <h2>Get Started Today!</h2>
                <p>
                    Join us in transforming education for special needs
                    students.
                </p>
                <a href="/register" className="cta-button">
                    Start Learning
                </a>
            </section>
            <Footer></Footer>
        </FrontPageLayout>
    );
};

export default About;
