import React, { useState, useEffect } from 'react';
import '../styles/App.css';
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
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
  };

  // Fetch marks list
  const fetchMarks = async () => {
    try {
      const res = await fetch('http://localhost:8001/fetch-marks');
      if (!res.ok) throw new Error('Failed to fetch marks');
      const data = await res.json();
      setMarksList(data.marks);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  // Submit new marks
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(marks).some((mark) => mark === '')) {
      setMessage('All fields are required!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8001/add-marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marks),
      });

      if (!res.ok) throw new Error('Failed to submit marks');

      setMessage('Marks added successfully!');
      fetchMarks();
      setMarks({ sub1: '', sub2: '', sub3: '', sub4: '', sub5: '' });
    } catch (err) {
      console.error('Error during submission:', err);
      setMessage('Error adding marks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit Marks
  const handleEdit = (entry) => {
    console.log("Editing entry:", entry);
    setEditingId(entry.id);
    setMarks(entry);
  };

  // Update Marks
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    if (!editingId) {
      setMessage('Error: No entry selected for editing.');
      return;
    }
  
    if (Object.values(marks).some((mark) => mark === '')) {
      setMessage('All fields are required!');
      return;
    }

    console.log("Updating ID:", editingId); // Debugging

    try {
      const res = await fetch(`http://localhost:8001/update-marks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marks),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Update Error:", errorData);
        throw new Error('Failed to update marks');
      }

      setMessage('Marks updated successfully!');
      setEditingId(null);
      fetchMarks();
      setMarks({ sub1: '', sub2: '', sub3: '', sub4: '', sub5: '' }); // Reset form
    } catch (err) {
      console.error('Error updating marks:', err);
      setMessage('Error updating marks. Please try again.');
    }
  };

  // Delete Marks
    // Handle deleting a mark
    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this record?")) {
          try {
              const res = await fetch(`http://localhost:8001/delete-mark/${id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("Failed to delete mark");
              fetchMarks(); // Refresh marks after deletion
          } catch (err) {
              console.error("Error deleting mark:", err);
              alert(err.message); // Show error message to user
          }
      }
  };
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">{editingId ? 'Edit Marks' : 'Enter Marks'}</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={editingId ? handleUpdate : handleSubmit} className="marks-form">
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
          {loading ? 'Processing...' : editingId ? 'Update Marks' : 'Submit Marks'}
        </button>
      </form>

      <h3 className="dashboard-title">Marks List</h3>
      <div className="table-container">
        {marksList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Subject 1</th>
                <th>Subject 2</th>
                <th>Subject 3</th>
                <th>Subject 4</th>
                <th>Subject 5</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marksList.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.sub1}</td>
                  <td>{entry.sub2}</td>
                  <td>{entry.sub3}</td>
                  <td>{entry.sub4}</td>
                  <td>{entry.sub5}</td>
                  <td>
                    <button onClick={() => handleEdit(entry)} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(entry.id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No marks available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
