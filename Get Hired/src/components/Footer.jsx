import { Edit, Save, X, Plus, Trash2, MapPin, Briefcase, GraduationCap, Lightbulb, User, Phone, Mail, Link as LinkIcon, LogOut, LayoutDashboard, Star, Menu, Linkedin, Award, Twitter, Github } from 'lucide-react';
import "./Profile.css"

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer-grid">
                <div className="footer-about">
                    <h3>Get Hired</h3>
                    <p>Your one-stop platform to accelerate your career, from job discovery to professional growth.</p>
                </div>
                <div className="footer-links">
                    <h4>Product</h4>
                    <ul>
                        <li><a href="#">Profile</a></li>
                        <li><a href="#">Resume Score</a></li>
                        <li><a href="#">Dashboard</a></li>
                        <li><a href="#">Pricing</a></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Get Hired. All Rights Reserved.</p>
                <div className="footer-socials">
                    <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                    <a href="#" aria-label="Github"><Github size={20} /></a>
                    <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                </div>
            </div>
        </div>
    </footer>
);
export default Footer;
