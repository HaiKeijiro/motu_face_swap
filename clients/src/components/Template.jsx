import React, { useEffect, useState } from "react";
import { fetchTemplates } from "../API";

const Template = () => {
  const [templates, setTemplates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the center image index

  useEffect(() => {
    const gender = localStorage.getItem("gender");
    const loadTemplates = async () => {
      try {
        const fetchedTemplates = await fetchTemplates(gender);
        setTemplates(fetchedTemplates);
      } catch (error) {
        setTemplates([]);
        console.error("Fetching templates error: ", error);
      }
    };

    loadTemplates();
  }, []);

  // Handle image click to center that image
  const handleImageClick = (index) => {
    setCurrentIndex(index);
    localStorage.setItem("selectedTemplate", templates[index].imageUrl);
  };

  // Get the images to display (center + side images)
  const getDisplayImages = () => {
    if (templates.length === 0) return [];
    
    const displayImages = [];
    const totalImages = templates.length;
    
    // Show up to 3 images (left, center, right)
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + totalImages) % totalImages;
      displayImages.push({
        template: templates[index],
        originalIndex: index,
        position: i // -1 for left, 0 for center, 1 for right
      });
    }
    
    return displayImages;
  };

  const displayImages = getDisplayImages();

  return (
    <div className="px-4">
      {templates.length > 0 ? (
        <div className="text-center">
          <h1 className="text-white text-[5em] font-bold">
            Choose Your Template
          </h1>
          <div className="flex items-center justify-center gap-x-8 mt-[6rem] h-[400px]">
            {displayImages.map(({ template, originalIndex, position }, index) => (
              <img
                key={originalIndex}
                src={template.imageUrl}
                alt="templates"
                className={`
                  object-cover cursor-pointer transition-all duration-300 ease-in-out
                  ${position === 0 
                    ? "w-[320px] h-[380px] z-10" 
                    : "w-[200px] h-[240px] opacity-70 hover:opacity-90"
                  }
                `}
                onClick={() => handleImageClick(originalIndex)}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <div className="flex justify-center gap-8 mt-6">
            <button
              onClick={() => handleImageClick((currentIndex - 1 + templates.length) % templates.length)}
              className="text-white hover:text-yellow-500 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => handleImageClick((currentIndex + 1) % templates.length)}
              className="text-white hover:text-yellow-500 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <h1 className="text-white text-center">No templates available.</h1>
      )}
    </div>
  );
};

export default Template;
