import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import menuData from "./menuData";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const usePathName = usePathname();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    // Ajoutez ici la logique de recherche avec la valeur de searchQuery
    console.log("Recherche pour :", searchQuery);
  };

  // const handleSearchBarHover = () => {
  //   setIsSearchActive(true);
  // };

  // const handleSearchBarBlur = () => {
  //   setIsSearchActive(false);
  // };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition dark:bg-gray-dark dark:shadow-sticky-dark"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <Link
              href="/"
              className={`header-logo flex items-center ${
                sticky ? "py-5 lg:py-2" : "py-8"
              } mt-4`} // Ajout de la classe "mt-4" pour la marge en haut
            >
              <Image
                src="/images/logo/semicircle.webp"
                alt="logo"
                width={40} // Ajustez la largeur du logo
                height={50} // Ajustez la hauteur du logo
                className="w-full dark:hidden"
              />
           
            </Link>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0 " : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                              usePathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem, index) => (
                                <Link
                                  href={submenuItem.path}
                                  key={index}
                                  className="block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              {/* Add search bar and buttons */}
              <div className="flex w-full max-w-[250px] items-center justify-between space-x-2 lg:w-auto lg:max-w-none lg:space-x-4">
                {/* Search bar */}
                <div
                  className={`relative flex w-full max-w-[250px] items-center justify-between rounded-full border border-gray-300 bg-white px-3 py-1 lg:w-80 ${
                    isSearchActive ? "shadow-lg" : ""
                  }`}
              
                >
                  <input
                    type="text"
                    placeholder="Search"
                    className="dark:placeholder-text-white/60 w-full flex-1 bg-transparent py-1 text-base font-medium text-body-color outline-none dark:text-white"
                    value={searchQuery}
                    onChange={handleInputChange}
                  />
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white transition duration-150 ease-in-out hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    onClick={handleSearch}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="h-4 w-4 fill-current"
                    >
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm4.99-2.42l-4.87 4.87-.71-.71 4.14-4.14H11v2h3.14z" />
                    </svg>
                  </button>
                </div>

                {/* Change opacity of the rest of the page when the search bar is active */}
                {isSearchActive && (
                  <div className="absolute inset-0 z-[-1] bg-black/50" />
                )}

                {/* Sign In and Sign Up buttons */}
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href="/signin"
                    className="flex items-center justify-center whitespace-nowrap rounded-full border border-gray-300 px-3 py-1.5 text-gray-800 shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 md:block md:px-4 md:text-base"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center whitespace-nowrap rounded-full bg-[#1E56A0] px-3 py-1.5 text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-opacity-80 md:block md:px-4"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
