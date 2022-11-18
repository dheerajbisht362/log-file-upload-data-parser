import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDownloadedMessage, setShowDownloadedMessage] = useState(false);

  function exportResponseInfo(response) {
    const fileData = JSON.stringify(response);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "log-error.json";
    link.href = url;
    link.click();
    setShowDownloadedMessage(true);
  }
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setShowDownloadedMessage(false);
  };

  const onFileUpload = (e) => {
    e.preventDefault();

    if(!selectedFile){
      return alert("Select file to upload")
    }

    setLoading(true);
    setShowDownloadedMessage(false);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileName", selectedFile.name);

    axios
      .post("http://localhost:4000/api/logupload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((data) => data.data)
      .then((data) => {
        setLoading(false);
        exportResponseInfo(data);
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message);
        } else {
          alert("Server Error");
        }
        setLoading(false);
      });
  };

  return (
    <div className="App">
      {loading && (
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="headingNav">File Upload</div>

      <form onSubmit={onFileUpload} encType="multipart/form-data">
        <h2>Upload Log file</h2>
        <input type="file" onChange={onFileChange} />

        <button disabled={loading} className="btnSubmit" type="submit">
          Upload
        </button>
      </form>

      {showDownloadedMessage && (
        <div>Response file downloaded successfully</div>
      )}
    </div>
  );
}

export default App;
