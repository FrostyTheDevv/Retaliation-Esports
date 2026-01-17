import Link from "next/link";
import Image from "next/image";
import { Trophy, Users, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/icon.png"
              alt="Retaliation Esports"
              width={200}
              height={200}
              priority
              className="animate-pulse"
            />
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-semibold">
            We're finally retaliating.
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#77010F] to-white mb-12">
            RETALIATION ESPORTS
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tournaments"
              className="px-8 py-4 bg-[#77010F] text-white font-semibold rounded-lg hover:bg-[#5A010C] transition-all transform hover:scale-105"
            >
              View Tournaments
            </Link>
            <Link
              href="https://discord.gg/your-invite"
              className="px-8 py-4 border-2 border-[#77010F] text-[#77010F] font-semibold rounded-lg hover:bg-[#77010F]/10 transition-all"
            >
              Join Our Discord
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/rosters" className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-colors group">
              <div className="w-12 h-12 bg-linear-to-br from-[#77010F] to-black rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Rosters</h3>
              <p className="text-gray-400">
                Teams competing at the highest levels all configured for you.
              </p>
            </Link>

            <Link href="/tournaments" className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-colors group">
              <div className="w-12 h-12 bg-linear-to-br from-[#77010F] to-black rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Tournaments</h3>
              <p className="text-gray-400">
                Compete in organized tournaments with prize pools and championship glory.
              </p>
            </Link>

            <Link href="/support" className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-colors group">
              <div className="w-12 h-12 bg-linear-to-br from-[#77010F] to-black rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Events</h3>
              <p className="text-gray-400">
                Stay updated with match schedules, tournaments, and community events.
              </p>
            </Link>
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
