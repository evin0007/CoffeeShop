import React from 'react';
import picture1 from '../../assets/images/coffee1.jpg';
import picture5 from '../../assets/images/coffee5.jpg';

function About() {
  return (<>
    <section className="relative bg-amber-100 overflow-hidden font-serif text-[#2A1B12]">
    <div className='mb-15 mt-5 text-center pl-0 sm:pl-2 md:pl-4 lg:pl-8'>
        <h1 className='underline text-2xl md:text-4xl font-bold leading-tight mb-2'>About Us</h1>
        <p className="text-[#5C4033] text-sm md:text-base text-center">
        At Bean & Brew, we believe a great day starts with a great cup. We source the finest beans and 
        roast them with one goal in mind: to fuel your passion.
        </p>
        <p className="text-[#5C4033] text-sm md:text-base text-center mt-2">
        Whether it's your morning ritual or a mid-afternoon escape, we’re here to provide the perfect 
        brew and a warm space to enjoy it.
        </p>
            <div className="w-[80%] h-1 mt-5 bg-amber-900 mx-auto"></div>
    </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-5 md:mb-5">
          <div className="relative w-full md:w-5/12 max-w-[320px] md:max-w-none mx-auto">
            <div className="absolute -top-3 -left-3 w-full h-full border border-[#2A1B12]/10 z-0"/>
            <img 
              src={picture1} 
              alt="Latte Art" 
              className="relative z-10 w-full h-[200px] md:h-[200px] object-cover shadow-md"
              data-aos="fade-right"
            />
          </div>

          <div className="w-full md:w-7/12 space-y-4 text-center md:text-left" data-aos="fade-up">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              MISSION
            </h1>
            <p className="text-[#5C4033] text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Standard dummy text ever since the 1500s.
            </p>
            <button className="border-b-2 border-[#2A1B12] pt-2 font-bold text-xs tracking-widest uppercase hover:opacity-70 transition-opacity">
              Explore More →
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 mb-16 md:mb-24">
          <div className="relative w-full md:w-5/12 max-w-[320px] md:max-w-none mx-auto">
            <div className="absolute -top-3 -right-3 w-full h-full border border-[#2A1B12]/10 z-0" />
            <img
              src={picture5} 
              alt="Coffee Beans"
              className="relative z-10 w-full h-[200px] md:h-[200px] object-cover shadow-md"
              data-aos="fade-left"
            />
          </div>

          <div className="w-full md:w-7/12 space-y-4 text-center md:text-left" data-aos="fade-up">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              VISSION
            </h1>
            <p className="text-[#5C4033] text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
              Experience the rich aroma and deep flavors of our carefully selected 
              beans, roasted to perfection for your daily morning ritual.
            </p>
            <button className="border-b-2 border-[#2A1B12] pt-2 font-bold text-xs tracking-widest uppercase hover:opacity-70 transition-opacity">
              View Our Menu →
            </button>
          </div>
        </div>

      </div>
    </section>
    </>
  );
}

export default About;