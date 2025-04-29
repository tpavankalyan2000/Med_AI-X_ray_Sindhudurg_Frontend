import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiImage,
  FiAlertCircle,
  FiCheck,
  FiInfo,
} from "react-icons/fi";
import dicomParser from "dicom-parser";
import { URLS } from "../../config"

const Convertion = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [uploadedFile, setUploadedFile] = useState(null); // store uploaded file

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };

  // const handleFileChange = (e) => {
  //   if (e.target.files.length) {
  //     processFile(e.target.files[0]);
  //   }
  // };

  // ---------------------------------------------------- for convertion route--------------------------------------
  const processFile = (file) => {
    const isImage = file.type.match("image.*");
    const isDicom = file.name.endsWith(".dcm") || file.name.endsWith(".dicom");

    if (!isImage && !isDicom) {
      alert("Please upload a valid image file (JPG, PNG, DICOM)");
      return;
    }

    setAnalyzing(true); // Start showing "Converting..."

    const formData = new FormData();
    formData.append("file", file);

    // Upload file to the Flask backend
    fetch(`${URLS.API_URL}/convert_dcm_to_jpeg`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.imageUrl) {
          // Automatically trigger download
          const link = document.createElement("a");
          link.href = data.imageUrl;
          link.download = file.name.split(".")[0] + ".jpg"; // Optionally set the file name
          link.click(); // Trigger the download
        }
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
      })
      .finally(() => {
        setAnalyzing(false); // Show "Convert Again" after response
      });

    // ---------------------------------------for main-----------------------------------------------------------
    setAnalysisResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isDicom) {
        processDicomFile(e.target.result);
      } else {
        setUploadedImage(e.target.result); // Direct image for JPG/PNG
        // simulateAnalysis();
      }
    };
    if (isDicom) {
      reader.readAsArrayBuffer(file); // Use ArrayBuffer for DICOM files
    } else {
      reader.readAsDataURL(file);
    }
    // ---------------------------------------------------------------------------------------------------------
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  };

  // ---------------------------------------------------------------------------------------------------------------------------------

  // Process the DICOM file using dicom-parser
  const processDicomFile = (arrayBuffer) => {
    const byteArray = new Uint8Array(arrayBuffer);
    const dataSet = dicomParser.parseDicom(byteArray);

    // Get pixel data (this might vary depending on the DICOM file's encoding)
    const pixelDataElement = dataSet.elements.x7fe00010; // Standard DICOM pixel data tag

    if (!pixelDataElement) {
      alert("This DICOM file does not contain pixel data.");
      return;
    }

    const pixelData = byteArray.slice(
      pixelDataElement.dataOffset,
      pixelDataElement.dataOffset + pixelDataElement.length
    );

    // Create an image from the pixel data and convert it to base64 (or directly to a canvas)
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Assuming the DICOM file contains grayscale image data
    const width = dataSet.uint16("x00280011"); // Image Width
    const height = dataSet.uint16("x00280010"); // Image Height

    canvas.width = width;
    canvas.height = height;

    // Decode pixel data and render to canvas
    const imageData = ctx.createImageData(width, height);
    const pixelArray = new Uint8ClampedArray(pixelData);
    for (let i = 0; i < pixelArray.length; i++) {
      imageData.data[i * 4] = pixelArray[i]; // R
      imageData.data[i * 4 + 1] = pixelArray[i]; // G
      imageData.data[i * 4 + 2] = pixelArray[i]; // B
      imageData.data[i * 4 + 3] = 255; // Alpha
    }
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to base64
    const dataUrl = canvas.toDataURL();

    // Update the state with the base64-encoded DICOM image
    setUploadedImage(dataUrl);
    // simulateAnalysis();
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Convertion of X-Rays Format
        </h1>
        <p className="text-gray-600">
          Upload X-rays (.dcm format) to Visualise in .jpg format
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Upload X-Ray Image
            </h2>

            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300 hover:border-primary-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mx-auto flex justify-center mb-4">
                  <FiUpload className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-700 mb-2">
                  Drag and drop your X-ray image here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="btn-primary cursor-pointer">
                  <span>Select File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.dcm,.dicom,image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: JPEG, PNG, DICOM, DCM
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative rounded-lg overflow-hidden mb-4 mx-auto max-w-sm">
                  <picture>
                    {/* If the uploaded image is in the correct format (base64 or URL), show it */}
                    <source srcSet={uploadedImage} />
                    <img
                      src={uploadedImage}
                      alt="Uploaded Image"
                      className="mx-auto max-h-64 object-contain"
                    />
                  </picture>
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadedImage(null);
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => {
                      if (uploadedFile) {
                        processFile(uploadedFile); // reprocess same file
                      }
                    }}
                    disabled={analyzing || !uploadedFile}
                    className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-white text-sm font-medium transition-colors ${
                      analyzing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {analyzing ? "Converting..." : "Convert Again"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Important Notes:
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-start">
                  <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                  <span>
                    All images are processed securely and confidentially
                  </span>
                </li>
                <li className="flex items-start">
                  <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                  <span>
                    AI analysis is meant to assist, not replace, professional
                    medical diagnosis
                  </span>
                </li>
                <li className="flex items-start">
                  <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                  <span>
                    For optimal results, ensure images are clear and properly
                    oriented
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Convertion;
