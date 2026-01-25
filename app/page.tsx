import Link from "next/link";
import Image from "next/image";
import { Trophy, Users, Calendar, Menu, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/icon.png"
              alt="Retaliation Esports"
              width={40}
              height={40}
            />
            <span className="text-white font-bold text-lg hidden sm:block">Retaliation Esports</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link
              href="/auth/signin"
              className="text-gray-300 hover:text-white transition-colors hidden md:block"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="text-gray-300 hover:text-white transition-colors hidden md:block"
            >
              Admin
            </Link>
            <Link
              href="/rosters"
              className="text-gray-300 hover:text-white transition-colors hidden md:block"
            >
              Explore Our Teams
            </Link>
            <Link
              href="/tournaments"
              className="text-gray-300 hover:text-white transition-colors hidden md:block"
            >
              View Tournaments
            </Link>
            <a
              href="https://shop.retaliationesports.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors hidden md:block"
            >
              Shop
            </a>
            <a
              href="https://discord.gg/grp3xuqHBV"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#77010F] text-white font-semibold rounded-lg hover:bg-[#5A010C] transition-all hidden md:block"
            >
              Join Discord
            </a>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden relative group">
              <button className="p-2 text-white" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  href="/auth/signin"
                  className="block px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/rosters"
                  className="block px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  Explore Our Teams
                </Link>
                <Link
                  href="/tournaments"
                  className="block px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  View Tournaments
                </Link>
                <a
                  href="https://shop.retaliationesports.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  Shop
                </a>
                <a
                  href="https://discord.gg/grp3xuqHBV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  Join Discord
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#77010F] to-white mb-8">
            RETALIATION ESPORTS
          </h1>
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/icon.png"
              alt="Retaliation Esports"
              width={250}
              height={250}
              priority
              className="animate-pulse"
            />
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 font-semibold">
            We're finally retaliating.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tournaments"
              className="px-8 py-4 border-2 border-[#77010F] text-[#77010F] font-semibold rounded-lg hover:bg-[#77010F]/10 transition-all"
            >
              View Tournaments
            </Link>
            <Link
              href="/rosters"
              className="px-8 py-4 border-2 border-[#77010F] text-[#77010F] font-semibold rounded-lg hover:bg-[#77010F]/10 transition-all"
            >
              Explore Our Teams
            </Link>
            <a
              href="https://discord.gg/grp3xuqHBV"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-[#77010F] text-[#77010F] font-semibold rounded-lg hover:bg-[#77010F]/10 transition-all"
            >
              Join Discord
            </a>
            <a
              href="https://shop.retaliationesports.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#77010F] text-white font-semibold rounded-lg hover:bg-[#5A010C] transition-all flex items-center gap-2 justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

            <a href="https://shop.retaliationesports.com" target="_blank" rel="noopener noreferrer" className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-colors group">
              <div className="w-12 h-12 bg-linear-to-br from-[#77010F] to-black rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Shop</h3>
              <p className="text-gray-400">
                Get official Retaliation Esports merchandise and gear.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-[#77010F]/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-2">
            © {new Date().getFullYear()} Retaliation Esports. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Made by <span className="text-[#77010F] font-semibold">Frosty</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
