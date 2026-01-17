import Link from "next/link";
import { Trophy, Users, Calendar, Gamepad2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            RETALIATION
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#77010F] to-black">
              ESPORTS
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Dominating the competitive gaming scene with elite teams and unstoppable determination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rosters"
              className="px-8 py-4 bg-[#77010F] text-white font-semibold rounded-lg hover:bg-[#5A010C] transition-all transform hover:scale-105"
            >
              View Our Rosters
            </Link>
            <Link
              href="/tournaments"
              className="px-8 py-4 border-2 border-[#77010F] text-[#77010F] font-semibold rounded-lg hover:bg-[#77010F]/10 transition-all"
            >
              Tournaments
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Built for Champions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-colors">
              <div className="w-12 h-12 bg-linear-to-br from-[#77010F] to-black rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Elite Rosters</h3>
              <p className="text-gray-400">
                Professional teams competing at the highest level across multiple titles.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-colors">
              <div className="w-12 h-12 bg-linear-to-br from-[#77010F] to-black rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Tournaments</h3>
              <p className="text-gray-400">
                Compete in organized tournaments with prize pools and championship glory.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-colors">
              <div className="w-12 h-12 bg-linear-to-br from-[#77010F] to-black rounded-lg flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multi-Game</h3>
              <p className="text-gray-400">
                Teams across Valorant, League of Legends, CS2, and more competitive titles.
              </p>
            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-colors">
              <div className="w-12 h-12 bg-linear-to-br from-[#77010F] to-black rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Events</h3>
              <p className="text-gray-400">
                Stay updated with match schedules, tournaments, and community events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the Fight?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Follow our journey and be part of the Retaliation Esports community.
          </p>
          <Link
            href="/rosters"
            className="inline-block px-8 py-4 bg-[#77010F] text-white font-semibold rounded-lg hover:bg-[#5A010C] transition-all transform hover:scale-105"
          >
            Explore Our Teams
          </Link>
        </div>
      </section>
    </div>
  );
}
