import React from 'react'
import  { useState, useEffect } from 'react';
import { Briefcase, FileText, BarChart, Zap, ChevronRight, Menu, X, Twitter, Github, Linkedin, CheckCircle2 } from 'lucide-react';
import "./Landing.css"
const Landing = () => {
  
   
      const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Effect to handle body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);
    return (
        <>
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <a href="#" className="logo">Get Hired</a>
                        <nav className="nav-desktop">
                            <a href="#features">Features</a>
                            <a href="#dashboard">Dashboard</a>
                            <a href="#testimonials">Testimonials</a>
                            <a href="#pricing">Pricing</a>
                        </nav>
                        <div className="header-actions">
                            <a href="/login" className="btn btn-link">Log In</a>
                            <a href="/login" className="btn btn-primary">Sign Up</a>
                        </div>
                        <button 
                            className="mobile-menu-button" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
                <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                    <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
                    <a href="#dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</a>
                    <a href="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
                    <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                    <div className="divider">
                        <a href="#" onClick={() => setIsMenuOpen(false)}>Log In</a>
                        <a href="#" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Sign Up</a>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="hero">
                    <div className="container">
                        <h1 className="hero-title">
                            Your Entire Job Search, <br />
                            <span className="highlight">Unified and Amplified.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Aggregate job listings, analyze your resume, and track your career growth—all in one intelligent dashboard.
                        </p>
                        <div className="hero-actions">
                            <a href="#" className="btn-hero btn-hero-primary">
                                Get Started for Free
                                <ChevronRight style={{ marginLeft: '0.5rem' }} />
                            </a>
                            <a href="#features" className="btn-hero btn-hero-secondary">
                                Learn More
                            </a>
                        </div>
                    </div>
                    <div className="hero-fade"></div>
                </section>

                {/* Features Section */}
                <section id="features">
                    <div className="container">
                        <h2 className="section-title">The Ultimate Toolkit for Job Seekers</h2>
                        <p className="section-subtitle">Everything you need to land your dream job, faster.</p>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon"><Briefcase style={{ color: 'var(--blue-600)' }} /></div>
                                <h3>Unified Job Aggregator</h3>
                                <p>Access millions of jobs from top platforms in one centralized feed. No more tab-hopping.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon"><FileText style={{ color: 'var(--green-600)' }} /></div>
                                <h3>AI Resume Scorer</h3>
                                <p>Get an instant, AI-powered score on your resume. Pinpoint weaknesses and get actionable advice to beat the ATS.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon"><BarChart style={{ color: 'var(--purple-600)' }} /></div>
                                <h3>Career Dashboard</h3>
                                <p>Visualize your career trajectory with insightful charts. Track applications, interview rates, and skill growth.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon"><Zap style={{ color: 'var(--yellow-500)' }} /></div>
                                <h3>Smart Recommendations</h3>
                                <p>Receive intelligent suggestions to enhance your resume, cover letter, and interview skills, tailored just for you.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dashboard Preview Section */}
                <section id="dashboard">
                    <div className="container">
                        <h2 className="section-title">Your Professional Command Center</h2>
                        <p className="section-subtitle">Gain a bird's-eye view of your career progress.</p>
                        <div className="dashboard-preview-container">
                            <div className="dashboard-preview-content">
                                <img src="https://placehold.co/1200x675/E2E8F0/4A5568?text=Professional+Dashboard+UI" alt="Dashboard Preview" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x675/E2E8F0/4A5568?text=Dashboard+Preview'; }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials">
                    <div className="container">
                        <h2 className="section-title">Trusted by Professionals Worldwide</h2>
                        <p className="section-subtitle">See how Get Hired has transformed careers.</p>
                        <div className="testimonials-grid">
                            <div className="testimonial-card">
                                <p className="quote">"Get Hired was a game-changer. The resume scorer helped me get 3x more interviews, and I landed my dream job at a FAANG company."</p>
                                <div className="testimonial-author">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Sarah J." onError={(e) => { e.target.onerror = null; e.target.src='https://i.pravatar.cc/150'; }} />
                                    <div>
                                        <p className="name">Sarah J.</p>
                                        <p className="title">Senior Software Engineer, TechCorp</p>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <p className="quote">"The dashboard is incredible for staying organized. I could finally see my progress clearly, which kept me motivated throughout my search."</p>
                                <div className="testimonial-author">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Michael B." onError={(e) => { e.target.onerror = null; e.target.src='https://i.pravatar.cc/150'; }} />
                                    <div>
                                        <p className="name">Michael B.</p>
                                        <p className="title">Product Manager, Innovate Inc.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <p className="quote">"As a recent graduate, the AI recommendations were invaluable. It felt like having a personal career coach guiding me every step of the way."</p>
                                <div className="testimonial-author">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704f" alt="Emily C." onError={(e) => { e.target.onerror = null; e.target.src='https://i.pravatar.cc/150'; }} />
                                    <div>
                                        <p className="name">Emily C.</p>
                                        <p className="title">Marketing Associate, Growth Solutions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing">
                    <div className="container">
                        <h2 className="section-title">Find the Perfect Plan</h2>
                        <p className="section-subtitle">Start for free, and upgrade when you're ready to accelerate your search.</p>
                        <div className="pricing-grid">
                            <div className="pricing-card">
                                <h3>Free</h3>
                                <div className="price">
                                    <span className="amount">$0</span>
                                    <span className="period">/month</span>
                                </div>
                                <ul className="features-list">
                                    <li><CheckCircle2 className="icon" /><span>Basic Job Search</span></li>
                                    <li><CheckCircle2 className="icon" /><span>10 Resume Scans/month</span></li>
                                    <li><CheckCircle2 className="icon" /><span>Limited Dashboard</span></li>
                                    <li><CheckCircle2 className="icon" /><span>Email Support</span></li>
                                </ul>
                                <a href="#" className="btn btn-secondary">Get Started</a>
                            </div>
                            <div className="pricing-card popular">
                                <span className="popular-badge">Most Popular</span>
                                <h3>Pro</h3>
                                <div className="price">
                                    <span className="amount">$15</span>
                                    <span className="period">/month</span>
                                </div>
                                <ul className="features-list">
                                    <li><CheckCircle2 className="icon" /><span>Everything in Free, plus:</span></li>
                                    <li><CheckCircle2 className="icon" /><span>Unlimited Resume Scans</span></li>
                                    <li><CheckCircle2 className="icon" /><span>Advanced Career Dashboard</span></li>
                                    <li><CheckCircle2 className="icon" /><span>AI-Powered Recommendations</span></li>
                                    <li><CheckCircle2 className="icon" /><span>Priority Support</span></li>
                                </ul>
                                <a href="#" className="btn btn-primary">Go Pro</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <h2>Ready to Take Control of Your Career?</h2>
                        <p>Join thousands of successful professionals and land your next role with confidence.</p>
                        <a href="#" className="btn">Sign Up Now</a>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-about">
                            <h3>Get Hired</h3>
                            <p>Our mission is to empower job seekers with the tools and insights they need to build a successful career.</p>
                        </div>
                        <div>
                            <h4>Product</h4>
                            <ul>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#pricing">Pricing</a></li>
                                <li><a href="#dashboard">Dashboard</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Get Hired. All rights reserved.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Twitter"><Twitter /></a>
                            <a href="#" aria-label="Github"><Github /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );

}

export default Landing
