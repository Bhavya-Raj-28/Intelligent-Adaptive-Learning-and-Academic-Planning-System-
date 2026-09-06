import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function OnboardingPage() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    department: "",
    semester: "",
    subjects: "",
    weakSubjects: "",
    studyHours: "",
    availableFrom: "",
    availableUntil: "",
    goal: "",
  });

  const [loading, setLoading] = useState(true);

  // Load existing profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(storedUser);

        // Get profile from MongoDB
        const response = await API.get(`/profile/${user.id}`);

        const profile = response.data.profile;

        setStudent({
          name: user.name || "",
          department: profile.department || "",
          semester: profile.semester || "",
          subjects: Array.isArray(profile.subjects)
            ? profile.subjects.join(", ")
            : "",
          weakSubjects: Array.isArray(profile.weakSubjects)
            ? profile.weakSubjects.join(", ")
            : "",
          studyHours: profile.studyHours || "",
          availableFrom: profile.availableFrom || "",
          availableUntil: profile.availableUntil || "",
          goal: profile.goal || "",
        });

      } catch (error) {
        // 404 simply means the student has not created a profile yet
        if (error.response?.status === 404) {
          console.log("No existing profile found. Creating new profile.");
        } else {
          console.error("Error loading profile:", error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);


  function handleChange(e) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  }


  async function handleContinue() {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      const response = await API.post("/profile/create", {
        user: user.id,

        department: student.department,

        semester: Number(student.semester),

        goal: student.goal,

        studyHours: Number(student.studyHours),

        availableFrom: student.availableFrom,

        availableUntil: student.availableUntil,

        learningStyle: "Visual",

        weakSubjects: student.weakSubjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        subjects: student.subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        examDate: null,
      });


      // Update localStorage user information
      const updatedUser = {
        ...user,
        name: student.name || user.name,
        department: student.department,
        semester: Number(student.semester),
        goal: student.goal,
        subjects: student.subjects,
        weakSubjects: student.weakSubjects,
        studyHours: Number(student.studyHours),
        availableFrom: student.availableFrom,
        availableUntil: student.availableUntil,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Also keep studentProfile storage updated
      localStorage.setItem(
        "studentProfile",
        JSON.stringify(student)
      );

      alert(response.data.message);

      navigate("/dashboard");

    } catch (error) {
      console.error("PROFILE SAVE ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Failed to save profile"
      );
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen p-8">

      <h1 className="text-3xl font-bold mb-6">
        Student Profile
      </h1>

      <div className="space-y-4 max-w-xl">

        <input
          name="name"
          placeholder="Name"
          value={student.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="department"
          placeholder="Department"
          value={student.department}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="semester"
          type="number"
          placeholder="Semester"
          value={student.semester}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="subjects"
          placeholder="Subjects (comma separated)"
          value={student.subjects}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="weakSubjects"
          placeholder="Weak Subjects (comma separated)"
          value={student.weakSubjects}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="studyHours"
          type="number"
          placeholder="Study Hours"
          value={student.studyHours}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="availableFrom"
          placeholder="Available From"
          value={student.availableFrom}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="availableUntil"
          placeholder="Available Until"
          value={student.availableUntil}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="goal"
          placeholder="Learning Goal"
          value={student.goal}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          onClick={handleContinue}
          className="w-full bg-black text-white p-3 rounded"
        >
          Save Profile
        </button>

      </div>
    </div>
  );
}

export default OnboardingPage;