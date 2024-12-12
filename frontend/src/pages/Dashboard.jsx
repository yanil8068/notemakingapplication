import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category state

  const token = Cookies.get("Note") || null; // Retrieve token from cookies
  console.log("token", token);

  useEffect(() => {
    if (token && !user) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("user", response.data.user);
          login(response.data.user); // Save user data in context
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Clear token if invalid
          Cookies.remove("Note");
        });
    }
  }, [user, token]);

  console.log("user", user);

  const [notes, setNotes] = useState([]);
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    category: "Work",
  });
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Fetch all notes for the user
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/note/getallnotes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [user]);

  // Handle category selection change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Logout function
  async function handleSignOut() {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/user/logout`); // Call your logout API
      Cookies.remove("Note"); // Remove cookie
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  }

  async function profile() {
    navigate("/profile");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteData({ ...noteData, [name]: value });
  };

  const handleEditClick = (note) => {
    setEditMode(true);
    setEditNoteId(note._id);
    setNoteData({
      title: note.title,
      content: note.content,
      category: note.category,
    });
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/note/update/${editNoteId}`,
        noteData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fetchNotes = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}api/note/getallnotes`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setNotes(response.data);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };

      fetchNotes();

      setEditMode(false);
      setEditNoteId(null);
      setNoteData({ title: "", content: "", category: "Work" });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/note/add`,
        noteData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fetchNotes = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}api/note/getallnotes`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setNotes(response.data);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };

      fetchNotes();

      setEditMode(false);
      setEditNoteId(null);
      setNoteData({ title: "", content: "", category: "Work" });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}api/note/delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchNotes = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}api/note/getallnotes`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setNotes(response.data);
          } catch (error) {
            console.error("Error fetching notes:", error);
          }
        };
        fetchNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  return (
    <div className="container my-2 border rounded shadow-lg vh-120">
      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn btn-sm btn-secondary mt-2"
          onClick={handleSignOut}
        >
          Logout
        </button>
        <h1 className="text-center mb-1 text-success mt-2">Dashboard</h1>
        <button className="btn btn-sm btn-success mt-2" onClick={profile}>
          Profile
        </button>
      </div>
      <hr />
      <h5 className="text-left mb-1 text-danger">Add a Note</h5>
      <hr className="text-danger" />
      <form
        className="mb-2"
        onSubmit={editMode ? handleUpdateNote : handleAddNote}
      >
        <div className="mb-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={noteData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <textarea
            name="content"
            placeholder="Content"
            value={noteData.content}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <select
            name="category"
            value={noteData.category}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-sm w-100">
          {editMode ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Search Bar */}
      <div className="mb-4 border border-primary rounded">
        <input
          type="text"
          placeholder="Search Notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-4">
        <label>Filter by category:</label>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            className="form-check-input"
            name="category"
            value=""
            checked={selectedCategory === ""}
            onChange={handleCategoryChange}
          />
          <label className="form-check-label">All</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            className="form-check-input"
            name="category"
            value="Work"
            checked={selectedCategory === "Work"}
            onChange={handleCategoryChange}
          />
          <label className="form-check-label">Work</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            className="form-check-input"
            name="category"
            value="Personal"
            checked={selectedCategory === "Personal"}
            onChange={handleCategoryChange}
          />
          <label className="form-check-label">Personal</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            className="form-check-input"
            name="category"
            value="Other"
            checked={selectedCategory === "Other"}
            onChange={handleCategoryChange}
          />
          <label className="form-check-label">Other</label>
        </div>
      </div>

      <div className="row border border-success rounded">
        <h5 className="text-left mb-4 text-danger">Existing Notes</h5>
        <hr />
        {filteredNotes.length > 0 ? (
          filteredNotes?.map((note) => (
            <div className="col-md-4 mb-4" key={note._id}>
              <div className="card h-100 shadow">
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{note.content}</p>
                  <p className="card-text">
                    <strong>Category:</strong> {note.category}
                  </p>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEditClick(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No notes found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
