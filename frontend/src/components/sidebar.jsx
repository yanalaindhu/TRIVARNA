export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">

      <div className="p-6">

        <h1 className="font-bold text-2xl text-purple-600">
          TRIVARNA
        </h1>

      </div>

      <nav className="px-4">

        <div className="p-3 rounded-xl bg-purple-100 mb-2">
          Dashboard
        </div>

        <div className="p-3">AI Companion</div>
        <div className="p-3">Mind</div>
        <div className="p-3">Body</div>
        <div className="p-3">Life</div>

      </nav>

    </aside>
  );
}