import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; // import useNavigate for navigation
import { Edit, Save, X, Plus, Trash2, MapPin, Briefcase, GraduationCap, Lightbulb, User, Phone, Mail, Link as LinkIcon, LogOut, LayoutDashboard, Star, Menu, Linkedin, Award, Twitter, Github } from 'lucide-react';
import Cookies from 'js-cookie'; // import js-cookie for cookie manipulation
import "./Profile.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();    // initialize navigate

    const navLinks = [
        { name: 'Profile', to: '/home', icon: User },
        { name: 'Resume Score', to: '/home/resume-dashboard', icon: Star },
        { name: 'LinkedIn Jobs', to: '/home/linkedin-jobs', icon: Linkedin },
        { name: 'Growth Analysis', to :'/home/growthanalysis',icon: LayoutDashboard}
    ];

    // Logout handler
    const handleLogout = () => {
        Cookies.remove('token');  // remove token cookie
        navigate('/');            // redirect to home/login page
    };

    return (
        <header className="navbar-header">
            <div className="container navbar-container">
                <NavLink to="/" className="logo">
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
                            end={link.to === '/home'}
                        >
                            <link.icon size={20} />
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                    {/* Replaced NavLink with button for logout */}
                    <button onClick={handleLogout} className="nav-link logout" type="button" style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
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
                        end={link.to === '/home'}
                    >
                        <link.icon size={20} />
                        <span>{link.name}</span>
                    </NavLink>
                ))}
                {/* Mobile logout button */}
                <button onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                }} className="nav-link logout" type="button" style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </nav>
            <main className="content-area">
                <Outlet />
            </main>
        </header>
    );
};

export default Navbar;
