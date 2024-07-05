import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import Image from "next/image"; // Importez la balise Image de Next.js

const Breadcrumb = ({
}: {
}) => {
  return (
    <>
      <section className="relative z-10 overflow-hidden pt-28 lg:pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center justify-between">
            {" "}
            {/* Ajoutez 'justify-between' ici */}
            <div className="flex w-full items-center px-4 md:w-auto">
              {" "}
              {/* Remplacez md:w-8/12 lg:w-7/12 par md:w-auto */}
              <div className="mb-8 flex max-w-[570px] items-center md:mb-0 lg:mb-12">
                {" "}
              </div>
            </div>
            <div className="flex w-full items-center px-4 md:w-auto">
              {" "}
              {/* Remplacez md:w-4/12 lg:w-5/12 par md:w-auto */}
              {/* Button with icon */}
              <div className="flex items-center px-4 md:w-auto">
                {" "}
                {/* Ajoutez cette division pour le bouton */}
                
              </div>
            </div>
          </div>
        </div>

        <div>
          <span className="absolute left-0 top-0 z-[-1]">
            <svg
              width="287"
              height="254"
              viewBox="0 0 287 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Définition du motif de fond */}
            </svg>
          </span>
          <span className="absolute right-0 top-0 z-[-1]">
            <svg
              width="628"
              height="258"
              viewBox="0 0 628 258"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Définition du motif de fond */}
            </svg>
          </span>
        </div>
      </section>
    </>
  );
};

export default Breadcrumb;
