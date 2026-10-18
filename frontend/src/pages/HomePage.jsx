import Hero from "../components/Hero";

import WhyChooseUs from "../components/WhyChooseUs";

const HomePage = ({ isLoggedIn, setIsLoggedIn }) => {

    return (
        <div>

            <Hero />

            <WhyChooseUs />

        </div>
    );
};

export default HomePage;