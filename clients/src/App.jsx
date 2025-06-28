import { useEffect, useState } from "react";

// Pages
import UserForm from "./components/UserForm";
import Gender from "./components/Gender";
import Template from "./components/Template";
import Capture from "./components/Capture";
import Result from "./components/Result";
import LongButton from "./components/ui/LongButton";

function App() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("forward");

  // State for UserForm Component
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedPhone = localStorage.getItem("phone");
    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  // Save user data to database
  const handleUserData = async () => {
    const name = localStorage.getItem("name");
    const phone = localStorage.getItem("phone");

    const userData = {
      name: name,
      phone: phone,
    };

    const result = await saveUserData(userData);

    if (result) {
      console.log("User data saved:", result);

      // Remove data from localStorage
      localStorage.clear();
    } else {
      console.error("Failed to save user data");
    }
  };

  const start = () => {
    setStarted(true);
  };

  const nextStep = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition

    setIsTransitioning(true);
    setAnimationDirection("forward");

    setTimeout(() => {
      if (step === 1) {
        handleUserData();
      }
      setStep((prevStep) =>
        prevStep < steps.length ? prevStep + 1 : prevStep
      );

      setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Half of the total transition time
    }, 300);
  };

  const backStep = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition

    setIsTransitioning(true);
    setAnimationDirection("backward");

    setTimeout(() => {
      setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));

      setTimeout(() => {
        setIsTransitioning(false);
      }, 10);
    }, 10);
  };

  // Disable Next button if any field in UserForm is empty
  const isNextDisabled = step === 1 && (!name.trim() || !phone.trim());

  const backgroundImage = [
    "/ui/1.png",
    "/ui/2.png",
    "/ui/3.png",
    "/ui/4.png",
    "/ui/5.png",
  ];

  const steps = [
    <UserForm
      key={1}
      name={name}
      setName={setName}
      phone={phone}
      setPhone={setPhone}
      onNext={nextStep}
      onSaveUserData={handleUserData}
    />,
    <Gender key={2} onNext={nextStep} onBack={backStep} />,
    <Template key={3} onNext={nextStep} onBack={backStep} />,
    <Capture key={4} goTo={nextStep} goBack={backStep} />,
    <Result key={5} />,
  ];

  return (
    <div
      className="h-screen m-0 p-0 flex flex-col justify-evenly relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage[step]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.6s ease-in-out",
      }}
    >
      <div
        className={`flex flex-col items-center justify-center h-full ${
          started ? "hidden" : "block"
        }`}
      >
        <img src="/logo.png" alt="logo" className="w-1/2 mb-10" />
        <LongButton text="Tap to Start" onClick={start} />
      </div>

      {started && (
        <div>
          {/* Render Pages with transition effects */}
          <div
            className={`transition-all duration-600 ease-in-out ${
              isTransitioning
                ? animationDirection === "forward"
                  ? "transform -translate-x-full opacity-0"
                  : "transform translate-x-full opacity-0"
                : "transform translate-x-0 opacity-100"
            }`}
            style={{
              transitionProperty: "transform, opacity",
              transitionDuration: "0.6s",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {steps[step]}
          </div>

          {/* Buttons */}
          {step > 1 && step < 4 && (
            <div className="flex justify-center items-center">
              <LongButton text="Save & Next" onClick={nextStep} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
