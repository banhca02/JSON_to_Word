import React, { useState, useRef, useEffect } from "react";
import {upfile, downfile} from "../services/ConvertJsonAPI";

const ConvertJson = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [docId, setDocId] = useState(null);
  const [existTime, setExistTime] = useState(0);
  const [isDownloadAvailable, setIsDownloadAvailable] = useState(false);
  // const [downloadUrl, setDownloadUrl] = useState(null);
  const inputRef = useRef();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]); 
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setSelectedFile(files[0]); 
    }
  };

  const handleBoxClick = () => {
    inputRef.current.click(); 
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true); // Bắt đầu hiển thị spinner

    try {
      const res = await upfile(formData)
      console.log("Upload thành công:", res);
      setDocId(res.doc_id);
      setExistTime(res.exist_time);
      setIsDownloadAvailable(true);
    } catch (error) {
      console.error("Lỗi upload:", error);
    } finally {
      setIsUploading(false); // Tắt spinner
    }
  };


  const downloadConvertedFile = () => {
    downfile(docId)
  };

  const handleUploadClick = () => {
    if (!selectedFile) {
      alert("Bạn chưa chọn file JSON!");
      return;
    }
    uploadFile(selectedFile); // upload khi bấm nút
  };

  const handleDownloadClick = () => {
    if (!docId) {
      alert("Chưa có file chuyển đổi!");
      return;
    }
    downloadConvertedFile(); 
  };

  useEffect(() => {
    if (existTime !== 0 && isDownloadAvailable) {
      const timeout = setTimeout(() => {
        setIsDownloadAvailable(false); // tắt nút
      }, existTime * 1000); // convert giây sang ms

      return () => clearTimeout(timeout); // cleanup khi component unmount hoặc thay đổi
    }
  }, [existTime, isDownloadAvailable]);


  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-10 flex flex-col items-center gap-y-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Chuyển JSON thành Word
        </h1>
        <div
          className="w-full max-w-4xl mx-auto text-center cursor-pointer select-none rounded-lg border-2 border-dashed text-slate-700 p-24 font-sans"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleBoxClick}
          style={{
            backgroundColor: dragActive ? "#f0f9ff" : "transparent"
          }}
        >
          <label
            style={{ cursor: "pointer", color: "#2563eb", fontWeight: "bold" }}
          >
            Kéo thả hoặc{" "}
            <span style={{ textDecoration: "underline" }}>Chọn file</span> để chuyển đổi
          </label>
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            accept=".json,application/json"
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <p className="mt-2 text-slate-500 text-sm">
            {selectedFile ? selectedFile.name : "Accept JSON file"}
          </p>
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span>Đang tải file lên...</span>
          </div>
        )}
        <div className="flex flex-row justify-center gap-32">
          <button
            onClick={handleUploadClick}
            className="border border-blue-500 border-2 bg-white rounded-lg px-4 py-2"
          >
            Chuyển đổi
          </button>
          <button
            onClick={handleDownloadClick}
            disabled={!docId || !isDownloadAvailable}
            className={`border border-2 rounded-lg px-4 py-2 ${
              docId && isDownloadAvailable
                ? "border-blue-500 bg-white text-black"
                : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Tải file
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertJson;


// import React, { useState } from "react";
// import axios from "axios";

// const ConvertJson = () => {
//   const [file, setFile] = useState(null);
//   const [downloadLink, setDownloadLink] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setDownloadLink(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post("http://localhost:8000/convert", formData, {
//         responseType: "blob",
//       });

//       const blob = new Blob([response.data], {
//         type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       });

//       const url = URL.createObjectURL(blob);
//       setDownloadLink(url);
//     } catch (error) {
//       alert("Lỗi khi chuyển đổi file");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Chuyển JSON thành Word
//       </h1>
//       <form
//         onSubmit={handleSubmit}
//         className=".bg-white shadow-lg rounded-xl p-6 space-y-4 w-full max-w-md"
//       >
//         <input
//           type="file"
//           accept=".json"
//           onChange={handleFileChange}
//           className="file-input file-input-bordered w-full"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
//         >
//           Chuyển đổi
//         </button>
//       </form>

//       {downloadLink && (
//         <a
//           href={downloadLink}
//           download="converted.docx"
//           className="mt-4 text-blue-600 underline"
//         >
//           Tải file Word về
//         </a>
//       )}
//     </div>
//   );
// }

// export default ConvertJson;