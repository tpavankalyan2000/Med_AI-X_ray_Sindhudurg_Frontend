// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FiUpload,
//   FiImage,
//   FiAlertCircle,
//   FiCheck,
//   FiInfo,
// } from "react-icons/fi";
// import dicomParser from "dicom-parser";
// import { URLS } from "../../config";

// const RadiologyPanel = () => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [uploadedFile, setUploadedFile] = useState(null); // <-- Add this
//   const [AnalysisError, setAnalysisError] = useState(null); // <-- Add this
//   const [isAnalysisError, setisAnalysisError] = useState(false); // <-- Add this
//   const [rawFile, setRawFile] = useState(null);
//   const [uploadableImage, setUploadableImage] = useState(null);



//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };


//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadedFile(file); // save for future use
//       processFile(file);
//     }
//   };
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setUploadedFile(file);
//       processFile(file);
//     }
//   };


//   const [classification, setClassification] = useState(null);

//   const processFile = async (file) => {
//     const token = "QpWoEiRuTyAlSkDjFhGZmXnCbVn";
//     const isImage = file.type.match("image.*");
//     const isDicom = file.name.endsWith(".dcm") || file.name.endsWith(".dicom");

//     if (!isImage && !isDicom) {
//       alert("Please upload a valid image file (JPG, PNG, DICOM)");
//       return;
//     }

//     setAnalyzing(true);
//     setAnalysisResult(null);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (isDicom) {
//         processDicomFile(e.target.result);
//       } else {
//         setUploadedImage(e.target.result);
//       }
//     };
//     if (isDicom) {
//       reader.readAsArrayBuffer(file);
//     } else {
//       reader.readAsDataURL(file);
//     }

//     try {
//       // Step 1: Analyse the image
//       const analyseFormData = new FormData();
//       analyseFormData.append("file", file);

//       const analyseResponse = await fetch(`${URLS.API_URL}/analyse_pic`, {
//         method: "POST",
//         body: analyseFormData,
//       });

//       const analyseData = await analyseResponse.json();

//       if (!analyseResponse.ok) {
//         console.log(analyseData.error, 'kskskskskskskslalalalal')
//         setAnalysisError(analyseData.error)
//         setisAnalysisError(true)
//         throw new Error("Failed to analyse image");
//       }
//       else{
//         setisAnalysisError(false)
//           const classification = analyseData.classification; // e.g., 'normal', 'abnormal'
//           setClassification(classification);
    
//           // Step 2: Generate the report with classification
//           const reportFormData = new FormData();
//           reportFormData.append("file", file);
//           reportFormData.append("classification", classification);
    
//           const reportResponse = await fetch(
//             "http://164.52.197.32:5006/generate-report",
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//               body: reportFormData,
//             }
//           );
    
//           const reportData = await reportResponse.json();
    
//           if (!reportResponse.ok) {
//             throw new Error("Failed to generate report");
//           }
    
//           // Set the final analysis result
//           setAnalysisResult({
//             report: reportData.report,
//             title: reportData.title,
//             description: reportData.description,
//             severity: reportData.severity,
//           });
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Something went wrong during analysis or report generation.");
//     } finally {
//       setAnalyzing(false);
//     }
//     let finalFileForUpload = uploadedFile;

//     if (isDicomFile(uploadedFile)) {
//       finalFileForUpload = await convertDicomToJpegBlob(uploadedFile);
//     }
//     reportFormData.append("file", finalFileForUpload);

//   };


//   const convertDicomToJpegBlob = async (dicomFile) => {
//     const arrayBuffer = await dicomFile.arrayBuffer();
//     const byteArray = new Uint8Array(arrayBuffer);
//     const dataSet = dicomParser.parseDicom(byteArray);
  
//     const pixelDataElement = dataSet.elements.x7fe00010;
//     if (!pixelDataElement) throw new Error("No pixel data");
  
//     const width = dataSet.uint16("x00280011");
//     const height = dataSet.uint16("x00280010");
  
//     const canvas = document.createElement("canvas");
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext("2d");
  
//     const pixelData = byteArray.slice(
//       pixelDataElement.dataOffset,
//       pixelDataElement.dataOffset + pixelDataElement.length
//     );
  
//     const imageData = ctx.createImageData(width, height);
//     const pixelArray = new Uint8ClampedArray(pixelData);
//     for (let i = 0; i < pixelArray.length; i++) {
//       imageData.data[i * 4] = pixelArray[i]; // R
//       imageData.data[i * 4 + 1] = pixelArray[i]; // G
//       imageData.data[i * 4 + 2] = pixelArray[i]; // B
//       imageData.data[i * 4 + 3] = 255; // A
//     }
//     ctx.putImageData(imageData, 0, 0);
  
