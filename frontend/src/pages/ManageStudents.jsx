import { useEffect, useState, useCallback } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  UserPlus,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  getPendingStudents,
  updateStudentApproval,
  getAllStudents,
  searchStudents,
  createStudentRecord,
} from "../services/api";

function ManageStudents() {
  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "all" | "add"

  const [pendingList, setPendingList] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Add student states
  const [newName, setNewName] = useState("");
  const [newRoll, setNewRoll] = useState("");
  const [newCourse, setNewCourse] = useState("");

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [pendingRes, allRes] = await Promise.all([
        getPendingStudents(),
        getAllStudents(),
      ]);

      setPendingList(pendingRes.students || []);
      setAllStudents(allRes.students || []);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load student records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApproval = async (studentId, status) => {
    try {
      setActionLoadingId(studentId);
      setError("");
      setSuccessMsg("");

      await updateStudentApproval(studentId, status);
      setSuccessMsg(
        status === "active"
          ? "Student account approved successfully."
          : "Student registration rejected."
      );
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to update student status."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!searchQuery.trim()) {
      await fetchData();
      return;
    }

    try {
      setLoading(true);
      const res = await searchStudents(searchQuery.trim());
      setAllStudents(res.students || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!newName.trim() || !newRoll.trim()) {
      setError("Student name and roll number are required.");
      return;
    }

    try {
      setLoading(true);
      await createStudentRecord({
        name: newName.trim(),
        roll_number: newRoll.trim(),
        course: newCourse.trim(),
      });

      setSuccessMsg("Student record added successfully.");
      setNewName("");
      setNewRoll("");
      setNewCourse("");
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not add student record.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const normalized = (status || "active").toLowerCase();
    if (normalized === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={12} /> Active
        </span>
      );
    }
    if (normalized === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
          <Clock size={12} /> Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <XCircle size={12} /> {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Student Management & Approvals
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Approve new student registrations, search records, and manage student accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-xl border border-slate-200 w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveTab("pending");
            setError("");
            setSuccessMsg("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "pending"
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Clock size={16} />
          Pending Approvals
          {pendingList.length > 0 && (
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === "pending"
                  ? "bg-white text-blue-600"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {pendingList.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("all");
            setError("");
            setSuccessMsg("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users size={16} />
          All Students ({allStudents.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("add");
            setError("");
            setSuccessMsg("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "add"
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <UserPlus size={16} />
          Add Student
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
          {successMsg}
        </div>
      )}

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === "pending" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">
              Pending Student Registrations
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Students waiting for administrator verification before they can log in.
            </p>
          </div>

          {pendingList.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-sm">
              No pending student registrations right now.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <th className="py-3.5 px-6">ID</th>
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">Roll Number</th>
                    <th className="py-3.5 px-6">Course</th>
                    <th className="py-3.5 px-6">Email</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {pendingList.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-4 px-6 font-medium text-slate-700">
                        #{st.id}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {st.name}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {st.roll_number}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {st.course || "-"}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {st.email || "-"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={actionLoadingId === st.id}
                            onClick={() => handleApproval(st.id, "active")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition"
                          >
                            <UserCheck size={14} />
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={actionLoadingId === st.id}
                            onClick={() => handleApproval(st.id, "rejected")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 transition"
                          >
                            <UserX size={14} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL STUDENTS + SEARCH */}
      {activeTab === "all" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800">Student Directory</h3>
              <p className="text-xs text-slate-500 mt-1">
                Search by student name, roll number, or course.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex items-center border border-slate-300 rounded-xl px-3 bg-slate-50">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent p-2 text-sm outline-none w-52"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
              >
                Search
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    fetchData();
                  }}
                  className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {allStudents.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-sm">
              No student records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <th className="py-3.5 px-6">ID</th>
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-6">Roll Number</th>
                    <th className="py-3.5 px-6">Course</th>
                    <th className="py-3.5 px-6">Email</th>
                    <th className="py-3.5 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {allStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-4 px-6 font-medium text-slate-700">
                        #{st.id}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {st.name}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {st.roll_number}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {st.course || "-"}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {st.email || "-"}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(st.account_status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADD STUDENT RECORD */}
      {activeTab === "add" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 max-w-xl">
          <h3 className="font-bold text-lg text-slate-800">
            Add New Student Record
          </h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Manually register a student record in the database.
          </p>

          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Student Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Verma"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                placeholder="e.g. CS2026045"
                value={newRoll}
                onChange={(e) => setNewRoll(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course / Branch
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech Computer Science"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition"
            >
              {loading ? "Saving..." : "Create Student Record"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;