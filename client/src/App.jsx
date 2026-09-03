import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AITutor from "./pages/AITutor";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import PlannerPage from "./pages/PlannerPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage/>} />
      <Route path="/onboarding" element={<OnboardingPage/>}/>
      <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ai-tutor" element={<AITutor />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/progress" element={<ProgressPage />} />
<Route path="/planner" element={<PlannerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;