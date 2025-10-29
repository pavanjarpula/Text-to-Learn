import React, { useState } from "react";
import { Download, Loader, CheckCircle, AlertCircle } from "lucide-react";
import "./PDFExporter.css";

const PDFExporter = ({ lesson, courseInfo = {}, lessonId = null }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // FIXED: Use process.env for CRA (not import.meta.env)
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      console.log("📄 Starting PDF export...");
      console.log(`📍 Using API URL: ${API_URL}`);

      let response;

      if (lessonId) {
        console.log(`📄 Exporting lesson ${lessonId} from database...`);
        response = await fetch(`${API_URL}/enrichment/export-lesson/${lessonId}`);
      } else {
        console.log("📄 Exporting lesson from frontend data...");
        response = await fetch(`${API_URL}/enrichment/export-lesson-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lesson,
            courseInfo,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success || !data.data.html) {
        throw new Error("Failed to generate PDF HTML");
      }

      const { html, filename } = data.data;

      // Download as HTML (user can print to PDF)
      downloadAsHTML(html, filename);

      console.log("✅ PDF exported successfully");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("❌ Error exporting PDF:", err);
      setError(err.message || "Failed to export PDF");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download as HTML file (user can print to PDF)
   */
  const downloadAsHTML = (htmlContent, filename) => {
    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = filename.replace(".html", ".html");
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);

    console.log("✅ HTML downloaded. Print to PDF using Ctrl+P (Windows) or Cmd+P (Mac)");
  };

  return (
    <div className="pdf-exporter-container">
      <button
        onClick={handleExportPDF}
        disabled={loading || !lesson}
        className={`pdf-export-button ${loading ? "loading" : ""} ${
          success ? "success" : ""
        } ${error ? "error" : ""}`}
        title="Download lesson as PDF/HTML"
      >
        {loading ? (
          <>
            <Loader size={18} className="icon-spin" />
            <span>Exporting...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle size={18} />
            <span>Exported!</span>
          </>
        ) : error ? (
          <>
            <AlertCircle size={18} />
            <span>Error</span>
          </>
        ) : (
          <>
            <Download size={18} />
            <span>Export as PDF</span>
          </>
        )}
      </button>

      {error && (
        <div className="pdf-export-error">
          {error}
          <p style={{ fontSize: "12px", marginTop: "8px" }}>
            💡 Tip: You can print the HTML file as PDF using Ctrl+P (Windows) or Cmd+P (Mac)
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFExporter;
