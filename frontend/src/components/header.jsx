export default function Header() {
  return (
    <div className="flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-bold">
          Good Morning, Gayathri 👋
        </h1>

        <p className="text-gray-500">
          Here's your wellbeing summary.
        </p>
      </div>

      <div className="flex gap-4 items-center">

        <button>
          🔔
        </button>

        <img
          src="https://i.pravatar.cc/50"
          alt=""
          className="rounded-full"
        />

      </div>

    </div>
  );
}