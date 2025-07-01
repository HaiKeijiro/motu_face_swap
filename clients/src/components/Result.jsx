import React, { useState, useEffect } from "react";
import { printImage } from "../API";

export default function Result() {
  const [qrCode, setQRCode] = useState(false);
  const [print, setPrint] = useState(false);
  const [printMessage, setPrintMessage] = useState(false);
  const [printer, setPrinter] = useState(""); // Printer selection
  const [printSize, setPrintSize] = useState("4x6"); // Default print size
  const [qrCodeData, setQRCodeData] = useState(null);
  const [googleDriveInfo, setGoogleDriveInfo] = useState(null);

  useEffect(() => {
    // Load QR code and Google Drive info from localStorage
    const storedQRCode = localStorage.getItem("qrCodeData");
    const storedGoogleDriveInfo = localStorage.getItem("googleDriveInfo");
    
    if (storedQRCode) {
      setQRCodeData(storedQRCode);
    }
    
    if (storedGoogleDriveInfo) {
      try {
        setGoogleDriveInfo(JSON.parse(storedGoogleDriveInfo));
      } catch (error) {
        console.error("Error parsing Google Drive info:", error);
      }
    }
  }, []);

  const handlePrint = async () => {
    const result = localStorage.getItem("swappedPhoto");

    if (!result) {
      alert("No image found to print!");
      return;
    }

    try {
      const imageBlob = await fetch(result).then((res) => res.blob());
      const response = await printImage(imageBlob, printer, printSize);

      if (response.message) {
        setPrint(false);
        PopUpPrint();
      } else {
        alert("Failed to print image.");
      }
    } catch (error) {
      console.error("Error during print:", error);
      alert("An error occurred while printing.");
    }
  };

  const PopUpPrint = () => {
    setPrintMessage(true);

    setTimeout(() => {
      setPrintMessage(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        <div className="w-[966px] h-[1526px] border-4 border-black rounded-3xl flex items-center justify-center overflow-hidden">
          <img
            src={localStorage.getItem("swappedPhoto")}
            alt="Swapped result"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      </div>

      <div className="flex mt-16 gap-x-[67px]">
        <button
          onClick={() => {
            setQRCode((prevState) => !prevState);
            setPrint(false);
          }}
          className="w-[418px] h-[126px] rounded-3xl border-4 border-[#002448] text-[3.25em] font-semibold flex items-center justify-center gap-4"
        >
          <img src="/qrcode.png" alt="QR code icon" className="w-12 h-12" />
          <span>QR</span>
        </button>
        <button
          onClick={() => {
            setPrint((prevState) => !prevState);
            setQRCode(false);
          }}
          className="w-[418px] h-[126px] border-4 rounded-3xl main-button flex items-center justify-center gap-4"
        >
          <span>Print</span>
        </button>
      </div>

      {qrCode && (
        <div className="z-10 absolute inset-0 bg-black/80 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 text-center">
            {qrCodeData ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Access Your Photo Gallery
                </h2>
                <img
                  src={qrCodeData}
                  alt="QR Code for Gallery Access"
                  className="w-64 h-64 mx-auto mb-4 border-2 border-gray-300 rounded"
                />
                <p className="text-gray-600 mb-4">
                  Scan this QR code to view your photo in the online gallery
                </p>
                {googleDriveInfo && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Or visit the gallery directly:
                    </p>
                    <a
                      href={googleDriveInfo.gallery_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm break-all"
                    >
                      {googleDriveInfo.gallery_url}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  QR Code Not Available
                </h2>
                <p className="text-gray-600 mb-4">
                  Google Drive integration is not configured or the upload failed.
                </p>
              </>
            )}
            <button
              onClick={() => setQRCode(false)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {print && (
        <div className="z-10 absolute inset-0 bg-black/80 text-white grid text-[4em] p-4">
          <div className="m-auto">
            <h1 className="mb-4">Print the image?</h1>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white p-2 w-1/2 rounded-md"
                onClick={() => setPrint(false)}
              >
                No
              </button>
              <button
                className="bg-green-500 text-white p-2 w-1/2 rounded-md"
                onClick={handlePrint}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Pop-up */}
      {printMessage ? (
        <div className="bg-[#BF9A30] z-10 absolute w-fit mx-auto text-[5em] text-white py-2 px-8 rounded-md">
          Printed!
        </div>
      ) : null}
    </div>
  );
}
