import React from 'react';

interface Country {
  name: string;
  iso2: string;
  flag: string;
}

interface CustomDropdownProps {
  countries: Country[];
  value: string;
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ countries, value, onChange }) => {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative inline-block w-full">
      <select
        className="w-full rounded-lg border bg-white p-4 px-3 py-2 shadow-md focus:border-blue-500 focus:outline-none appearance-none"
        value={value}
        onChange={handleSelect}
      >
        <option value="">Select a country</option>
        {countries.map((country) => (
          <option key={country.iso2} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current text-gray-600" viewBox="0 0 20 20">
          <path d="M7 10l5 5 5-5H7z"></path>
        </svg>
      </div>
      <ul className="absolute mt-1 hidden w-full rounded-md bg-white shadow-lg z-10">
        {countries.map((country) => (
          <li
            key={country.iso2}
            className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100"
            onClick={() => onChange(country.name)}
          >
            <img src={country.flag} alt={country.name} className="mr-2 h-4 w-6" />
            {country.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomDropdown;
