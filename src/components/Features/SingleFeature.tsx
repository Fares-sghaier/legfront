const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph } = feature;

  return (
    <div className="w-full group transition duration-300 hover:bg-opacity-20">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        <div className="mb-10 flex h-64 w-64 items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary group-hover:bg-opacity-100">
          {/* Définissez ici les dimensions de votre icône */}
          {icon}
        </div>
        <h3 className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl group-hover:text-primary">
          {title}
        </h3>
        <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color">
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SingleFeature;
