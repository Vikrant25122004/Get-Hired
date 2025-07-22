import React, { useState, useEffect, useRef } from 'react';
import { Edit, Save, X, Plus, Trash2, MapPin, Briefcase, GraduationCap, Lightbulb, User, Phone, Mail, Link as LinkIcon, Award } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import "./Profile.css";

// Initial data structure for the profile
const initialProfileData = {
    profilePic: 'https://placehold.co/150x150/E2E8F0/4A5568?text=Loading...',
    name: '',
    phone: '',
    email: '',
    location: '',
    headline: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    awards: [],
};

// --- Reusable Components ---

const EditableField = ({ value, onSave, Icon }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleSave = () => {
        onSave(currentValue);
        setIsEditing(false);
    };

    return (
        <div className="editable-field">
            {Icon && <Icon size={20} className="icon" />}
            <div className="value-container">
                {isEditing ? (
                    <input 
                        type="text" 
                        value={currentValue} 
                        onChange={(e) => setCurrentValue(e.target.value)}
                        className="edit-input"
                    />
                ) : (
                    <p>{value || '...'}</p>
                )}
            </div>
            <div className="actions">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="btn-icon"><Save size={18} /></button>
                        <button onClick={() => setIsEditing(false)} className="btn-icon"><X size={18} /></button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="btn-icon"><Edit size={18} /></button>
                )}
            </div>
        </div>
    );
};

const ProfileSection = ({ title, children, Icon, onAdd }) => (
    <div className="profile-section">
        <div className="section-header">
            <div className="section-title">
                <Icon size={28} />
                <h2>{title}</h2>
            </div>
            {onAdd && <button className="btn-icon add-btn" onClick={onAdd}><Plus size={22} /></button>}
        </div>
        <div className="section-content">{children}</div>
    </div>
);

// --- Inline Form for Adding Experience ---
const AddExperienceForm = ({ onSave, onCancel }) => {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSaveClick = () => {
        if (!company || !position || !startDate || !endDate) {
            alert("Please fill out all fields.");
            return;
        }
        onSave({ company, position, startDate, endDate });
    };

    return (
        <div className="add-experience-form">
            <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />
            <input
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
            />
            <input
                type="text"
                placeholder="Start Date (e.g., 2021)"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="End Date (e.g., Present)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="form-actions">
                <button onClick={handleSaveClick} className="btn-primary">Save</button>
                <button onClick={onCancel} className="btn-secondary">Cancel</button>
            </div>
        </div>
    );
};

// --- Inline Form for Adding Education ---
const AddEducationForm = ({ onSave, onCancel }) => {
    const [institute, setInstitute] = useState('');
    const [degree, setDegree] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSaveClick = () => {
        if (!institute || !degree || !startDate || !endDate) {
            alert("Please fill out all fields.");
            return;
        }
        onSave({ institute, degree, startDate, endDate });
    };

    return (
        <div className="add-experience-form"> {/* Reusing the same form style */}
            <input
                type="text"
                placeholder="Institute Name"
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
            />
            <input
                type="text"
                placeholder="Degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
            />
            <input
                type="text"
                placeholder="Start Date (e.g., 2018)"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="End Date (e.g., 2022)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="form-actions">
                <button onClick={handleSaveClick} className="btn-primary">Save</button>
                <button onClick={onCancel} className="btn-secondary">Cancel</button>
            </div>
        </div>
    );
};


// --- Main Profile Page Component ---

