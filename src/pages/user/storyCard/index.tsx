import React, { useState } from "react";
import { useTransition } from "react-spring";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/solid";
import Image from "next/image";
import stories from "./stories.json";

const Story = ({ imageSrc, alt, url, style }) => {
  return (
    <a href={url} target="_blank" style={style} className="flex flex-col items-center">
      <div className="rounded-lg w-32 h-32">
        <Image
          src={imageSrc}
          alt={alt}
          width={200}
          height={200}
          className="h-full w-full object-cover"
          quality={100}
        />
      </div>
    </a>
  );
};

const StoryCard = () => {
  const [startIndex, setStartIndex] = useState(0);
  const storiesPerPage = 6;

  const scrollRight = () => {
    if (startIndex + storiesPerPage < stories.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const scrollLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const storiesToShow = stories.slice(startIndex, startIndex + storiesPerPage);

  const transitions = useTransition(storiesToShow, {
    from: { opacity: 0, transform: "translateX(-50px)" },
    enter: { opacity: 1, transform: "translateX(0)" },
    leave: { opacity: 0, transform: "translateX(50px)" },
    trail: 200,
  });

  return (
    <div className="relative flex space-x-2 overflow-x-hidden">
      {startIndex > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-50 cursor-pointer hover:-translate-x-2 transition duration-300"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon className="h-8 w-8 text-gray-600" />
        </div>
      )}
      <div className="flex space-x-2">
        {transitions((props, item) => (
          <Story
            key={item.id}
            style={props}
            imageSrc={item.imageSrc}
            alt={item.alt}
            url={item.url}
          />
        ))}
      </div>
      {startIndex + storiesPerPage < stories.length && (
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-50 cursor-pointer"
          onClick={scrollRight}
        >
          <ChevronRightIcon className="h-8 w-8 text-gray-600" />
        </div>
      )}
    </div>
  );
};

export default StoryCard;
