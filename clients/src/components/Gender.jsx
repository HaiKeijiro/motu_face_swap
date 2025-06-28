import React, { useState } from "react";

// Images
// 1. Upload di folder public
// 2. E.G: import men from "/nama_file.png";
import Men from "../assets/men/ai_00075_.png";
import Women from "../assets/women/ai_00042_.png";

export default function Gender() {
  const [selectedGender, setSelectedGender] = useState("");

  const genders = [
    { key: "men", src: Men, alt: "Men" },
    { key: "women", src: Women, alt: "Women" },
  ];

  // Save gender selection to state and localStorage
  const saveGender = (selectedGender) => {
    setSelectedGender(selectedGender);
    localStorage.setItem("gender", selectedGender);
  };

  return (
    <div className="w-full text-center">
      <h1 className="text-white text-[5em] font-bold">Choose Your Gender</h1>
      <div className="flex mt-24 mx-auto space-x-10 justify-center items-center">
        {genders.map((gender) => (
          <img
            key={gender.key}
            className={`${
              selectedGender === gender.key
                ? "border-[1em] border-yellow-500 w-[340px]"
                : "w-[300px]"
            }`}
            src={gender.src}
            alt={gender.alt}
            onClick={() => saveGender(gender.key)}
          />
        ))}
      </div>
    </div>
  );
}
