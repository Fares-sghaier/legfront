import SectionTitle from "../Common/SectionTitle";
import featuresData from "./featuresData";

const FeatureCard = ({ feature }) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition duration-300 transform hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-50 opacity-0 group-hover:opacity-100 transition duration-300"></div>
      <div className="p-6 text-center">
        <h3 className="mb-2 text-2xl font-semibold text-blue-700">{feature.title}</h3>
        <img
          src={`/images/${feature.icon}`}
          alt={feature.title}
          className="mx-auto h-32 object-contain"
        />
        <p className="mt-4 text-gray-600">{feature.paragraph}</p>
        <a href="#" className="block mt-4 text-blue-700 hover:underline">Read more</a>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="relative bg-white py-8 md:py-16 lg:py-20">
      <div className="container">
        <SectionTitle
          title="Legal Essentials"
          paragraph="Explore the pivotal elements that make our platform stand out."
          center
          waveTop
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature) => (
            <div key={feature.id}>
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
