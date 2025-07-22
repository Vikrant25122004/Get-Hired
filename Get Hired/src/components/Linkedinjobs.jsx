import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './LinkedinJobs.css';

// Default logo can be from public folder or URL
const DEFAULT_LOGO = 'https://static.vecteezy.com/system/resources/previews/015/280/523/original/job-logo-icon-with-tie-image-free-vector.jpg'; // Put this image in your public folder

const LinkedinJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (position) => {
    if (!position) {
      setJobs([]);
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get('token');

      const response = await axios.post(
        'http://localhost:8080/user/getlinkedinjobs',
        JSON.stringify(position), // send position as JSON string
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (search)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm.trim());
  };

  // Input change handler
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <div className="linkedin-jobs-container">
      <h2 className="linkedin-jobs-title">LinkedIn Jobs</h2>

      {/* Search form */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search jobs by company, title or location..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ flex: 1, padding: '10px', fontSize: '1rem' }}
        />
        <button type="submit" className="search-btn">
          Search
        </button>
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
                  e.target.onerror = null; // prevent loop
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
