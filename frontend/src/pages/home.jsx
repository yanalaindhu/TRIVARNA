import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/trivarna_bg.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">



        {/* Tagline */}
        <div className="max-w-sm">

          <h2 className="text-3xl font-bold text-white">
            Balance Your Mind,
            Strengthen Your Body,
            Shape Your Life.
          </h2>

          <p className="mt-4 text-white/80">
            Your AI Companion for a Balanced & Better You
          </p>

        </div>

        {/* Get Started */}
        <Link
          to="/signup"
          className="
            mt-12
            w-72
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            py-4
            text-lg
            font-semibold
            text-white
            shadow-lg
            transition
            hover:scale-105
          "
        >
          Get Started
        </Link>

        {/* Login */}
        <div className="mt-6 text-white/80">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 font-semibold text-white"
          >
            Login
          </Link>
        </div>

      </div>

    </div>
  );
}