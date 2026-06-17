import Sidebar from "../components/sidebar";
import Header from "../components/header";
import ScoreCard from "../components/scorecard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8F7FF] flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <Header />

        <div className="grid grid-cols-4 gap-6 mt-8">

          <ScoreCard
            title="Wellness Score"
            score="82"
            color="purple"
          />

          <ScoreCard
            title="Mind Score"
            score="75"
            color="violet"
          />

          <ScoreCard
            title="Body Score"
            score="88"
            color="green"
          />

          <ScoreCard
            title="Life Score"
            score="83"
            color="orange"
          />

        </div>

      </main>

    </div>
  );
}