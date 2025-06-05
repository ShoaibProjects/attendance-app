import React, { useState } from "react";
import {
  fetchAttendanceByNameAndDate,
  fetchAttendanceByNameUntilDate,
} from "../api/attendance";
import {
  FiSearch,
  FiClock,
  FiUser,
  // FiMail,
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
  const [date, setDate] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [onTill, setOnTill] = useState("on");
  const [activeButton, setActiveButton] = useState<'on' | 'till' | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveButton('on');
    setLoading(true);
    setError("");
    setRecords([]);
    setExpandedGroups({});

    try {
      const response = await fetchAttendanceByNameAndDate(name, date);
      setRecords(response.data);
      setOnTill("on");
    } catch (err) {
      setError("Failed to fetch attendance records. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleTillThatDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveButton('till');
    setLoading(true);
    setError("");
    setRecords([]);
    setExpandedGroups({});

    try {
      const response = await fetchAttendanceByNameUntilDate(name, date);
      setRecords(response.data);
      setOnTill("untill");
    } catch (err) {
      setError("Failed to fetch attendance records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const grouped = records.reduce(
    (acc, rec) => {
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
    },
    {} as Record<
      string,
      {
        meetingId: string;
        name: string;
        email?: string;
        sessions: AttendanceRecord[];
        totalDuration: number;
        topic?: string;
      }
    >
  );

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const attendanceStatus = records.length > 0 ? "Present" : "Absent";
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Search Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 space-y-6 border border-slate-700/50 hover:border-slate-600/50 transition-all"
      >
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          Search Attendance Records
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FiUser className="text-sky-400" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900/70 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Enter student name"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FiCalendar className="text-sky-400" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900/70 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all
    [&::-webkit-calendar-picker-indicator]:bg-white 
    [&::-webkit-calendar-picker-indicator]:rounded-sm 
    [&::-webkit-calendar-picker-indicator]:cursor-pointer
    [&::-webkit-calendar-picker-indicator]:hover:bg-slate-600
    [&::-webkit-calendar-picker-indicator]:transition-colors
    [&::-webkit-calendar-picker-indicator]:p-1
    [&::-webkit-calendar-picker-indicator]:ml-2
    [&::-webkit-date-and-time-value]:text-left
    dark:[&::-webkit-calendar-picker-indicator]:bg-transparent
    dark:[&::-webkit-calendar-picker-indicator]:hover:bg-slate-600"
            />
          </div>

          <style>{`
  /* Additional CSS for better cross-browser support */
  input[type="date"] {
    color-scheme: dark;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
  
  /* Firefox specific */
  input[type="date"] {
    -moz-appearance: none;
  }
`}</style>
        </div>
        <div>
          <div className="pt-4 grid sm:grid-cols-2 gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 ${
                loading ? "bg-sky-700" : "bg-sky-600 hover:bg-sky-500"
              } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-sky-500/30 hover:-translate-y-0.5`}
            >
              <FiSearch className="text-lg" />
              {activeButton === 'on' && loading
                ? "Searching..."
                : "Search Attendance on that date"}
            </button>
            <button
              onClick={handleTillThatDate}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 ${
                loading ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-500"
              } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-sky-500/30 hover:-translate-y-0.5`}
            >
              <FiSearch className="text-lg" />
              {activeButton === 'till' && loading
                ? "Searching..."
                : "Search Attendance till that date"}
            </button>
          </div>
        </div>
      </motion.form>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendance status */}
      {name && date && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-center p-4 rounded-lg ${
            attendanceStatus === "Present"
              ? "bg-green-900/20 border border-green-800/50"
              : "bg-red-900/20 border border-red-800/50"
          }`}
        >
          <h3 className="text-xl font-medium">
            Attendance {onTill}{" "}
            <span className="text-sky-300">{formattedDate}</span>:{" "}
            <span
              className={
                attendanceStatus === "Present"
                  ? "text-green-400 font-bold"
                  : "text-red-400 font-bold"
              }
            >
              {attendanceStatus}
            </span>
          </h3>
          {records.length > 0 && (
            <p className="text-sm text-slate-300 mt-1">
              Found {records.length} session{records.length !== 1 ? "s" : ""}
            </p>
          )}
        </motion.div>
      )}

      {/* Attendance grouped summary */}
      <AnimatePresence>
        {Object.keys(grouped).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-700 pb-2 flex items-center gap-2">
              <FiClock className="text-sky-400" />
              <span>Attendance Summary</span>
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
                  className="bg-slate-800/50 p-6 rounded-xl shadow border border-slate-700/50 hover:border-slate-600/50 transition-all"
                >
                  <div className="grid md:grid-cols-4 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-sky-400" size={16} />
                      <span className="font-medium">Name:</span>
                      <span className="text-slate-300">{group.name}</span>
                    </div>

                    {/*              <div className="flex items-center gap-2">
                    <FiMail className="text-sky-400" />
                    <span className="font-medium">Email:</span>
                    <span className="text-slate-300 wrap-anywhere">{group.email || 'N/A'}</span>
                  </div> */}

                    {/* <div className="flex items-center gap-2">
                    <FiCalendar className="text-sky-400" size={23}/>
                    <span className="font-medium">Meeting ID:</span>
                    <span className="text-slate-300 font-mono wrap-anywhere">{group.meetingId}</span>
                  </div> */}
                    <div className="flex items-center gap-2">
                      <SiGoogleclassroom className="text-sky-400" size={16} />
                      <span className="font-medium">Meeting:</span>
                      <span className="text-slate-300 font-mono wrap-anywhere">
                        {group.topic || "Meeting name"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiClock className="text-sky-400" size={16} />
                      <span className="font-medium">Total Duration:</span>
                      <span className="text-slate-300">
                        {(group.totalDuration / 60).toFixed(2)} min
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-sky-400" size={16} />
                      <span className="font-medium">Date:</span>
                      <span className="text-slate-300">
                        {" "}
                        {new Date(
                          group.sessions[0].timestamp
                        ).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGroup(key)}
                    className="mt-4 flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
                  >
                    {expandedGroups[key] ? (
                      <>
                        <FiChevronUp className="inline" />
                        Hide Sessions
                      </>
                    ) : (
                      <>
                        <FiChevronDown className="inline" />
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
                        className="mt-4 space-y-3 overflow-hidden"
                      >
                        {group.sessions.map((session) => (
                          <motion.li
                            key={session._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900/60 p-4 rounded-lg border border-slate-700/50"
                          >
                            <div className="grid sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-slate-400">
                                  Joined:
                                </p>
                                <p className="text-slate-300">
                                  {new Date(session.join_time).toLocaleString(
                                    "en-GB",
                                    { hour12: true }
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-400">
                                  Left:
                                </p>
                                <p className="text-slate-300">
                                  {new Date(session.leave_time).toLocaleString(
                                    "en-GB",
                                    { hour12: true }
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-400">
                                  Duration:
                                </p>
                                <p className="text-slate-300">
                                  {(session.duration / 60).toFixed(2)} minutes
                                </p>
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
