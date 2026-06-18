export default function TrendCard({
  title,
  value,
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between">
        <span>{title}</span>
        <span>{value}</span>
      </div>

      <div className="h-20 mt-3 bg-gray-50 rounded-xl"></div>
    </div>
  );
}