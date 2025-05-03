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
import { URLS } from "../../config";

const RadiologyPanel = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null); // <-- Add this


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   setIsDragging(false);

  //   const files = e.dataTransfer.files;
  //   if (files.length) {
  //     processFile(files[0]);
  //   }
  // };

  // const handleFileChange = (e) => {
  //   if (e.target.files.length) {
  //     processFile(e.target.files[0]);
  //   }
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file); // save for future use
      processFile(file);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  };
  
  

  // const processFile = (file) => {
  //   // Check if file is an image
  //   if (!file.type.match('image.*')) {
  //     alert('Please upload an image file')
  //     return
  //   }

  //   // Reset previous analysis
  //   setAnalysisResult(null)

  //   // Create an image URL
  //   const reader = new FileReader()
  //   reader.onload = (e) => {
  //     setUploadedImage(e.target.result)
  //     // Simulate analysis
  //     simulateAnalysis()
  //   }
  //   reader.readAsDataURL(file)
  // }

  // const processFile = (file) => {
  //   const isImage = file.type.match('image.*');
  //   const isDicom = file.name.endsWith('.dcm') || file.name.endsWith('.dicom');

  //   if (!isImage && !isDicom) {
  //     alert('Please upload a valid image file (JPG, PNG, DICOM)');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   // Upload file to the Flask backend
  //   fetch(`${URLS.API_URL}/x_tay_analyze`, {
  //     method: 'POST',
  //     body: formData,
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       // Assuming the backend returns the URL of the uploaded image
  //       setUploadedImage(data.imageUrl);
  //       simulateAnalysis(); // Start analysis once image is uploaded
  //     })
  //     .catch(err => {
  //       console.error("Error uploading file:", err);
  //     });

  //   setAnalysisResult(null); // Reset analysis result
  // };

  const processFile = (file) => {
    const token = "QpWoEiRuTyAlSkDjFhGZmXnCbVn";
    const isImage = file.type.match("image.*");
    const isDicom = file.name.endsWith(".dcm") || file.name.endsWith(".dicom");
  
    if (!isImage && !isDicom) {
      alert("Please upload a valid image file (JPG, PNG, DICOM)");
      return;
    }
  
    setAnalyzing(true);
  
    // Process image or DICOM
    setAnalysisResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isDicom) {
        processDicomFile(e.target.result);
      } else {
        setUploadedImage(e.target.result); // Direct image for JPG/PNG
        simulateAnalysis();
      }
    };
    if (isDicom) {
      reader.readAsArrayBuffer(file); // Use ArrayBuffer for DICOM files
    } else {
      reader.readAsDataURL(file);
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    // Upload file to the Flask backend
    fetch("http://164.52.197.32:5006/generate-report", {
      // fetch("http://216.48.179.162:5006/generate-report", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setAnalyzing(false);
        // setUploadedImage(data.imageUrl); // Set the uploaded image URL
  
        // Set the analysis result from the backend response
        setAnalysisResult({
          report: data.report, // This is the report content
          title: data.title,
          description: data.description,
          severity: data.severity,
        });
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
        setAnalyzing(false);
      });
  };
  

  // --------------------------------------by using dicom parser ----------------------------------------------------
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
    simulateAnalysis();
  };
  // ------------------------------------------------------------------------

  const simulateAnalysis = () => {
    // setAnalyzing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // setAnalyzing(false);

      // Generate mock analysis result
      // const mockResults = [
      //   {
      //     title: "No Significant Findings",
      //     description:
      //       "The X-ray appears normal with no significant abnormalities detected.",
      //     probability: 0.89,
      //     severity: "normal",
      //   },
      //   {
      //     title: "Potential Pneumonia",
      //     description:
      //       "Possible consolidation in the lower right lobe, consistent with early pneumonia.",
      //     probability: 0.72,
      //     severity: "moderate",
      //   },
      //   {
      //     title: "Cardiomegaly Detected",
      //     description:
      //       "Enlargement of the cardiac silhouette, suggesting cardiomegaly.",
      //     probability: 0.63,
      //     severity: "moderate",
      //   },
      //   {
      //     title: "Pleural Effusion",
      //     description:
      //       "Small amount of pleural fluid detected in the right hemithorax.",
      //     probability: 0.58,
      //     severity: "moderate",
      //   },
      // ];

      // Randomly select one of the mock results
      // const result =
      //   mockResults[Math.floor(Math.random() * mockResults.length)];
      // setAnalysisResult(result);
    }, 3000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "moderate":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      case "normal":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">X-Ray Analysis</h1>
        <p className="text-gray-600">
          Upload chest X-rays for AI-powered analysis
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
                      setUploadedImage(null); // Remove the uploaded image
                      setAnalysisResult(null); // Clear the analysis result
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    // onClick={simulateAnalysis}
                    onClick={() => {
                      if (uploadedFile) {
                        processFile(uploadedFile); // re-upload the saved file
                      }
                    }}
                    disabled={analyzing}
                    className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-white text-sm font-medium transition-colors ${
                      analyzing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {analyzing ? "Analyzing..." : "Analyze Again"}
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

        {/* Results Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Analysis Results
            </h2>

            {!uploadedImage && !analyzing && !analysisResult && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FiImage className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Upload an X-ray image to see analysis results
                </p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-700 font-medium">
                  Analyzing X-ray image...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Our AI is examining the image for abnormalities
                </p>
              </div>
            )}

            {analysisResult && !analyzing && (
              <div className="space-y-6">
                {/* Result Summary */}
                {/* <div
                  className={`p-4 rounded-lg ${getSeverityColor(
                    analysisResult.severity
                  )}`}
                >
                  <div className="flex items-start">
                    {analysisResult.severity === "normal" ? (
                      <FiCheck className="h-5 w-5 mr-2 mt-0.5" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">{analysisResult.title}</h3>
                      <p className="text-sm mt-1">
                        {analysisResult.description}
                      </p>
                    </div>
                  </div>
                </div> */}
                <div
                  className={`p-4 rounded-lg ${getSeverityColor(
                    analysisResult.severity
                  )}`}
                >
                  <div className="flex items-start">
                    {analysisResult.severity === "normal" ? (
                      <FiCheck className="h-5 w-5 mr-2 mt-0.5" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">{analysisResult.title}</h3>
                      <p className="text-sm mt-1">
                        {analysisResult.description}
                      </p>
                      <p className="mt-2 text-gray-600">
                        {analysisResult.report}
                      </p>{" "}
                      {/* Displaying the report */}
                    </div>
                  </div>
                </div>

                {/* Confidence Score */}
                {/* <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    AI Confidence Score
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${analysisResult.probability * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{Math.round(analysisResult.probability * 100)}%</span>
                    <span>100%</span>
                  </div>
                </div> */}

                {/* Recommendations */}
                {/* <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Recommendations
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {analysisResult.severity === "normal" ? (
                      <li className="flex items-start">
                        <FiCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>No further action required at this time.</span>
                      </li>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <FiAlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                          <span>
                            Consult with a radiologist for confirmation.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FiAlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                          <span>
                            Consider additional diagnostic tests for further
                            evaluation.
                          </span>
                        </li>
                      </>
                    )}
                    <li className="flex items-start">
                      <FiInfo className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span>
                        Always correlate with clinical findings and patient
                        history.
                      </span>
                    </li>
                  </ul>
                </div> */}

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    This analysis is provided as a decision support tool and
                    should not replace professional medical judgment. 
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RadiologyPanel;