//     // Convert to blob
//     return new Promise((resolve) =>
//       canvas.toBlob((blob) => resolve(blob), "image/jpeg")
//     );
//   };
  
//   // --------------------------------------by using dicom parser ----------------------------------------------------
//   const [classificationResult, setClassificationResult] = useState(null);

//   // Process the DICOM file using dicom-parser
//   const processDicomFile = (arrayBuffer) => {
//     const byteArray = new Uint8Array(arrayBuffer);
//     const dataSet = dicomParser.parseDicom(byteArray);

//     // Get pixel data (this might vary depending on the DICOM file's encoding)
//     const pixelDataElement = dataSet.elements.x7fe00010; // Standard DICOM pixel data tag

//     if (!pixelDataElement) {
//       alert("This DICOM file does not contain pixel data.");
//       return;
//     }

//     const pixelData = byteArray.slice(
//       pixelDataElement.dataOffset,
//       pixelDataElement.dataOffset + pixelDataElement.length
//     );

//     // Create an image from the pixel data and convert it to base64 (or directly to a canvas)
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     // Assuming the DICOM file contains grayscale image data
//     const width = dataSet.uint16("x00280011"); // Image Width
//     const height = dataSet.uint16("x00280010"); // Image Height

//     canvas.width = width;
//     canvas.height = height;

//     // Decode pixel data and render to canvas
//     const imageData = ctx.createImageData(width, height);
//     const pixelArray = new Uint8ClampedArray(pixelData);
//     for (let i = 0; i < pixelArray.length; i++) {
//       imageData.data[i * 4] = pixelArray[i]; // R
//       imageData.data[i * 4 + 1] = pixelArray[i]; // G
//       imageData.data[i * 4 + 2] = pixelArray[i]; // B
//       imageData.data[i * 4 + 3] = 255; // Alpha
//     }
//     ctx.putImageData(imageData, 0, 0);

//     // Convert canvas to base64
//     const dataUrl = canvas.toDataURL();

//     // Update the state with the base64-encoded DICOM image
//     setUploadedImage(dataUrl);
//     simulateAnalysis();
//   };
//   // ------------------------------------------------------------------------

//   const simulateAnalysis = () => {
//     // setAnalyzing(true);

//     // Simulate AI processing delay
//     setTimeout(() => {
  
//     }, 3000);
//   };

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case "critical":
//         return "text-red-600 bg-red-50";
//       case "high":
//         return "text-orange-600 bg-orange-50";
//       case "moderate":
//         return "text-amber-600 bg-amber-50";
//       case "low":
//         return "text-blue-600 bg-blue-50";
//       case "normal":
//         return "text-green-600 bg-green-50";
//       default:
//         return "text-gray-600 bg-gray-50";
//     }
//   };

//   return (
//     <div className="h-full">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">X-Ray Analysis</h1>
//         <p className="text-gray-600">
//           Upload chest X-rays for AI-powered analysis
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Upload Area */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">
//               Upload X-Ray Image
//             </h2>

//             {!uploadedImage ? (
//               <div
//                 className={`border-2 border-dashed rounded-lg p-8 text-center ${
//                   isDragging
//                     ? "border-primary-500 bg-primary-50"
//                     : "border-gray-300 hover:border-primary-400"
//                 }`}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//               >
//                 <div className="mx-auto flex justify-center mb-4">
//                   <FiUpload className="h-12 w-12 text-gray-400" />
//                 </div>
//                 <p className="text-gray-700 mb-2">
//                   Drag and drop your X-ray image here
//                 </p>
//                 <p className="text-sm text-gray-500 mb-4">or</p>
//                 <label className="btn-primary cursor-pointer">
//                   <span>Select File</span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept=".jpg,.jpeg,.png,.dcm,.dicom,image/*"
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 <p className="text-xs text-gray-500 mt-4">
//                   Supported formats: JPEG, PNG, DICOM, DCM
//                 </p>
//               </div>
//             ) : (
//               <div className="text-center">
//                 <div className="relative rounded-lg overflow-hidden mb-4 mx-auto max-w-sm">
//                   <picture>
//                     {/* If the uploaded image is in the correct format (base64 or URL), show it */}
                    

