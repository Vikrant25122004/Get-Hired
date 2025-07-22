import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom'; // Import NavLink
import { Edit, Save, X, Plus, Trash2, MapPin, Briefcase, GraduationCap, Lightbulb, User, Phone, Mail, Link as LinkIcon, LogOut, LayoutDashboard, Star, Menu, Linkedin, Award, Twitter, Github } from 'lucide-react';
import "./Profile.css"; // Assuming Profile.css contains styles for Navbar as well

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Profile', to: '/home', icon: User }, // Link to the /home route, which renders Profile by default
        { name: 'Resume Score', to: '/home/resume-dashboard', icon: Star }, // Link to the resume dashboard (relative to /home)
        { name: 'Naukri Jobs', to: '/naukri-jobs', icon: Briefcase },
        { name: 'LinkedIn Jobs', to: '/home/linkedin-jobs', icon: Linkedin },
    ];

    return (
        <header className="navbar-header">
            <div className="container navbar-container">
                <NavLink to="/" className="logo"> {/* NavLink for logo, if it should also have active state */}
                    Get Hired
                </NavLink>
                <nav className="desktop-nav">
                    {navLinks.map(link => (
                        <NavLink
                            to={link.to}
                            key={link.name}
                            className={({ isActive }) =>
                                isActive ? 'nav-link-active-link' : 'nav-link'
                            }
                            // Add the 'end' prop specifically for the 'Profile' link
                            // This ensures it's active ONLY when the path is exactly '/home'
                            end={link.to === '/home'}
                        >
                            <link.icon size={20} />
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                    <NavLink to="/logout" className="nav-link logout"> {/* NavLink for logout */}
                        <LogOut size={20} />
                        <span>Logout</span>
                    </NavLink>
                </nav>
                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            {/* Mobile Navigation Menu */}
            <nav className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
                {navLinks.map(link => (
                    <NavLink
                        to={link.to}
                        key={link.name}
                        className={({ isActive }) =>
                            isActive ? 'nav-link active-link' : 'nav-link'
                        }
                        onClick={() => setIsMenuOpen(false)}
                        // Add the 'end' prop for mobile menu as well
                        end={link.to === '/home'}
                    >
                        <link.icon size={20} />
                        <span>{link.name}</span>
                    </NavLink>
                ))}
                <NavLink to="/logout" className="nav-link logout" onClick={() => setIsMenuOpen(false)}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </NavLink>
            </nav>
            <main className="content-area">
                <Outlet />
            </main>
        </header>
    );
};

export default Navbar;
