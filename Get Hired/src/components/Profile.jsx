import React, { useState, useEffect, useRef } from "react";
import {
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  MapPin,
  Briefcase,
  GraduationCap,
  Lightbulb,
  User,
  Phone,
  Mail,
  Link as LinkIcon,
  Award,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Profile.css";

const initialProfileData = {
  profilePic:
    "https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
  name: "Add your name",
  phone: "Add your Phone number",
  email: "",
  location: "",
  headline: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  awards: [],
};

const EditableField = ({ value, onSave, Icon }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = () => {
    if (currentValue !== value) onSave(currentValue);
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
          <p>{value || "..."}</p>
        )}
      </div>
      <div className="actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn-icon">
              <Save size={18} />
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-icon">
              <X size={18} />
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn-icon">
            <Edit size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

const ProfileSection = ({ title, children, Icon, onAdd, extraHeaderButtons }) => (
  <div className="profile-section">
    <div
      className="section-header"
      style={{ display: "flex", alignItems: "center" }}
    >
      <div
        className="section-title"
        style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
      >
        <Icon size={28} />
        <h2>{title}</h2>
      </div>
      <div
        style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        {extraHeaderButtons}
        {onAdd && (
          <button className="btn-icon add-btn" onClick={onAdd}>
            <Plus size={22} />
          </button>
        )}
      </div>
    </div>
    <div className="section-content">{children}</div>
  </div>
);

const AddExperienceForm = ({ onSave, onCancel }) => {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
        <button onClick={handleSaveClick} className="btn-primary">
          Save
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

const AddEducationForm = ({ onSave, onCancel }) => {
  const [institute, setInstitute] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSaveClick = () => {
    if (!institute || !degree || !startDate || !endDate) {
      alert("Please fill out all fields.");
      return;
    }
    onSave({ institute, degree, startDate, endDate });
  };

  return (
    <div className="add-experience-form">
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
        <button onClick={handleSaveClick} className="btn-primary">
          Save
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

// Helper to create PDF object URL from base64
const getPdfUrl = (pdfbyte, pdftype) => {
  if (!pdfbyte) return null;

  let base64String = pdfbyte;
  if (base64String.startsWith("data:")) {
    base64String = base64String.split(",")[1];
  }

  const byteCharacters = window.atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: pdftype || "application/pdf" });
  return URL.createObjectURL(blob);
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfileData);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [showAddAwardModal, setShowAddAwardModal] = useState(false);
  const [awardForm, setAwardForm] = useState({
    course: "",
    organisation: "",
    rank: "",
    pdfFile: null,
  });
  const [uploadingAward, setUploadingAward] = useState(false);
  const fileInputRef = useRef(null);
  const API_BASE_URL = "http://localhost:8080";

  const getAuthHeaders = () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Authentication token not found.");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  /** Fetch Awards from backend */
  const fetchAwards = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/user/getcert`, {
        headers,
      });
      const data = response.data;
      setProfile((prev) => ({ ...prev, awards: data || [] }));
    } catch (err) {
      console.error("Failed to fetch awards and certifications:", err);
    }
  };

  /** Fetch Skills from backend */
  const fetchSkills = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/user/getskills`, {
        headers,
      });
      const skillData = response.data;
      setProfile((prev) => ({
        ...prev,
        skills: Array.isArray(skillData)
          ? skillData
          : skillData?.skills || [],
      }));
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  /** Fetch education and experience from backend */
  const fetchExperience = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/user/getexp`, {
        headers,
      });
      const data = response.data;
      setProfile((prev) => ({
        ...prev,
        experience: Array.isArray(data) && data.length ? data : initialProfileData.experience,
      }));
    } catch {
      setProfile((prev) => ({
        ...prev,
        experience: initialProfileData.experience,
      }));
    }
  };

  const fetchEducation = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/user/getedu`, {
        headers,
      });
      const data = response.data;
      setProfile((prev) => ({
        ...prev,
        education: Array.isArray(data) && data.length ? data : initialProfileData.education,
      }));
    } catch {
      setProfile((prev) => ({
        ...prev,
        education: initialProfileData.education,
      }));
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const headers = getAuthHeaders();
      if (!headers) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/user/getuser`, { headers });
        const userData = res.data;
        setProfile((prev) => ({
          ...prev,
          name: userData.name || initialProfileData.name,
          email: userData.email || initialProfileData.email,
          phone: userData.phonenumber || initialProfileData.phone,
          location: userData.address || initialProfileData.location,
          headline: userData.headline || initialProfileData.headline,
        }));
      } catch {
        setProfile(initialProfileData);
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/user/getpic`, {
          headers,
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(res.data);
        setProfile((prev) => ({
          ...prev,
          profilePic: imageUrl || initialProfileData.profilePic,
        }));
      } catch {
        setProfile((prev) => ({ ...prev, profilePic: initialProfileData.profilePic }));
      }

      await fetchExperience();
      await fetchEducation();

      await fetchAwards();
      await fetchSkills();

      // You can add fetch for projects too similarly if needed
    };

    fetchInitialData();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, profilePic: url }));

    const formData = new FormData();
    formData.append("proficpic", file);
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      await axios.put(`${API_BASE_URL}/user/updatepic`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
    } catch {
      alert("Failed to upload profile pic");
    }
  };

  const updateField = async (field, value) => {
    const oldValue = profile[field];
    setProfile((prev) => ({ ...prev, [field]: value }));
    const headers = getAuthHeaders();
    if (!headers) return;

    let payload = {};
    if (field === "location") payload = { address: value };
    else if (field === "phone") payload = { phonenumber: value };
    else payload = { [field]: value };

    try {
      await axios.put(`${API_BASE_URL}/user/updateuser`, payload, {
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch {
      setProfile((prev) => ({ ...prev, [field]: oldValue }));
      alert(`Failed to update ${field}`);
    }
  };

  const handleUpdateName = (val) => updateField("name", val);
  const handleUpdateEmail = (val) => updateField("email", val);
  const handleUpdateAddress = (val) => updateField("location", val);
  const handleUpdatePhone = (val) => updateField("phone", val);

  const handleAddExperience = async (newExperience) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const resp = await axios.post(`${API_BASE_URL}/user/addexp`, newExperience, {
        headers,
      });
      setProfile((prev) => ({
        ...prev,
        experience: [...prev.experience, resp.data],
      }));
      setIsAddingExperience(false);
    } catch {
      alert("Failed to add experience");
    }
  };

  const handleAddEducation = async (newEducation) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const resp = await axios.put(`${API_BASE_URL}/user/addedu`, newEducation, {
        headers,
      });
      setProfile((prev) => ({
        ...prev,
        education: [...prev.education, resp.data],
      }));
       await fetchEducation(); 
      setIsAddingEducation(false);
    } catch {
      alert("Failed to add education");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    const filtered = profile.skills.filter((skill) => skill !== skillToRemove);
    setProfile((prev) => ({ ...prev, skills: filtered }));
  };

  const handleAwardInputChange = (e) => {
    const { name, value } = e.target;
    setAwardForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAwardFileChange = (e) => {
    setAwardForm((prev) => ({ ...prev, pdfFile: e.target.files[0] }));
  };

  const submitAward = async () => {
    if (!awardForm.pdfFile || !awardForm.course || !awardForm.organisation) {
      alert("Fill in all required fields and provide PDF");
      return;
    }
    const formData = new FormData();
    formData.append(
      "awardsandCertification",
      new Blob(
        [
          JSON.stringify({
            course: awardForm.course,
            organisation: awardForm.organisation,
            rank: awardForm.rank,
          }),
        ],
        { type: "application/json" }
      )
    );
    formData.append("pdFile", awardForm.pdfFile);

    const headers = getAuthHeaders();
    if (!headers) return;

    setUploadingAward(true);
    try {
      await axios.post(`${API_BASE_URL}/user/addawardsandcert`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      alert("Award added!");
      setShowAddAwardModal(false);
      setAwardForm({ course: "", organisation: "", rank: "", pdfFile: null });
      await fetchAwards();
    } catch {
      alert("Failed to add award");
    }
    setUploadingAward(false);
  };

  // ADDED: Skills Modal related states and handlers:
  const [showAddSkillsModal, setShowAddSkillsModal] = useState(false);
  const [newSkillsInput, setNewSkillsInput] = useState("");
  const [addingSkills, setAddingSkills] = useState(false);

  const handleSkillsInputChange = (e) => {
    setNewSkillsInput(e.target.value);
  };

  const submitSkills = async () => {
    if (!newSkillsInput.trim()) {
      alert("Enter at least one skill");
      return;
    }
    const skillArray = newSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!skillArray.length) {
      alert("Enter valid skills");
      return;
    }
    const headers = getAuthHeaders();
    if (!headers) return;
    setAddingSkills(true);
    try {
      const token = Cookies.get('token');
      await axios.post(`${API_BASE_URL}/user/addskills`, skillArray, {

        headers: { ...headers, "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
         },
      });
      alert("Skills added!");
      setShowAddSkillsModal(false);
      setNewSkillsInput("");
      await fetchSkills();
    } catch (e) {
      alert("Failed to add skills");
    }
    setAddingSkills(false);
  };

  return (
    <div className="profile-page-wrapper">
      <div className="main-content-area">
        <div className="container profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="sidebar-card">
              <div className="profile-pic-wrapper">
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="profile-pic"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg, image/gif"
                />
                <button className="upload-btn" onClick={handleUploadClick}>
                  <Edit size={18} />
                </button>
              </div>

              <EditableField
                value={profile.name}
                onSave={handleUpdateName}
                Icon={User}
              />
              <p className="profile-headline">{profile.headline}</p>

              <div className="contact-info">
                <EditableField
                  value={profile.phone}
                  onSave={handleUpdatePhone}
                  Icon={Phone}
                />
                <EditableField
                  value={profile.email}
                  onSave={handleUpdateEmail}
                  Icon={Mail}
                />
                <EditableField
                  value={profile.location}
                  onSave={handleUpdateAddress}
                  Icon={MapPin}
                />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="profile-main-content">
            {/* Experience */}
            <ProfileSection
              title="Experience"
              Icon={Briefcase}
              onAdd={() => setIsAddingExperience(!isAddingExperience)}
            >
              {isAddingExperience && (
                <AddExperienceForm
                  onSave={handleAddExperience}
                  onCancel={() => setIsAddingExperience(false)}
                />
              )}
              {profile.experience.map((exp, i) => (
                <div key={exp.id || i} className="content-card">
                  <img
                    src={
                      exp.logo ||
                      `https://placehold.co/48x48/cccccc/FFFFFF?text=${
                        exp.company ? exp.company.charAt(0) : ""
                      }`
                    }
                    alt={`${exp.company} logo`}
                    className="card-logo"
                  />
                  <div className="card-details">
                    <h3>{exp.position}</h3>
                    <p>{exp.company}</p>
                    <span>
                      {exp.startdate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button className="btn-icon">
                      <Edit size={18} />
                    </button>
                    <button className="btn-icon">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </ProfileSection>

            {/* Education */}
            <ProfileSection
              title="Education"
              Icon={GraduationCap}
              onAdd={() => setIsAddingEducation(!isAddingEducation)}
            >
              {isAddingEducation && (
                <AddEducationForm
                  onSave={handleAddEducation}
                  onCancel={() => setIsAddingEducation(false)}
                />
              )}
              {profile.education.map((edu, i) => (
                <div key={edu.id || i} className="content-card">
                  <div className="card-details">
                    <h3>{edu.institute}</h3>
                    <p>{edu.degree}</p>
                    <span>
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button className="btn-icon">
                      <Edit size={18} />
                    </button>
                    <button className="btn-icon">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </ProfileSection>

            {/* Awards and Certifications */}
            <ProfileSection
              title="Awards & Certifications"
              Icon={Award}
              extraHeaderButtons={
                <button
                  className="btn-icon add-btn"
                  onClick={() => setShowAddAwardModal(true)}
                  title="Add Award/Certification"
                  style={{ cursor: "pointer" }}
                >
                  <Edit size={22} />
                </button>
              }
            >
              {profile.awards.length === 0 ? (
                <p>No awards or certifications added yet.</p>
              ) : (
                profile.awards.map((award, idx) => {
                  const pdfUrl = getPdfUrl(award.pdfbyte, award.pdftype);
                  return (
                    <div className="award-card" key={idx}>
                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pdf-link"
                          download={award.pdfname || `certificate_${idx + 1}.pdf`}
                          title={`View/download certificate for ${award.course}`}
                        >
                          📄 {award.pdfname || "View Certificate"}
                        </a>
                      )}
                      <div className="award-details">
                        <h3 className="award-course">{award.course}</h3>
                        <p className="award-org">{award.organisation}</p>
                        {award.rank && (
                          <p className="award-rank">Rank: {award.rank}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {showAddAwardModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Add Award/Certification</h3>
                    <input
                      name="course"
                      type="text"
                      placeholder="Course"
                      value={awardForm.course}
                      onChange={handleAwardInputChange}
                      required
                    />
                    <input
                      name="organisation"
                      type="text"
                      placeholder="Organisation"
                      value={awardForm.organisation}
                      onChange={handleAwardInputChange}
                      required
                    />
                    <input
                      name="rank"
                      type="text"
                      placeholder="Rank (optional)"
                      value={awardForm.rank}
                      onChange={handleAwardInputChange}
                    />
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleAwardFileChange}
                      required
                    />
                    <div className="modal-actions">
                      <button onClick={submitAward} disabled={uploadingAward}>
                        {uploadingAward ? "Uploading..." : "Submit"}
                      </button>
                      <button
                        onClick={() => setShowAddAwardModal(false)}
                        disabled={uploadingAward}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </ProfileSection>

            {/* Projects */}
            <ProfileSection title="Projects" Icon={LinkIcon}>
              {profile.projects.map((proj, i) => (
                <div key={proj.id || i} className="content-card project-card">
                  <div className="card-details">
                    <h3>{proj.name}</h3>
                    <p>{proj.description}</p>
                  </div>
                  <div className="card-actions">
                    <button className="btn-icon">
                      <Edit size={18} />
                    </button>
                    <button className="btn-icon">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </ProfileSection>

            {/* Skills (ADDED pencil & modal) */}
            <ProfileSection
              title="Skills"
              Icon={Lightbulb}
              extraHeaderButtons={
                <button
                  className="btn-icon add-btn"
                  onClick={() => setShowAddSkillsModal(true)}
                  title="Add Skills"
                  style={{ cursor: "pointer" }}
                >
                  <Edit size={22} />
                </button>
              }
            >
              <div className="skills-container">
                {profile.skills.map((skill, i) => (
                  <div key={skill + i} className="skill-tag">
                    <span>{skill}</span>
                    <button
                      onClick={() => handleSkillRemove(skill)}
                      className="remove-skill-btn"
                      title="Remove skill"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {showAddSkillsModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Add Skills (comma separated)</h3>
                    <input
                      type="text"
                      placeholder="e.g. Java, React, CSS"
                      value={newSkillsInput}
                      onChange={handleSkillsInputChange}
                      autoFocus
                    />
                    <div className="modal-actions">
                      <button onClick={submitSkills} disabled={addingSkills}>
                        {addingSkills ? "Adding..." : "Add"}
                      </button>
                      <button
                        onClick={() => setShowAddSkillsModal(false)}
                        disabled={addingSkills}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </ProfileSection>
          </main>
        </div>
      </div>
    </div>
  );

  // Handlers for skills modal input and submit
 
}
