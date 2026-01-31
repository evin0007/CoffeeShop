import { useEffect, useState } from "react";

function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-10 h-10 z-50 rounded-full bg-white text-dark-blue flex items-center justify-center shadow-lg transition duration-300 hover:scale-110
        ${visible ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}
export default BackToTopButton;