//                     <source srcSet={uploadedImage} />
//                     <img
//                       src={uploadedImage}
//                       alt="Uploaded Image"
//                       className="mx-auto max-h-64 object-contain"
//                     />
//                   </picture>
//                 </div>
//                 <div className="flex justify-center space-x-3">
//                   <button
//                     onClick={() => {
//                       setUploadedImage(null); // Remove the uploaded image
//                       setAnalysisResult(null); // Clear the analysis result
//                     }}
//                     className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm font-medium transition-colors"
//                   >
//                     Remove
//                   </button>
//                   <button
//                     // onClick={simulateAnalysis}
//                     onClick={() => {
//                       if (uploadedFile) {
//                         processFile(uploadedFile); // re-upload the saved file
//                       }
//                     }}
//                     disabled={analyzing}
//                     className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-white text-sm font-medium transition-colors ${
//                       analyzing ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {analyzing ? "Analyzing..." : "Analyze Again"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="mt-6">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">
//                 Important Notes:
//               </h3>
//               <ul className="text-xs text-gray-600 space-y-1">
//                 <li className="flex items-start">
//                   <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
//                   <span>
//                     All images are processed securely and confidentially
//                   </span>
//                 </li>
//                 <li className="flex items-start">
//                   <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
//                   <span>
//                     AI analysis is meant to assist, not replace, professional
//                     medical diagnosis
//                   </span>
//                 </li>
//                 <li className="flex items-start">
//                   <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
//                   <span>
//                     For optimal results, ensure images are clear and properly
//                     oriented
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </motion.div>

//         {/* Results Area */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//         >
//           <div className="bg-white rounded-lg shadow p-6 h-full">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">
//               Analysis Results
//             </h2>

//             {AnalysisError && isAnalysisError && (
//               <div className="flex flex-col items-center justify-center h-64 text-center">
//                 <FiImage className="h-16 w-16 text-gray-300 mb-4" />
//                 <p className="text-gray-500">
//                   {AnalysisError}
//                 </p>
//               </div>
//             )}

//             {analyzing && (
//               <div className="flex flex-col items-center justify-center h-64 text-center">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
//                 <p className="text-gray-700 font-medium">
//                   Analyzing X-ray image...
//                 </p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Our AI is examining the image for abnormalities
//                 </p>
//               </div>
//             )}

//             {analysisResult && !analyzing && (
//               <div className="space-y-6">
//                 <div
//                   className={`p-4 rounded-lg ${getSeverityColor(
//                     analysisResult.severity
//                   )}`}
//                 >
//                   <div className="flex items-start">
//                     {analysisResult.severity === "normal" ? (
//                       <FiCheck className="h-5 w-5 mr-2 mt-0.5" />
//                     ) : (
//                       <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5" />
//                     )}
//                     <div>

//                       <h6  style={{ fontWeight: "bold", fontSize: "20px" }}>
//                         X-Ray Format :- <span>Yes</span>
//                       </h6>
//                       <h3 className="font-medium">
//                         {/* Classification: */}
//                         {classification || "Loading..."}
//                       </h3>

//                       <p className="text-sm mt-1">
//                         {analysisResult.description}
//                       </p>
//                       <div className="mt-2 text-gray-600 space-y-1">
//                         {analysisResult.report
//                           .split(".")
//                           .filter((sentence) => sentence.trim() !== "")
//                           .map((sentence, index) => (
//                             <p key={index}>{sentence.trim()}.</p>
//                           ))}
//                       </div>
                     
//                     </div>
                   
//                   </div>
//                 </div>

//                 <div className="pt-4 mt-4 border-t border-gray-200">
//                   <p className="text-xs text-gray-500 italic">
//                     This analysis is provided as a decision support tool and
//                     should not replace professional medical judgment.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default RadiologyPanel;

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiImage,
  FiAlertCircle,
  FiCheck,
  FiInfo,
} from "react-icons/fi";
import { URLS } from "../../config";
import { isDicomFile, decodeDicomToJpeg } from "../utility/dicom";

/**
 * RadiologyPanel ─ drag‑and‑drop panel that accepts JPEG/PNG/DICOM files,
 * shows a preview (full‑range JPEG for DICOM), calls two back‑end routes,
 * and renders a severity‑coloured report block.

 */
