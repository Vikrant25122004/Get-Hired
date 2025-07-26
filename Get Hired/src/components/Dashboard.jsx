import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import Cookies from 'js-cookie'; // Import Cookies to access JWT token
import { format } from 'date-fns'; // Import format from date-fns for date formatting
import "./Dashboard.css"

import {
  PieChart, Pie, Cell, Legend, Tooltip, // For the Application Stats Pie Chart
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, // For Line Charts
} from 'recharts';

// Define custom colors for the charts for consistency and branding
const COLORS = ['#0a66c2', '#f9a825', '#14a800']; // Blue (applied), Amber (interview), Green (offers)

const Dashboard = () => {
  // State to store job application statistics fetched from the API
  const [userJobStats, setUserJobStats] = useState({
    applied: 0,
    interviewcalls: 0,
    offers: 0,
  });

  // State to store skills data fetched from the API for the skills line chart
  const [userSkillsData, setUserSkillsData] = useState([]);

  // State to store resume scores data fetched from the API for the resume score line chart
  const [userScoreData, setUserScoreData] = useState([]);

  // State to manage loading status of API requests
  const [loading, setLoading] = useState(true);

  // State to manage any errors that occur during API requests
  const [error, setError] = useState(null);

  // useEffect hook to perform data fetching when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      setError(null); // Clear any previous errors

      try {
        const token = Cookies.get('token'); // Retrieve the JWT token from cookies
        if (!token) {
          // If no token is found, set an error message and stop loading
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        // Make a GET request to the backend to fetch user data
        const response = await axios.get('http://localhost:8080/user/getuser', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
          },
        });

        const userData = response.data; // Extract the user data from the response

        // 1. Process and update Job Application Statistics (for Pie Chart)
        setUserJobStats({
          applied: userData.appliead || 0, // Default to 0 if null/undefined
          interviewcalls: userData.interviewcalls || 0,
          offers: userData.offers || 0,
        });

        // 2. Process Skills Data for "Skills Added Over Time" Line Chart
        // The 'skills' field from the backend is a HashMap<LocalDate, Integer>
        // which typically serializes to a JSON object where keys are date strings ("YYYY-MM-DD")
        const skillsMap = userData.skills || {}; // Ensure skills is an object, not null

        const processedSkills = Object.keys(skillsMap) // Get all date string keys
          .map(dateString => {
            // Convert date string to a JavaScript Date object
            const dateObj = new Date(dateString);
            // Format the Date object to a short month name (e.g., 'Jan', 'Feb') for X-axis label
            const formattedDate = format(dateObj, 'MMM');
            return { date: formattedDate, skillsAdded: skillsMap[dateString] };
          })
          .sort((a, b) => {
            // Sort the data chronologically by month name for proper line chart display
            // This assumes data within a single year; for multi-year, more complex sorting by full date is needed.
            const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date);
          });
        
        setUserSkillsData(processedSkills); // Update the state with the processed skills data

        // 3. Process Resume Scores Data for "Resume Score Growth" Line Chart
        // The 'scores' field is a HashMap<Integer, Integer> where keys are run numbers
        const scoresMap = userData.scores || {}; // Ensure scores is an object, not null

        const processedScores = Object.keys(scoresMap) // Get all integer keys (as strings from JSON)
            .map(key => ({
                // Use the integer key directly as the 'date' label for the X-axis (e.g., "1st Run", "2nd Run")
                date: String(key), // Convert key to string
                score: scoresMap[key] // The corresponding resume score value
            }))
            .sort((a, b) => parseInt(a.date) - parseInt(b.date)); // Sort numerically by the run number

        setUserScoreData(processedScores); // Update the state with the processed scores data

      } catch (err) {
        // Log the error for debugging purposes
        console.error('Error fetching dashboard data:', err);
        // Set an error message for the user
        setError('Failed to load dashboard data. Please try again.');
        // Reset states to default values on error to ensure clean display
        setUserJobStats({ applied: 0, interviewcalls: 0, offers: 0 });
        setUserSkillsData([]);
        setUserScoreData([]);
      } finally {
        setLoading(false); // Set loading to false once fetching is complete (or error occurred)
      }
    };

    fetchDashboardData(); // Call the fetch function when the component mounts
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  // Prepare data for the Pie Chart using the fetched userJobStats
  const pieData = [
    { name: 'Applied', value: userJobStats.applied },
    { name: 'Interview Calls', value: userJobStats.interviewcalls },
    { name: 'Offers', value: userJobStats.offers },
  ];

  return (
    <div style={styles.dashboardContainer}>
      {/* Card for Application Statistics Pie Chart */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Application Stats</h3>
        {loading ? ( // Show loading message if data is still loading
          <p style={styles.loadingMessage}>Loading stats...</p>
        ) : error ? ( // Show error message if an error occurred
          <p style={styles.errorMessage}>{error}</p>
        ) : ( // Otherwise, render the Pie Chart
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" // Center X position of the pie
                cy="50%" // Center Y position of the pie
                outerRadius={80} // Radius of the outer arc of the pie
                // Label function to display name and percentage, only if value > 0
                label={({ name, percent, value }) => value > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                dataKey="value" // Key from data objects to use for pie slice size
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // Apply colors to slices
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} /> {/* Tooltip shows value and 'Count' label */}
              <Legend /> {/* Renders the legend for the pie chart */}
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Card for Skills Added Over Time Line Chart */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Skills Added Over Time</h3>
        {loading ? ( // Show loading message
          <p style={styles.loadingMessage}>Loading skills data...</p>
        ) : error ? ( // Show error message
          <p style={styles.errorMessage}>{error}</p>
        ) : userSkillsData.length === 0 ? ( // Show no data message if array is empty
          <p style={styles.noDataMessage}>No skills data available.</p>
        ) : ( // Otherwise, render the Line Chart
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userSkillsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" /> {/* Dashed grid lines */}
              <XAxis dataKey="date" stroke="#333" /> {/* X-axis for date (month name) */}
              <YAxis allowDecimals={false} stroke="#333" /> {/* Y-axis for skills added count */}
              <Tooltip /> {/* Shows data points on hover */}
              <Legend /> {/* Renders the legend */}
              <Line type="monotone" dataKey="skillsAdded" stroke="#0a66c2" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} /> {/* Line for skills added */}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Card for Resume Score Growth Line Chart */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Resume Score Growth</h3>
        {loading ? ( // Show loading message
          <p style={styles.loadingMessage}>Loading score data...</p>
        ) : error ? ( // Show error message
          <p style={styles.errorMessage}>{error}</p>
        ) : userScoreData.length === 0 ? ( // Show no data message if array is empty
          <p style={styles.noDataMessage}>No resume score data available.</p>
        ) : ( // Otherwise, render the Line Chart
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userScoreData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" stroke="#333" /> {/* X-axis for date (run number as string) */}
              <YAxis domain={[0, 100]} stroke="#333" /> {/* Y-axis for score, fixed domain 0-100 */}
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#14a800" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} /> {/* Line for score growth */}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// Inline styles for the Dashboard component
const styles = {
  dashboardContainer: {
    maxWidth: 900, // Max width for the dashboard layout
    margin: '30px auto', // Center the dashboard horizontally with top/bottom margin
    display: 'grid', // Use CSS Grid for flexible layout
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Responsive columns, min 280px, max 1fr
    gap: 20, // Gap between grid items (cards)
    padding: '0 12px', // Horizontal padding for small screens
  },
  card: {
    background: '#fff', // White background for cards
    borderRadius: 12, // Rounded corners for cards
    padding: 18, // Internal padding of cards
    boxShadow: '0 4px 18px rgba(0,0,0,0.1)', // Subtle shadow for depth
    display: 'flex', // Use flexbox for content inside cards
    flexDirection: 'column', // Stack content vertically
  },
  cardTitle: {
    fontSize: '1.3rem', // Font size for card titles
    fontWeight: '600', // Semi-bold font weight
    marginBottom: 10, // Space below title
    color: '#0a66c2', // Blue color for titles
    textAlign: 'center', // Center align titles
  },
  loadingMessage: {
    textAlign: 'center', // Center align loading messages
    color: '#555', // Grey text color
    marginTop: '50px', // Top margin
  },
  errorMessage: {
    textAlign: 'center', // Center align error messages
    color: 'red', // Red text color
    marginTop: '50px', // Top margin
  },
  noDataMessage: {
    textAlign: 'center', // Center align no data messages
    color: '#888', // Lighter grey text color
    marginTop: '50px', // Top margin
  },
};

export default Dashboard;
