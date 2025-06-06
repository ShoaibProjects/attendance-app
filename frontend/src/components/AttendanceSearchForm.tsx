import React, { useState } from "react";
import {
  fetchAttendanceByNameUntilDate,
} from "../api/attendance";
import {
  FiSearch,
  FiClock,
  FiUser,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { SiGoogleclassroom } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

interface AttendanceRecord {
  _id: string;
  meetingId: string;
  name: string;
  email?: string;
  join_time: string;
  leave_time: string;
  duration: number;
  timestamp: string;
  topic?: string;
}

interface AttendanceSearchFormProps {
  username?: string;
}

const AttendanceSearchForm: React.FC<AttendanceSearchFormProps> = ({
  username,
}) => {
  const [name, setName] = useState(username || "");
  const [date, _setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [onTill, setOnTill] = useState("on");
  const [_activeButton, setActiveButton] = useState<'on' | 'till' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveButton('till');
    setLoading(true);
    setError("");
    setRecords([]);
    setExpandedGroups({});

    try {
      const response = await fetchAttendanceByNameUntilDate(name, date);
      setRecords(response.data);
      setOnTill("until");
    } catch (err) {
      setError("Failed to fetch attendance records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const grouped = records.reduce((acc, rec) => {
    const key = `${rec.name}-${rec.meetingId}`;
    if (!acc[key]) {
      acc[key] = {
        meetingId: rec.meetingId,
        name: rec.name,
        email: rec.email,
        sessions: [],
        totalDuration: 0,
        topic: rec.topic,
      };
    }
    acc[key].sessions.push(rec);
    acc[key].totalDuration += rec.duration;
    return acc;
  }, {} as Record<string, {
    meetingId: string;
    name: string;
    email?: string;
    sessions: AttendanceRecord[];
    totalDuration: number;
    topic?: string;
  }>);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const attendanceStatus = records.length > 0 ? "Present" : "Absent";
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 px-4 py-6">
      {/* Search Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 space-y-6 border border-slate-700/50 hover:border-slate-600/50 transition-all"
      >
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          Search Attendance Records
        </h2>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            <span className="flex items-center gap-2">
              <FiUser className="text-sky-400" /> Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 bg-slate-900/70 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter student name"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading ? "bg-sky-700" : "bg-sky-600 hover:bg-sky-500"
            } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-sky-500/30 hover:-translate-y-0.5`}
          >
            <FiSearch className="text-lg" />
            {loading ? "Searching..." : "Show Attendance"}
          </button>
        </div>
      </motion.form>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendance Status */}
      {name && date && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center p-4 rounded-lg ${
            attendanceStatus === "Present"
              ? "bg-green-900/20 border border-green-800/50"
              : "bg-red-900/20 border border-red-800/50"
          }`}
        >
          <h3 className="text-xl font-medium">
            Attendance {onTill} <span className="text-sky-300">{formattedDate}</span>
          </h3>
          {records.length > 0 && (
            <p className="text-sm text-slate-300 mt-1">
              Found {records.length} session{records.length > 1 ? "s" : ""}
            </p>
          )}
        </motion.div>
      )}

      {/* Attendance Summary */}
      <AnimatePresence>
        {Object.keys(grouped).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-700 pb-2">
              <FiClock className="text-sky-400" />
              Attendance Summary
            </h2>

            {Object.entries(grouped)
              .sort(
                ([, a], [, b]) =>
                  new Date(b.sessions[0].timestamp).getTime() -
                  new Date(a.sessions[0].timestamp).getTime()
              )
              .map(([key, group]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all"
                >
                  <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-sky-400" />
                      <span className="font-medium">Name:</span> {group.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <SiGoogleclassroom className="text-sky-400" />
                      <span className="font-medium">Meeting:</span> {group.topic || "N/A"}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-sky-400" />
                      <span className="font-medium">Total Duration:</span> {(group.totalDuration / 60).toFixed(2)} min
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-sky-400" />
                      <span className="font-medium">Date:</span> {new Date(group.sessions[0].timestamp).toLocaleDateString("en-GB")}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGroup(key)}
                    className="mt-4 flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-medium"
                  >
                    {expandedGroups[key] ? (
                      <>
                        <FiChevronUp />
                        Hide Sessions
                      </>
                    ) : (
                      <>
                        <FiChevronDown />
                        View Sessions ({group.sessions.length})
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedGroups[key] && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3"
                      >
                        {group.sessions.map((session) => (
                          <motion.li
                            key={session._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-900/60 p-4 rounded-lg border border-slate-700/50"
                          >
                            <div className="grid sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-slate-400">Joined:</p>
                                <p>{new Date(session.join_time).toLocaleString("en-GB", { hour12: true })}</p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-400">Left:</p>
                                <p>{new Date(session.leave_time).toLocaleString("en-GB", { hour12: true })}</p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-400">Duration:</p>
                                <p>{(session.duration / 60).toFixed(2)} minutes</p>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceSearchForm;
