import API from "../services/api";

export async function generateStudyPlan(userId) {
  const response = await API.post("/planner/generate", {
    userId,
  });

  return response.data.plan;
}