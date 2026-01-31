import About from "./front_page/About";
import BestMenu from "./front_page/BestMenu";
import Feedback from "./front_page/Feedback";
import Footer from "./front_page/Footer";
import Service from "./front_page/Service";
import Tagline from "./front_page/tagline";
import ScrollTop from "./front_page/ScrollTop";

function Landing_page() {
  return (
  <>
  <div id="home" className=""><Tagline /></div>
  <div id="menu"className=""><BestMenu /></div>
  <div id="about"className=""><About /></div>
  <div id="service"className=""><Service /></div>
  <div id="feedback"className=""><Feedback /></div>
  <div id="footer"className=""><Footer /></div>
  <ScrollTop />
  </>
  );
}

export default Landing_page;
