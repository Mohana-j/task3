// src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import '../styles/App.css'; // Optional styling file
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [marks, setMarks] = useState({
    sub1: '',
    sub2: '',
    sub3: '',
    sub4: '',
    sub5: '',
  });
  const [message, setMessage] = useState('');
  const [marksList, setMarksList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes dynamically
  const handleChange = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
  };

  // Submit the marks to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(marks).some((mark) => mark === '')) {
      setMessage('All fields are required!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/add-marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(marks),
      });

      if (!res.ok) {
        throw new Error('Failed to submit marks');
      }

      const data = await res.json();
      setMessage('Marks added successfully!');
      fetchMarks(); // Fetch updated marks list
      setMarks({
        sub1: '',
        sub2: '',
        sub3: '',
        sub4: '',
        sub5: '',
      }); // Reset form after submission
    } catch (err) {
      console.error('Error during submission:', err);
      setMessage('Error adding marks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all marks to display on the page
  const fetchMarks = async () => {
    try {
      const res = await fetch('http://localhost:8000/fetch-marks');
      if (!res.ok) {
        throw new Error('Failed to fetch marks');
      }
      const data = await res.json();
      setMarksList(data.marks);
    } catch (err) {
      console.error(err);
    }
  };

  // Use useEffect to fetch marks when the component is mounted
  useEffect(() => {
    fetchMarks();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Enter marks</h2>

      {/* Display success/error messages */}
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="marks-form">
        {['sub1', 'sub2', 'sub3', 'sub4', 'sub5'].map((subject, index) => (
          <div key={index} className="input-container">
            <input
              type="number"
              name={subject}
              placeholder={`Enter marks for Subject ${index + 1}`}
              value={marks[subject]}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        ))}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Marks'}
        </button>
      </form>

      <table>
                <tr>
                    <th>ID</th>
                    <th>Subject1</th>
                    <th>Subject2</th>
                    <th>Subject3</th>
                    <th>Subject4</th>
                    <th>Subject5</th>
                </tr>
                {mark.map((key,index)=>(
                    <tr key={index}>
                        <td>{key.id}</td>
                        <td>{key.sub1}</td>
                        <td>{key.sub2}</td>
                        <td>{key.sub3}</td>
                        <td>{key.sub4}</td>
                        <td>{key.sub5}</td>
                        <td><button>Edit</button></td>
                        <td><button>Delete</button></td>
                    </tr>
                ))}
            </table>
    </div>
  );
};

export default Dashboard;