const RadiologyPanel = () => {
  // ──────────────────────────────── state ────────────────────────────────
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [classification, setClassification] = useState(null);

  const [analysisError, setAnalysisError] = useState(null);
  const [isAnalysisError, setIsAnalysisError] = useState(false);

  // ──────────────────────────────── d&d ──────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const [file] = e.dataTransfer.files;
    if (file) processFile(file);
  };
  const handleFileChange = (e) => {
    const [file] = e.target.files;
    if (file) processFile(file);
  };

  // ───────────────────────────── main worker ─────────────────────────────
  const processFile = async (file) => {
    setUploadedFile(file);
    setAnalysisResult(null);
    setIsAnalysisError(false);
    setAnalysisError(null);

    // ----- 1️⃣  preview ---------------------------------------------------
    if (isDicomFile(file)) {
      try {
        const { dataUrl } = await decodeDicomToJpeg(file);
        setUploadedImage(dataUrl);
      } catch (err) {
        console.error(err);
        alert("Unable to render preview for this DICOM file.");
        return;
      }
    } else {
      // JPEG / PNG
      setUploadedImage(URL.createObjectURL(file));
    }

    // ----- 2️⃣  back‑end round‑trip --------------------------------------
    setAnalyzing(true);
    const token = "QpWoEiRuTyAlSkDjFhGZmXnCbVn";

    try {
      // /analyse_pic -------------------------------------------------------
      const analyseFd = new FormData();
      analyseFd.append("file", file);
      const analyseRes = await fetch(`${URLS.API_URL}/analyse_pic`, {
        method: "POST",
        body: analyseFd,
      });
      const analyseJson = await analyseRes.json();
      if (!analyseRes.ok) {
        throw new Error(analyseJson.error || "Analyse failed");
      }
      setClassification(analyseJson.classification);

      // /generate-report  (send JPEG for DICOM) ---------------------------
      const finalBlob = isDicomFile(file)
        ? (await decodeDicomToJpeg(file)).jpegBlob
        : file;

      const reportFd = new FormData();
      reportFd.append("file", finalBlob);
      reportFd.append("classification", analyseJson.classification);

      const reportRes = await fetch("http://164.52.197.32:5006/generate-report", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: reportFd,
      });
      const reportJson = await reportRes.json();
      if (!reportRes.ok) throw new Error("Report generation failed");

      setAnalysisResult({
        report: reportJson.report,
        title: reportJson.title,
        description: reportJson.description,
        severity: reportJson.severity,
      });
      const response_xray = await fetch(`${URLS.API_URL}/xray_data`, {
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportJson),
        });
      

    } catch (err) {
      console.error(err);
      setAnalysisError(err.message);
      setIsAnalysisError(true);
      alert("Something went wrong during analysis or report generation.");
    } finally {
      setAnalyzing(false);
    }
  };

  // ───────────────────────────── helpers ────────────────────────────────
  const getSeverityColor = (sev) => {
    const map = {
      critical: "text-red-600 bg-red-50",
      high: "text-orange-600 bg-orange-50",
      moderate: "text-amber-600 bg-amber-50",
      low: "text-blue-600 bg-blue-50",
      normal: "text-green-600 bg-green-50",
    };
    return map[sev] || "text-gray-600 bg-gray-50";
  };

  // ────────────────────────────── ui ─────────────────────────────────────
  return (
    <div className="h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">X‑Ray Analysis</h1>
        <p className="text-gray-600">Upload chest X‑rays for AI‑powered analysis</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Upload area ─────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload X‑Ray Image</h2>

            {!uploadedImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300 hover:border-primary-400"
                }`}
              >
                <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-700 mb-2">Drag & drop your X‑ray here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="btn-primary cursor-pointer">
                  <span>Select File</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.dcm,.dicom,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">Supported: JPEG, PNG, DICOM</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative rounded-lg overflow-hidden mb-4 mx-auto max-w-sm">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="mx-auto max-h-64 object-contain"
                  />
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setAnalysisResult(null);
                      setUploadedFile(null);
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => uploadedFile && processFile(uploadedFile)}
                    disabled={analyzing}
                    className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded text-white text-sm ${
                      analyzing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {analyzing ? "Analyzing…" : "Analyze Again"}
                  </button>
                </div>
              </div>
            )}

            <section className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Important Notes:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-start">
                  <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" /> All images are processed securely.
                </li>
                <li className="flex items-start">
                  <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" /> AI analysis is a decision‑support tool.
                </li>
                <li className="flex items-start">
                  <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" /> Ensure images are clear & properly oriented.
                </li>
              </ul>
            </section>
          </div>
        </motion.div>

        {/* ─── Results area ────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>

            {analysisError && isAnalysisError && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FiImage className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">{analysisError}</p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-700 font-medium">Analyzing X‑ray…</p>
                <p className="text-sm text-gray-500 mt-2">Our AI is examining the image for abnormalities.</p>
              </div>
            )}

            {analysisResult && !analyzing && (
              <>
                <div className={`p-4 rounded-lg ${getSeverityColor(analysisResult.severity)}`}>
                  <div className="flex items-start">
                    {analysisResult.severity === "normal" ? (
                      <FiCheck className="h-5 w-5 mr-2 mt-0.5" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    )}
                    <div>
                      <h6 className="font-bold text-lg">X‑Ray Format: <span>Yes</span></h6>
                      <h3 className="font-medium">{classification || "Loading…"}</h3>
                      <p className="text-sm mt-1">{analysisResult.description}</p>
                      <div className="mt-2 text-gray-600 space-y-1">
                        {analysisResult.report
                          .split(".")
                          .filter((s) => s.trim())
                          .map((s, i) => (
                            <p key={i}>{s.trim()}.</p>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="pt-4 mt-4 border-t border-gray-200 text-xs text-gray-500 italic">
                  This analysis should not replace professional medical judgment.
                </footer>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RadiologyPanel;