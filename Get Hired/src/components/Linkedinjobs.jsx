import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './LinkedinJobs.css';

const DEFAULT_LOGO =
  'https://static.vecteezy.com/system/resources/previews/015/280/523/original/job-logo-icon-with-tie-image-free-vector.jpg';

const initialJobStatus = {
  applied: false,
  gotInterview: false,
  gotOffer: false,              // <-- ADDED
};

const LinkedinJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobStatus, setJobStatus] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch jobs as before
  const fetchJobs = async (position) => {
    if (!position) {
      setJobs([]);
      setJobStatus({});
      return;
    }
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        'http://localhost:8080/user/getlinkedinjobs',
        JSON.stringify(position),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setJobs(response.data);

      // Reset statuses for new results
      const statusObj = {};
      response.data.forEach((_, idx) => {
        statusObj[idx] = { ...initialJobStatus };
      });
      setJobStatus(statusObj);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
      setJobStatus({});
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm.trim());
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // POST: Mark as applied
  const handleApplied = async (idx, job) => {
    try {
      const token = Cookies.get('token');
      await axios.post(
        'http://localhost:8080/user/applied', null,
       
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setJobStatus((prev) => ({
        ...prev,
        [idx]: { ...prev[idx], applied: true },
      }));
    } catch (err) {
      alert('Failed to mark job as applied.');
      console.error(err);
    }
  };

  // POST: Mark Interview Call
  const handleInterview = async (idx, job) => {
    try {
      const token = Cookies.get('token');
      await axios.post(
        'http://localhost:8080/user/interview',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
           
          },
        }
      );
      
    } catch (err) {
      alert('Failed to mark interview call.');
      console.error(err);
    }
  };

  // POST: Mark as Got Offer (NEW)
  const handleOffer = async (idx, job) => {
    try {
      const token = Cookies.get('token');
      await axios.post(
        'http://localhost:8080/user/offers',null,
       
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setJobStatus((prev) => ({
        ...prev,
        [idx]: { ...prev[idx], gotOffer: true },
      }));
    } catch (err) {
      alert('Failed to mark job as offer received.');
      console.error(err);
    }
  };

  return (
    <div className="linkedin-jobs-container">
      <h2 className="linkedin-jobs-title">LinkedIn Jobs</h2>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search jobs by company, title or location..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ flex: 1, padding: '10px', fontSize: '1rem' }}
        />
        <button type="submit" className="search-btn">Search</button>
      </form>

      <div className="job-list">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length ? (
          jobs.map((job, index) => (
            <div key={index} className="job-card">
              <img
                className="company-img"
                src={job.imgurl || DEFAULT_LOGO}
                alt={`${job.companyname || 'Company'} logo`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_LOGO;
                }}
              />
              <div className="job-info">
                <h3 className="position">{job.position || 'No Title'}</h3>
                <p className="company">{job.companyname || 'No Company'}</p>
                <p className="location">{job.locate || 'Location not available'}</p>
              </div>
              <div className="job-meta">
                <span className="ago-tag">{job.postingdate || ''}</span>
                <a
                  href={job.applylink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-btn"
                >
                  Apply
                </a>
              </div>
              {/* STATUS BUTTONS */}
              <div className="job-track-buttons">
                <button
                  type="button"
                  className={`track-btn applied ${jobStatus[index]?.applied ? 'active' : ''}`}
                  onClick={() => handleApplied(index, job)}
                  disabled={jobStatus[index]?.applied}
                >
                  {jobStatus[index]?.applied ? 'Applied ✔️' : 'Mark as Applied'}
                </button>
                <button
                  type="button"
                  className={`track-btn interview ${jobStatus[index]?.gotInterview ? 'active' : ''}`}
                  onClick={() => handleInterview(index, job)}
                  disabled={jobStatus[index]?.gotInterview}
                >
                  {jobStatus[index]?.gotInterview ? 'Interview Call 📞' : 'Got Interview Call'}
                </button>
                <button
                  type="button"
                  className={`track-btn offer ${jobStatus[index]?.gotOffer ? 'active' : ''}`}
                  onClick={() => handleOffer(index, job)}
                  disabled={jobStatus[index]?.gotOffer}
                >
                  {jobStatus[index]?.gotOffer ? 'Offer 🎉' : 'Get an Offer'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No jobs found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default LinkedinJobs;