export default function Profile() {
    const [profile, setProfile] = useState(initialProfileData);
    const [isAddingExperience, setIsAddingExperience] = useState(false);
    const [isAddingEducation, setIsAddingEducation] = useState(false);
    const fileInputRef = useRef(null);
    const API_BASE_URL = 'http://localhost:8080';

    const getAuthHeaders = () => {
        const token = Cookies.get('token');
        if (!token) {
            console.error("Authentication token not found.");
            return null;
        }
        return { 'Authorization': `Bearer ${token}` };
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            const headers = getAuthHeaders();
            if (!headers) return;

            // Fetch User Profile Data (name, email, etc.)
            try {
                const response = await axios.get(`${API_BASE_URL}/user/getuser`, { headers });
                const userData = response.data;
                setProfile(prev => ({
                    ...prev,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phonenumber, // Map backend 'phonenumber' to frontend 'phone'
                    location: userData.address, // Map backend 'address' to frontend 'location'
                }));
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }

            // Fetch Profile Picture
            try {
                const response = await axios.get(`${API_BASE_URL}/user/getpic`, {
                    headers,
                    responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(response.data);
                setProfile(prev => ({ ...prev, profilePic: imageUrl }));
            } catch (error) {
                console.error("Failed to fetch profile picture:", error);
                setProfile(prev => ({ ...prev, profilePic: 'https://placehold.co/150x150/EF4444/FFFFFF?text=Error' }));
            }

            // Fetch Experiences
            try {
                const response = await axios.get(`${API_BASE_URL}/user/getexp`, { headers });
                console.log("Fetched experiences:", response.data);
                setProfile(prev => ({ ...prev, experience: response.data || [] }));
            } catch (error) {
                console.error("Failed to fetch experiences:", error);
            }
            
            // Fetch Education
            try {
                const response = await axios.get(`${API_BASE_URL}/user/getedu`, { headers });
                console.log("Fetched education:", response.data);
                setProfile(prev => ({ ...prev, education: response.data || [] }));
            } catch (error) {
                console.error("Failed to fetch education:", error);
            }
        };
        
        fetchInitialData();
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const tempImageUrl = URL.createObjectURL(file);
        setProfile(prev => ({ ...prev, profilePic: tempImageUrl }));

        const formData = new FormData();
        formData.append('proficpic', file);

        const headers = getAuthHeaders();
        if (!headers) return;

        try {
            await axios.put(`${API_BASE_URL}/user/updatepic`, formData, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Profile picture updated successfully!");
        } catch (error) {
            console.error("Failed to upload profile picture:", error);
            alert("Failed to upload image. Please try again.");
        }
    };

    const handleUpdate = async (field, value) => {
        const oldProfileState = { ...profile };
        
        const updatedProfile = { ...profile, [field]: value };
        setProfile(updatedProfile);

        const headers = getAuthHeaders();
        if (!headers) return;

        const payload = {
            name: updatedProfile.name,
            email: updatedProfile.email,
            phonenumber: updatedProfile.phone,
            address: updatedProfile.location,
        };

        try {
            await axios.post(`${API_BASE_URL}/user/updateuser`, payload, {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            setProfile(oldProfileState);
            alert("Failed to update profile. Please try again.");
        }
    };
    
    // --- Function to add a new experience ---
    const handleAddExperience = async (newExperience) => {
        const headers = getAuthHeaders();
        if (!headers) return;

        const payload = {
            company: newExperience.company,
            position: newExperience.position,
            startdate: newExperience.startDate, // Use lowercase to match backend
            endDate: newExperience.endDate,
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/user/addexp`, payload, {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Experience added successfully!");
            setProfile(prev => ({
                ...prev,
                experience: [...prev.experience, response.data]
            }));
            setIsAddingExperience(false);
        } catch (error) {
            console.error("Failed to add experience:", error);
            alert("Failed to add experience. Please try again.");
        }
    };

    // --- Function to add new education ---
    const handleAddEducation = async (newEducation) => {
        const headers = getAuthHeaders();
        if (!headers) return;

        const payload = {
            institute: newEducation.institute,
            degree: newEducation.degree,
            startDate: newEducation.startDate,
            endDate: newEducation.endDate,
        };

        try {
            const response = await axios.put(`${API_BASE_URL}/user/addedu`, payload, {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Education added successfully!");
            console.log(newEducation);
            setProfile(prev => ({
                ...prev,
                education: [...prev.education, response.data]
            }));
            setIsAddingEducation(false);
        } catch (error) {
            console.error("Failed to add education:", error);
            alert("Failed to add education. Please try again.");
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        const updatedSkills = profile.skills.filter(skill => skill !== skillToRemove);
        setProfile(prev => ({ ...prev, skills: updatedSkills }));
    };

    return (
        <div className="profile-page-wrapper">
            <div className="main-content-area">
                <div className="container profile-layout">
                    {/* Left Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="sidebar-card">
                            <div className="profile-pic-wrapper">
                                <img src={profile.profilePic} alt="Profile" className="profile-pic" />
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/png, image/jpeg, image/gif"
                                />
                                <button className="upload-btn" onClick={handleUploadClick}>
                                    <Edit size={18}/>
                                </button>
                            </div>
                            <h1 className="profile-name">{profile.name}</h1>
                            <p className="profile-headline">{profile.headline}</p>

                            <div className="contact-info">
                                <EditableField value={profile.phone} onSave={(val) => handleUpdate('phone', val)} Icon={Phone} />
                                <EditableField value={profile.email} onSave={(val) => handleUpdate('email', val)} Icon={Mail} />
                                <EditableField value={profile.location} onSave={(val) => handleUpdate('location', val)} Icon={MapPin} />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="profile-main-content">
                        <ProfileSection title="Experience" Icon={Briefcase} onAdd={() => setIsAddingExperience(!isAddingExperience)}>
                            {isAddingExperience && (
                                <AddExperienceForm 
                                    onSave={handleAddExperience}
                                    onCancel={() => setIsAddingExperience(false)}
                                />
                            )}
                            {profile.experience.map((exp, index) => (
                                <div key={exp.id || index} className="content-card">
                                    <img src={exp.logo || `https://placehold.co/48x48/cccccc/FFFFFF?text=${exp.company.charAt(0)}`} alt={`${exp.company} logo`} className="card-logo" />
                                    <div className="card-details">
                                        <h3>{exp.position}</h3>
                                        <p>{exp.company}</p>
                                        <span>{`${exp.startdate} - ${exp.endDate}`}</span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn-icon"><Edit size={18} /></button>
                                        <button className="btn-icon"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </ProfileSection>

                        <ProfileSection title="Education" Icon={GraduationCap} onAdd={() => setIsAddingEducation(!isAddingEducation)}>
                            {isAddingEducation && (
                                <AddEducationForm
                                    onSave={handleAddEducation}
                                    onCancel={() => setIsAddingEducation(false)}
                                />
                            )}
                             {profile.education.map((edu, index) => (
                                <div key={edu.id || index} className="content-card">
                                    <div className="card-details">
                                        <h3>{edu.institute}</h3>
                                        <p>{edu.degree}</p>
                                        <span>{`${edu.startDate} - ${edu.endDate}`}</span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn-icon"><Edit size={18} /></button>
                                        <button className="btn-icon"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </ProfileSection>

                        <ProfileSection title="Awards & Certifications" Icon={Award}>
                             {profile.awards.map(award => (
                                <div key={award.id} className="content-card">
                                    <img src={award.logo} alt={`${award.name} logo`} className="card-logo" />
                                    <div className="card-details">
                                        <h3>{award.name}</h3>
                                        <p>{award.issuer}</p>
                                        <span>{award.year}</span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn-icon"><Edit size={18} /></button>
                                        <button className="btn-icon"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </ProfileSection>

                        <ProfileSection title="Projects" Icon={LinkIcon}>
                            {profile.projects.map(proj => (
                                <div key={proj.id} className="content-card project-card">
                                    <div className="card-details">
                                        <h3>{proj.name}</h3>
                                        <p>{proj.description}</p>
                                    </div>
                                     <div className="card-actions">
                                        <button className="btn-icon"><Edit size={18} /></button>
                                        <button className="btn-icon"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </ProfileSection>

                        <ProfileSection title="Skills" Icon={Lightbulb}>
                            <div className="skills-container">
                                {profile.skills.map(skill => (
                                    <div key={skill} className="skill-tag">
                                        <span>{skill}</span>
                                        <button onClick={() => handleSkillRemove(skill)} className="remove-skill-btn">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </ProfileSection>
                    </main>
                </div>
            </div>
        </div>
    );
}
