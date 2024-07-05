import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <>
    <section className="bg-light-blue relative overflow-hidden pb-16 pt-[20px] md:pb-[80px] md:pt-[120px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]">
    <div className="container flex flex-col items-center justify-between px-4 lg:flex-row">
      <div className="relative lg:w-1/2">
        <div className="relative z-10 text-left">
            <h1 className="mb-3 font-serif text-4xl font-bold leading-snug text-[#1E56A0] sm:mb-4 md:mb-6 md:text-5xl">
              Discover Your Legal <br className="hidden md:inline" /> Partner,
              Instantly ⚖
            </h1>
            <p className="mb-6 max-w-xl text-base leading-relaxed text-[#323643] sm:mb-8 sm:text-lg md:mb-10 md:text-xl">
              {" "}
              Say goodbye to outdated methods, and hello to the future of legal
              services. <br />
              Wherever you are, whenever you need!
            </p>
            <div className="relative">
              <button className="absolute right-0 top-0 mr-4 mt-4 rounded-full bg-[#1E56A0] px-20 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-[#064ACB] hover:shadow-xl md:text-lg">
                Let's Discover
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 lg:pl-8">
          <div className="flex justify-end lg:justify-end">
            <Link href="/">
              <div className="lg:w-120 relative h-64 w-96 lg:h-80">
                <Image
                  src="/images/hero/download.png"
                  alt="Hero"
                  width={500} // Ajustez la largeur de l'image
                  height={200} // Ajustez la hauteur de l'image
                  className="shadow-xlg rounded-lg "
                />
              </div>
            </Link>
            <svg
              className="absolute bottom-0 left-0 z-0"
              width="450"
              height="556"
              viewBox="0 0 450 556"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="17.9997"
                cy="182"
                r="18"
                fill="url(#paint1_radial_25:259)"
              />
              <circle
                cx="76.9997"
                cy="288"
                r="34"
                fill="url(#paint2_radial_25:259)"
              />
              <circle
                cx="325.486"
                cy="302.87"
                r="180"
                transform="rotate(-37.6852 325.486 302.87)"
                fill="url(#paint3_linear_25:259)"
              />
              <circle
                opacity="0.8"
                cx="184.521"
                cy="315.521"
                r="132.862"
                transform="rotate(114.874 184.521 315.521)"
                stroke="url(#paint4_linear_25:259)"
              />
              <circle
                opacity="0.8"
                cx="356"
                cy="290"
                r="179.5"
                transform="rotate(-30 356 290)"
                stroke="url(#paint5_linear_25:259)"
              />
              <circle
                opacity="0.8"
                cx="191.659"
                cy="302.659"
                r="133.362"
                transform="rotate(133.319 191.659 302.659)"
                fill="url(#paint6_linear_25:259)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_25:259"
                  x1="-54.5003"
                  y1="-178"
                  x2="222"
                  y2="288"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <radialGradient
                  id="paint1_radial_25:259"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
                >
                  <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
                </radialGradient>
                <radialGradient
                  id="paint2_radial_25:259"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
                >
                  <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
                </radialGradient>
                <linearGradient
                  id="paint3_linear_25:259"
                  x1="226.775"
                  y1="-66.1548"
                  x2="292.157"
                  y2="351.421"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_25:259"
                  x1="184.521"
                  y1="182.159"
                  x2="184.521"
                  y2="448.882"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint5_linear_25:259"
                  x1="356"
                  y1="110"
                  x2="356"
                  y2="470"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint6_linear_25:259"
                  x1="118.524"
                  y1="29.2497"
                  x2="166.965"
                  y2="338.63"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
        <svg
          width="364"
          height="201"
          viewBox="0 0 364 201"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
            stroke="url(#paint0_linear_25:260)"
          />
          <path
            d="M-22.1107 72.3303C5.65989 66.4798 76.3965 64.9086 125.178 105.427C186.155 156.076 204.59 162.093 239.333 166.607C274.076 171.12 305.718 183.657 337.889 212.24"
            stroke="url(#paint1_linear_25:260)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_25:260"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1C6AE4" />
              <stop offset="1" stopColor="#165DDB" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_25:260"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1C6AE4" />
              <stop offset="1" stopColor="#0E57D2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
    </>
  );
};

export default Hero;
