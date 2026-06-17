export default function ScoreCard({
  title,
  score
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <h3 className="text-gray-500">
        {title}
      </h3>

      <div className="text-5xl font-bold mt-4">
        {score}
      </div>

      <p className="text-green-500 mt-2">
        Good
      </p>

    </div>
  );
}