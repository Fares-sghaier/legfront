import Image from "next/image";

const Suggestion = () => {
  return (
    <div className="mx-16 my-8 flex">
      <div className="w-2/3 rounded-l-lg bg-[#1E56A0] p-4">
        {/* Contenu de la partie gauche */}
        <div className="bg-[#1E56A0] p-4">
          <div className="mx-auto max-w-7xl">
            <div className="mx-16 my-8">
              <h1 className="mb-4 text-5xl font-bold text-white">
                Why do <br />
                <span className="text-mint">
                  clients choose <br />{" "}
                  <span className="text-blue-200">LegalNet ?</span>
                </span>
              </h1>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="mr-4">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-8 w-8 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.7 7l1.2 3.2 3.5.2-2.7 2.2.9 3.4-2.9-1.9L8.8 16l.9-3.4L7 10.4l3.4-.2L11.7 7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#F6F6E9]">
                      Proof of quality
                    </h3>
                    <p className="text-white">
                      Check any pro’s work samples, client reviews, and identity
                      verification.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="mr-4">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-8 w-8 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9.72 13.91A2.08 2.08 0 0012 15.7a2.08 2.08 0 002.28-1.79 1.68 1.68 0 00-1.13-1.56c-.62-.23-1.93-.55-2.54-.83a1.56 1.56 0 01-.89-1.43A2.08 2.08 0 0112 8.3a2.08 2.08 0 012.28 1.79M12 8.3V7m0 10v-1.3"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#F6F6E9]">
                      No cost until you hire
                    </h3>
                    <p className="text-white">
                      Interview potential fits for your job, negotiate rates,
                      and only pay for work you approve.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="mr-4">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-8 w-8 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M15.5 9.51l-4.98 4.98-2.02-2.01"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#F6F6E9]">
                      Safe and secure
                    </h3>
                    <p className="text-white">
                      Focus on your work knowing we help protect your data and
                      privacy. We’re here with 24/7 support if you need it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/3 rounded bg-gray-200 p-4">
        {/* Image dans la partie droite */}
        <Image
          src="/images/hero/women.jfif"
          alt="lawyer"
          width={500}
          height={200}
          className="rounded transition-transform duration-300"
        />
        <div className="absolute left-0 top-0 h-full w-full bg-black opacity-0 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default Suggestion;
