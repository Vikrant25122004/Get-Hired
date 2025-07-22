import React, { useState } from 'react';
import { UploadCloud, FileText, AlertTriangle, CheckCircle, Lightbulb, BarChart, X, User, Star, Briefcase, Linkedin, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import "./ResumeScorePage.css"
import Footer from './Footer';
// The pdf.js library is expected to be loaded globally via a script tag.
// We access it from the window object to avoid a build-time error.
const pdfjsLib = window.pdfjsLib;

// Set the worker source for pdf.js if the library is available.
if (pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}



// --- Main Resume Scorer Page Component ---
export default function ResumeScorerPage() {
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            if (!pdfjsLib) {
                setError("PDF processing library is not loaded. Please refresh the page.");
                return;
            }
            setResumeFile(file);
            setError("");
            
            // Extract text from PDF
            const reader = new FileReader();
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result);
                try {
                    const pdf = await pdfjsLib.getDocument({data: typedarray}).promise;
                    let textContent = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const text = await page.getTextContent();
                        textContent += text.items.map(s => s.str).join(' ') + '\n';
                    }
                    setResumeText(textContent);
                } catch (pdfError) {
                    console.error("Error parsing PDF:", pdfError);
                    setError("Could not read the PDF file. It might be corrupted or protected.");
                    setResumeFile(null);
                    setResumeText("");
                }
            };
            reader.readAsArrayBuffer(file);

        } else {
            setError("Please upload a valid PDF file.");
            setResumeFile(null);
            setResumeText("");
        }
    };

    const handleAnalyze = () => {
        if (!resumeText || !jobDescription) {
            setError("Please upload a resume and provide a job description.");
            return;
        }
        setError("");
        setIsLoading(true);
        setAnalysisResult(null);

        // Simulate API call for analysis
        setTimeout(() => {
            const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65; // Random score between 65-95
            setAnalysisResult({
                score: score,
                errors: [
                    "Resume lacks quantifiable achievements in the 'Innovate Inc.' role.",
                    "The summary section is generic; tailor it to the job description.",
                    "Inconsistent date formatting (e.g., '2021 - Present' vs '2014 - 2018')."
                ],
                improvements: [
                    "Add specific metrics like 'improved performance by 15%' or 'reduced load time by 300ms'.",
                    "Incorporate keywords from the job description such as 'CI/CD pipelines' and 'user-centric design'.",
                    "Expand on the 'Project Phoenix' to detail the technologies used and your specific contributions."
                ],
                conclusions: "Strong candidate with relevant frontend experience. The resume shows a good grasp of core technologies but could be strengthened by highlighting specific impacts and results."
            });
            setIsLoading(false);
        }, 2500);
    };

    return (
        
            <main className="container scorer-container">
                <div className="scorer-header">
                    <h1>AI Resume Analyzer</h1>
                    <p>Get an instant, data-driven analysis of your resume against any job description to maximize your chances of landing an interview.</p>
                </div>

                <div className="scorer-layout">
                    <div className="input-column">
                        <div className="scorer-card">
                            <label htmlFor="resume-upload" className="upload-box">
                                <div className="upload-icon"><UploadCloud size={30} /></div>
                                <p>Click to upload or drag and drop</p>
                                <span>PDF only, max 5MB</span>
                                <input id="resume-upload" type="file" accept=".pdf" onChange={handleFileChange} />
                            </label>
                            {resumeFile && <div className="file-name">{resumeFile.name}</div>}
                            {resumeText && (
                                <div className="resume-content-display">
                                    <strong>Resume Content Preview:</strong><br/>
                                    {resumeText.substring(0, 400)}...
                                </div>
                            )}
                        </div>
                        <div className="scorer-card">
                            <h3>Job Description</h3>
                            <textarea
                                className="jd-textarea"
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="results-column">
                        <button className="analyze-button" onClick={handleAnalyze} disabled={isLoading || !resumeFile || !jobDescription}>
                            {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
                        </button>
                        {error && <p style={{color: 'var(--danger-color)', textAlign: 'center'}}>{error}</p>}
                        
                        <div className="scorer-card">
                            {isLoading && (
                                <div className="loading-indicator">
                                    <div className="spinner"></div>
                                    <p>Our AI is reviewing your documents...</p>
                                </div>
                            )}
                            {!isLoading && !analysisResult && (
                                <div className="results-placeholder">
                                    <BarChart size={50} />
                                    <p>Your analysis will appear here.</p>
                                </div>
                            )}
                            {analysisResult && (
                                <div className="results-container">
                                    <div className="score-gauge-wrapper">
                                        <h3>Overall Match Score</h3>
                                        <div className="score-gauge" style={{'--score': analysisResult.score}}>
                                            <div className="score-text">{analysisResult.score}%</div>
                                        </div>
                                    </div>
                                    <div className="feedback-card errors">
                                        <div className="feedback-header"><AlertTriangle className="icon" /><h4>Areas for Attention</h4></div>
                                        <ul>{analysisResult.errors.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                    </div>
                                    <div className="feedback-card improvements">
                                        <div className="feedback-header"><Lightbulb className="icon" /><h4>Suggested Improvements</h4></div>
                                        <ul>{analysisResult.improvements.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                    </div>
                                    <div className="feedback-card conclusions">
                                        <div className="feedback-header"><CheckCircle className="icon" /><h4>Expert Conclusion</h4></div>
                                        <p>{analysisResult.conclusions}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
           
    
    );
}
