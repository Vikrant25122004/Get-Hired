import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
    UploadCloud,
    FileText,
    AlertTriangle,
    CheckCircle,
    Lightbulb,
    BarChart,
    Star,
    User,
    Loader,
    XCircle,
    RotateCcw,
} from 'lucide-react';
import "./ResumeScorePage.css";
// import Footer from './Footer';

const pdfjsLib = window.pdfjsLib;
if (pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

// --- Modified ResumeScore Component for Circular Display ---
const ResumeScore = ({ score }) => {
    const radius = 60; // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (score / 100) * circumference;

    return (
        <div className="dashboard-card highlight-card resume-score-card">
            <div className="card-header">
                <Star size={28} />
                <span>Resume Score</span>
            </div>
            <div className="score-circle-container">
                <svg className="score-circle" width="140" height="140" viewBox="0 0 140 140">
                    <circle
                        className="score-circle-track"
                        cx="70"
                        cy="70"
                        r={radius}
                        strokeWidth="12"
                    ></circle>
                    <circle
                        className="score-circle-progress"
                        cx="70"
                        cy="70"
                        r={radius}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                    ></circle>
                </svg>
                <div className="score-value-overlay">
                    <span className="score-value">{score ?? "--"}</span>
                    <span className="score-label">/ 100</span>
                </div>
            </div>
        </div>
    );
};

// --- Other Result Card Components (no functional changes, just for structure) ---
const GrammaticalErrors = ({ errors }) => (
    <div className="dashboard-card error-card">
        <div className="card-header">
            <AlertTriangle size={24} />
            <span>Grammatical Issues</span>
        </div>
        <div className="card-content">{errors || "No data."}</div>
        <div className="card-chart-placeholder errors-chart"></div>
    </div>
);

const StylingRecommendations = ({ styling }) => (
    <div className="dashboard-card style-card">
        <div className="card-header">
            <Lightbulb size={24} />
            <span>Styling Tips</span>
        </div>
        <div className="card-content">{styling || "No data."}</div>
    </div>
);

const KeyImprovements = ({ improvements }) => (
    <div className="dashboard-card improve-card">
        <div className="card-header">
            <BarChart size={24} />
            <span>Key Improvements</span>
        </div>
        <div className="card-content">{improvements || "No data."}</div>
        <div className="card-chart-placeholder improvements-chart"></div>
    </div>
);

const Conclusions = ({ conclusion }) => (
    <div className="dashboard-card success-card">
        <div className="card-header">
            <CheckCircle size={24} />
            <span>Conclusions</span>
        </div>
        <div className="card-content">{conclusion || "No data."}</div>
    </div>
);

const Strengths = ({ strengths }) => (
    <div className="dashboard-card strengths-card">
        <div className="card-header">
            <User size={24} />
            <span>Strengths</span>
        </div>
        <div className="card-content">{strengths || "No data."}</div>
    </div>
);

// --- LoadingPrompt component with animated dots ---
const LoadingPrompt = ({ text }) => {
    const [dots, setDots] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-prompt" aria-live="polite" aria-atomic="true">
            <Loader size={40} className="loading-icon" />
            <p>{text}{dots}</p>
        </div>
    );
};

