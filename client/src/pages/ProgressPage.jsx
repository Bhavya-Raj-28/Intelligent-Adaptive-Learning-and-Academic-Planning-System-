import { Card, CardContent } from "@/components/ui/card";

export default function ProgressPage() {

  const completed =
    JSON.parse(localStorage.getItem("completedTasks")) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        📈 Progress Dashboard
      </h1>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">

          <h2 className="text-2xl font-bold">
            Completed Tasks
          </h2>

          <p className="text-5xl text-green-400 mt-4">
            {completed.length}
          </p>

        </CardContent>
      </Card>

    </div>
  );
}