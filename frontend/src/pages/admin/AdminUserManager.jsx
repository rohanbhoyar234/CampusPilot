import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUserManager.css";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    studentId: "",
    facultyId: "",
    teaches: [],
    role: "student",
  });

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users");
    setUsers(res.data);
    setFiltered(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
    fetchUsers();
  };

  const updateRole = async (id, newRole) => {
    await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, {
      role: newRole,
    });
    fetchUsers();
  };

  const applyFilters = () => {
    let data = [...users];
    if (search.trim()) {
      data = data.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      data = data.filter((u) => u.role === roleFilter);
    }
    setFiltered(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, roleFilter]);

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedUser) {
      deleteUser(selectedUser._id);
      setSelectedUser(null);
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <div className="admin-panel">
      <h2>Manage Users</h2>

      <button className="add-btn" onClick={() => setShowAddModal(true)}>
        + Add User
      </button>

      <div className="filter-row">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u._id}>
              <td data-label="Full Name">{u.fullName}</td>
              <td data-label="Email">{u.email}</td>
              <td data-label="Role">
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </td>
              <td data-label="Actions">
                <button onClick={() => confirmDelete(u)} className="delete-btn">
                  Delete
                </button>
                <button
                  onClick={() => {
                    setResetUser(u);
                    setNewPassword("");
                    setShowResetModal(true);
                  }}
                  className="reset-btn"
                >
                  Reset
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedUser.fullName}</strong>?
            </p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleConfirm}>
                Yes, Delete
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && resetUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Reset Password</h3>
            <p>
              Enter a new password for <strong>{resetUser.fullName}</strong>:
            </p>
            <input
              type="password"
              className="modal-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={async () => {
                  if (!newPassword.trim()) {
                    alert("Password cannot be empty.");
                    return;
                  }
                  try {
                    await axios.put(
                      `http://localhost:5000/api/admin/users/${resetUser._id}/password`,
                      { password: newPassword }
                    );
                    alert("Password updated successfully!");
                    setShowResetModal(false);
                    setResetUser(null);
                  } catch (err) {
                    alert("Failed to update password.");
                  }
                }}
              >
                Update
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowResetModal(false);
                  setResetUser(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New User</h3>
            <input
              type="text"
              className="modal-input"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
            />
            <input
              type="email"
              className="modal-input"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              className="modal-input"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            {newUser.role === "student" && (
              <input
                type="text"
                className="modal-input"
                placeholder="Student ID"
                value={newUser.studentId}
                onChange={(e) =>
                  setNewUser({ ...newUser, studentId: e.target.value })
                }
              />
            )}

            {newUser.role === "faculty" && (
              <>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Faculty ID"
                  value={newUser.facultyId}
                  onChange={(e) =>
                    setNewUser({ ...newUser, facultyId: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Teaches (comma-separated)"
                  value={newUser.teaches.join(", ")}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      teaches: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </>
            )}

            <select
              className="modal-input"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={async () => {
                  try {
                    const payload = { ...newUser };

                    if (payload.role === "student") {
                      delete payload.facultyId;
                      delete payload.teaches;
                    } else if (payload.role === "faculty") {
                      delete payload.studentId;
                    } else {
                      delete payload.studentId;
                      delete payload.facultyId;
                      delete payload.teaches;
                    }

                    await axios.post(
                      "http://localhost:5000/api/admin/users",
                      payload
                    );
                    alert("User added successfully!");
                    setShowAddModal(false);
                    setNewUser({
                      fullName: "",
                      email: "",
                      password: "",
                      studentId: "",
                      facultyId: "",
                      teaches: [],
                      role: "student",
                    });
                    fetchUsers();
                  } catch (err) {
                    console.error(
                      "Add user error:",
                      err.response?.data || err.message
                    );
                    alert(err.response?.data?.message || "Failed to add user.");
                  }
                }}
              >
                Add User
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManager;