// --- Main ResumeScorerPage Component ---
export default function ResumeScorerPage() {
    // Input states
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    // Result states
    const [resumeScore, setResumeScore] = useState(null);
    const [grammaticalErrors, setGrammaticalErrors] = useState(null);
    const [stylingRecommendations, setStylingRecommendations] = useState(null);
    const [keyImprovements, setKeyImprovements] = useState(null);
    const [conclusions, setConclusions] = useState(null);
    const [strengths, setStrengths] = useState(null);

    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStepIndex, setLoadingStepIndex] = useState(-1);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);
    const dragActive = useRef(false);

    const loadingSteps = [
        "Calculating Resume Score",
        "Checking Grammatical Errors",
        "Generating Styling Recommendations",
        "Analyzing Key Improvements",
        "Drawing Conclusions",
        "Evaluating Strengths",
    ];

    // PDF text extraction for preview
    const processPDF = useCallback(async (file) => {
        if (!pdfjsLib) {
            
            return;
        }
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
            let extractedText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                extractedText += textContent.items.map(item => item.str).join(' ') + '\n';
            }
            setResumeText(extractedText);
            setError("");
        } catch (err) {
            console.error("Error reading PDF:", err);
            setError("Could not read the PDF file. It might be corrupted or protected.");
            setResumeFile(null);
            setResumeText("");
        }
    }, []);

    // File change handler
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            setError("Please upload a valid PDF file.");
            setResumeFile(null);
            setResumeText("");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            setResumeFile(null);
            setResumeText("");
            return;
        }
        setResumeFile(file);
        setError("");
        resetResults();
        await processPDF(file);
    };

    // Reset all response states
    const resetResults = () => {
        setResumeScore(null);
        setGrammaticalErrors(null);
        setStylingRecommendations(null);
        setKeyImprovements(null);
        setConclusions(null);
        setStrengths(null);
        setError("");
        setLoadingStepIndex(-1);
    };

    // Drag & drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        if (!dragActive.current) dragActive.current = true;
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        dragActive.current = false;
    };
    const handleDrop = async (e) => {
        e.preventDefault();
        dragActive.current = false;
        const files = e.dataTransfer.files;
        if (files.length === 0) return;
        const file = files[0];
        if (file.type !== "application/pdf") {
            setError("Please upload a valid PDF file.");
            setResumeFile(null);
            setResumeText("");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            setResumeFile(null);
            setResumeText("");
            return;
        }
        setResumeFile(file);
        setError("");
        resetResults();
        await processPDF(file);
    };

    // Send POST request and return text response
    const postAnalysis = async (endpoint, formData, token) => {
        let retryCount = 0;
        const maxRetries = 5;
        const initialDelay = 1000;

        while (retryCount < maxRetries) {
            try {
                const response = await fetch(`http://localhost:8080${endpoint}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    return response.text();
                } else if (response.status === 429 || response.status >= 500) {
                    const delay = initialDelay * Math.pow(2, retryCount) + Math.random() * 500;
                    console.warn(`Retrying ${endpoint} due to status ${response.status}. Retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retryCount++;
                } else {
                    let errMsg = `Error at ${endpoint}: ${response.status} ${response.statusText}`;
                    try {
                        const errorJson = await response.json();
                        if (errorJson.message) errMsg = errorJson.message;
                    } catch { /* ignored */ }
                    throw new Error(errMsg);
                }
            } catch (err) {
                if (retryCount < maxRetries - 1) {
                    const delay = initialDelay * Math.pow(2, retryCount) + Math.random() * 500;
                    console.warn(`Retrying ${endpoint} due to network error. Retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retryCount++;
                } else {
                    throw err;
                }
            }
        }
        throw new Error(`Failed to fetch from ${endpoint} after ${maxRetries} retries.`);
    };

    // Main analyze function with stepwise loading prompt updates
    const handleAnalyze = async () => {
        if (!resumeFile || !jobDescription.trim()) {
            setError("Please upload a resume and provide a job description.");
            return;
        }
        setError("");
        setIsLoading(true);
        setLoadingStepIndex(0);
        resetResults();

        const token = Cookies.get("token");
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("pdf", resumeFile);
        formData.append("jobdesc", jobDescription);

        try {
            setLoadingStepIndex(0);
            const score = await postAnalysis('/user/getresumescore', formData, token);
            setResumeScore(parseFloat(score));

            setLoadingStepIndex(1);
            const grammatical = await postAnalysis('/user/getgramatical', formData, token);
            setGrammaticalErrors(grammatical);

            setLoadingStepIndex(2);
            const styling = await postAnalysis('/user/getstyling', formData, token);
            setStylingRecommendations(styling);

            setLoadingStepIndex(3);
            const improvements = await postAnalysis('/user/getimprove', formData, token);
            setKeyImprovements(improvements);

            setLoadingStepIndex(4);
            const conclusion = await postAnalysis('/user/getconclusions', formData, token);
            setConclusions(conclusion);

            setLoadingStepIndex(5);
            const strength = await postAnalysis('/user/getstrength', formData, token);
            setStrengths(strength);

            setLoadingStepIndex(-1);
        } catch (err) {
            console.error("Analysis error:", err);
            setError(err.message || "Failed to get full analysis from server.");
            setLoadingStepIndex(-1);
        } finally {
            setIsLoading(false);
        }
    };

    const hasResults = resumeScore !== null || grammaticalErrors !== null || stylingRecommendations !== null ||
                         keyImprovements !== null || conclusions !== null || strengths !== null;

    const handleNewAnalysis = () => {
        resetResults();
        setResumeFile(null);
        setResumeText("");
        setJobDescription("");
    };

    return (
        <>
            <main className="container scorer-container" role="main" aria-label="AI Resume Analyzer Dashboard">
                <section className="scorer-header">
                    <h1 tabIndex={0}>AI Resume Analyzer</h1>
                    <p tabIndex={0}>Get an instant, data-driven analysis of your resume against any job description to maximize your chances of landing an interview.</p>
                </section>

                <section className="main-content-area">
                    {isLoading ? (
                        <div className="loading-overlay" aria-live="assertive" aria-busy="true">
                            <LoadingPrompt text={loadingSteps[loadingStepIndex]} />
                            <div className="spinner-container">
                                <div className="spinner"></div>
                            </div>
                            {error && (
                                <p role="alert" className="error-message loading-error-message">
                                    <XCircle size={20} style={{ marginRight: '8px' }} /> {error}
                                </p>
                            )}
                        </div>
                    ) : hasResults ? (
                        /* Analysis Results Dashboard */
                        <>
                            <div className="dashboard-controls">
                                <button className="reset-button" onClick={handleNewAnalysis}>
                                    <RotateCcw size={20} style={{marginRight: '8px'}} /> New Analysis
                                </button>
                            </div>

                            {/* Top Section: Resume Score Circle & Strengths */}
                            <section className="results-summary" aria-live="polite" aria-atomic="true">
                                {resumeScore !== null && <ResumeScore score={resumeScore} />}
                                {strengths && <Strengths strengths={strengths} />}
                            </section>

                            {/* New Section 1: Grammatical Issues & Styling Tips */}
                            { (grammaticalErrors || stylingRecommendations) && ( // Render only if at least one has data
                                <section className="analysis-group analysis-group-top" aria-live="polite" aria-atomic="true">
                                    {grammaticalErrors && <GrammaticalErrors errors={grammaticalErrors} />}
                                    {stylingRecommendations && <StylingRecommendations styling={stylingRecommendations} />}
                                </section>
                            )}

                            {/* New Section 2: Key Improvements & Conclusions */}
                            { (keyImprovements || conclusions) && ( // Render only if at least one has data
                                <section className="analysis-group analysis-group-bottom" aria-live="polite" aria-atomic="true">
                                    {keyImprovements && <KeyImprovements improvements={keyImprovements} />}
                                    {conclusions && <Conclusions conclusion={conclusions} />}
                                </section>
                            )}
                        </>
                    ) : (
                        /* Input Section */
                        <section className="input-section" aria-label="Resume and job description input section">
                            <div className="input-card upload-group">
                                <h3 className="card-title">Upload Your Resume</h3>
                                <div
                                    className={`upload-box ${dragActive.current ? 'drag-active' : ''}`}
                                    tabIndex={0}
                                    role="button"
                                    aria-label="Click or drag and drop to upload resume PDF"
                                    onKeyDown={e => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <UploadCloud size={30} aria-hidden="true" />
                                    <p><strong>Click to upload or drag and drop</strong></p>
                                    <span>PDF only, max 5MB</span>
                                    <input
                                        ref={fileInputRef}
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        aria-describedby="file-upload-instructions"
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                {resumeFile && <div className="file-name" aria-live="polite" aria-atomic="true">{resumeFile.name}</div>}
                                {resumeText && (
                                    <div className="resume-content-display" aria-label="Preview of extracted resume content">
                                        <FileText size={18} aria-hidden="true" />&nbsp;
                                        <strong>Resume Content Preview:</strong><br />
                                        <p tabIndex={0} aria-describedby="resume-extract-desc">{resumeText.substring(0, 400)}...</p>
                                    </div>
                                )}
                            </div>

                            <div className="input-card job-desc-group">
                                <h3 className="card-title">Paste Job Description</h3>
                                <textarea
                                    className="jd-textarea"
                                    placeholder="Paste the full job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    rows={12}
                                    aria-label="Job description input"
                                />
                            </div>

                            <div className="action-area">
                                <button
                                    className="analyze-button"
                                    onClick={handleAnalyze}
                                    disabled={isLoading || !resumeFile || !jobDescription.trim()}
                                    aria-disabled={isLoading || !resumeFile || !jobDescription.trim()}
                                    aria-busy={isLoading}
                                >
                                    {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
                                </button>
                                {error && (
                                    <p role="alert" className="error-message">
                                        <XCircle size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> {error}
                                    </p>
                                )}
                            </div>
                        </section>
                    )}
                </section>
            </main>
            {/* <Footer /> */}
        </>
    );
}