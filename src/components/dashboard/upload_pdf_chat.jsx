import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiImage,
  FiAlertCircle,
  FiCheck,
  FiInfo,
} from "react-icons/fi";
import dicomParser from "dicom-parser";

const Upload_PDF = () => {
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

  // ---------------------------------------------------- for convertion route--------------------------------------
  const processFile = (file) => {
    const token = "JZTGj4NLslCYnPjJbCscDGeD4JLwJhrHuruI";

    const isSupported =
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md");

    if (!isSupported) {
      alert("Please upload a valid file (PDF, TXT, MD)");
      return;
    }

    setAnalyzing(true); // Start showing "Converting..."

    const formData = new FormData();
    formData.append("file", file);

    // Upload file to the Flask backend
    fetch("http://216.48.179.162:5000/ingest", {
      method: "POST",
      headers: {
         Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        }
        else {
          alert("Failed to Anlayse ... !");
        }
        if (data.fileUrl) {
          // Automatically trigger download
          const link = document.createElement("a");
          link.href = data.fileUrl;
          link.download = file.name; // Keep original file name
          link.click(); // Trigger the download
        }
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
      })
      .finally(() => {
        setAnalyzing(false); // Show "Convert Again" after response
      });

    // Reset preview because no need for reader now
    setAnalysisResult(null);
    setUploadedImage(null);

    // Set uploaded file for preview
    setUploadedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  };

  // Function to read file content for .txt and .md files
  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
  };

  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    if (
      uploadedFile &&
      (uploadedFile.name.endsWith(".txt") || uploadedFile.name.endsWith(".md"))
    ) {
      readFileContent(uploadedFile); // Read content when file is set
    }
  }, [uploadedFile]);

  // ---------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          DocAnalyzer AI File Insight
        </h1>
        <p className="text-gray-600">
          Upload PDFs, Text, and .MD files for intelligent processing and
          conversion
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
              {/* DocAnalyzer AI */}
              SmartFile Transcoder
            </h2>

            {!uploadedFile ? (
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
                  Drag and drop your document here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="btn-primary cursor-pointer">
                  <span>Select File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.md"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: PDF, TXT, MD
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative rounded-lg overflow-hidden mb-4 mx-auto max-w-sm">
                  {/* Handle PDF preview */}
                  {uploadedFile.name.endsWith(".pdf") && (
                    <iframe
                      src={URL.createObjectURL(uploadedFile)}
                      width="100%"
                      height="400px"
                      title="PDF Preview"
                    />
                  )}

                  {/* Handle TXT and MD preview */}
                  {(uploadedFile.name.endsWith(".txt") ||
                    uploadedFile.name.endsWith(".md")) && (
                    <pre className="whitespace-pre-wrap break-words text-left text-sm p-4 border border-gray-300 rounded max-h-80 overflow-y-auto">
                      {fileContent} {/* Display the content of .txt or .md */}
                    </pre>
                  )}
                  {/* {(uploadedFile.name.endsWith(".txt") ||
                    uploadedFile.name.endsWith(".md")) && (
                    <pre className="whitespace-pre-wrap break-words text-left text-sm p-4 border border-gray-300 rounded">
                      {URL.createObjectURL(uploadedFile)}{" "}
                    </pre>
                  )} */}
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
                        processFile(uploadedFile);
                      }
                    }}
                    disabled={analyzing || !uploadedFile}
                    className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-white text-sm font-medium transition-colors ${
                      analyzing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {analyzing ? "Analysing..." : "AI Analyse"}
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
                    All documents are processed securely and confidentially
                  </span>
                </li>
                <li className="flex items-start">
                  <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                  <span>
                    AI processing is designed to assist with document conversion
                    and insights, not to replace human review
                  </span>
                </li>
                <li className="flex items-start">
                  <FiInfo className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                  <span>
                    Ensure your files are in the correct format for optimal
                    processing (PDF, TXT, or .MD)
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

export default Upload_PDF;
