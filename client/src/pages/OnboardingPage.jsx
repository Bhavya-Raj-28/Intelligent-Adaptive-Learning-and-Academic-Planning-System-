import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
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

  function handleChange(e) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  }

  async function handleContinue(e) {
  e.preventDefault();

  try {
    const user = JSON.parse(localStorage.getItem("user"));

await API.post("/profile/create", {
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

    // Keep this for now because Dashboard still reads from localStorage
    localStorage.setItem("studentProfile", JSON.stringify(student));

    alert("Profile Created Successfully!");

    navigate("/dashboard");

  } catch (err) {
    console.log(err.response?.data);
    alert("Error creating profile");
  }
}
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-slate-900 text-white border-slate-800">
        <CardHeader>
          <CardTitle className="text-3xl">
            🤖 AI Learning Setup
          </CardTitle>

          <p className="text-slate-400 mt-2">
            Tell us about yourself so we can personalize your learning
            experience.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleContinue} className="space-y-5">

            <Input
              name="name"
              placeholder="Your Name"
              value={student.name}
              onChange={handleChange}
            />

            <Input
              name="department"
              placeholder="Department (CSE, IT, AIML...)"
              value={student.department}
              onChange={handleChange}
            />

            <Input
              name="semester"
              placeholder="Semester"
              value={student.semester}
              onChange={handleChange}
            />

            <Input
              name="subjects"
              placeholder="Subjects (comma separated)"
              value={student.subjects}
              onChange={handleChange}
            />
            <Input
  name="weakSubjects"
  placeholder="Weak Subjects (comma separated)"
  value={student.weakSubjects}
  onChange={handleChange}
/>

            <Input
              name="studyHours"
              placeholder="Daily Study Hours"
              value={student.studyHours}
              onChange={handleChange}
            />

            <Input
  name="availableFrom"
  placeholder="Available Study From (e.g. 5:00 PM)"
  value={student.availableFrom}
  onChange={handleChange}
/>

<Input
  name="availableUntil"
  placeholder="Available Study Until (e.g. 10:00 PM)"
  value={student.availableUntil}
  onChange={handleChange}
/>



            <Input
              name="goal"
              placeholder="Goal (Placements / GATE / Exams)"
              value={student.goal}
              onChange={handleChange}
            />

            <Button type="submit" className="w-full">
              Continue to Dashboard
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}