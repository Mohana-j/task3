import React, { useState, useEffect } from 'react';
import "../styles/App.css";
export default function Dashboard() {
    const [sub1, setSub1] = useState("");
    const [sub2, setSub2] = useState("");
    const [sub3, setSub3] = useState("");
    const [sub4, setSub4] = useState("");
    const [sub5, setSub5] = useState("");
    const [marks, setMarks] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    // Fetch marks from the backend (MySQL database)
    const fetchMarks = async () => {
        setLoading(true); // Set loading to true
        try {
            const res = await fetch("http://localhost:8001/fetch-marks");
            if (!res.ok) throw new Error("Failed to fetch marks");
            const data = await res.json();
            setMarks(data.marks);
        } catch (err) {
            console.error("Error fetching marks:", err);
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    // Handle form submission (add or update marks)
    const handleSubmitOrUpdate = async () => {
        if (!sub1 || !sub2 || !sub3 || !sub4 || !sub5) {
            alert("Please fill all the fields");
            return;
        }

        const markData = {
            sub1: Number(sub1),
            sub2: Number(sub2),
            sub3: Number(sub3),
            sub4: Number(sub4),
            sub5: Number(sub5),
        };

        try {
            const method = editId ? "PUT" : "POST";
            const endpoint = editId 
                ? `http://localhost:8001/update-mark/${editId}` 
                : "http://localhost:8001/add-mark"; // Ensure this endpoint is correct for adding marks

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(markData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to save marks");
            }

            fetchMarks(); // Refresh marks after submission
            resetForm(); // Reset the form
        } catch (err) {
            console.error("Error saving marks:", err);
            alert(err.message); // Show error message to user
        }
    };

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

    // Handle editing a mark
    const handleEdit = (mark) => {
        setEditId(mark.id);
        setSub1(mark.sub1);
        setSub2(mark.sub2);
        setSub3(mark.sub3);
        setSub4(mark.sub4);
        setSub5(mark.sub5);
    };

    // Reset the form
    const resetForm = () => {
        setEditId(null);
        setSub1("");
        setSub2("");
        setSub3("");
        setSub4("");
        setSub5("");
    };

    // Fetch marks on page load
    useEffect(() => {
        fetchMarks();
    }, []);

    return (
        <div>
            <h2>{editId ? "Edit Marks" : "Add Marks"}</h2>

            <div>
                <input
                    type="number"
                    placeholder="Subject 1"
                    value={sub1}
                    onChange={(e) => setSub1(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Subject 2"
                    value={sub2}
                    onChange={(e) => setSub2(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Subject 3"
                    value={sub3}
                    onChange={(e) => setSub3(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Subject 4"
                    value={sub4}
                    onChange={(e) => setSub4(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Subject 5"
                    value={sub5}
                    onChange={(e) => setSub5(e.target.value)}
                />
            </div>

            <button onClick={handleSubmitOrUpdate}>
                {editId ? "Update Marks" : "Submit Marks"}
            </button>
            {editId && <button onClick={resetForm} style={{ marginLeft: "10px" }}>Cancel</button>}

            <h3>Mark Table</h3>
            {loading ? (
                <p>Loading marks...</p> // Loading message
            ) : (
                <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Subject 1</th>
                            <th>Subject 2</th>
                            <th>Subject 3</th>
                            <th>Subject 4</th>
                            <th>Subject 5</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marks.map((mark) => (
                            <tr key={mark.id}>
                                <td>{mark.id}</td>
                                <td>{mark.sub1}</td>
                                <td>{mark.sub2}</td>
                                <td>{mark.sub3}</td>
                                <td>{mark.sub4}</td>
                                <td>{mark.sub5}</td>
                                <td>
                                    <button onClick={() => handleEdit(mark)}>Edit</button>
                                    <button onClick={() => handleDelete(mark.id)} style={{ marginLeft: "10px" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}