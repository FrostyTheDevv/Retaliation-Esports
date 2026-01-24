import { Mail, MessageSquare, FileText, HelpCircle } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Support | Retaliation Esports",
  description: "Get help and support for Retaliation Esports tournaments and services",
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black pointer-events-none" />
      
      {/* Header */}
      <div className="relative bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#77010F]">Support</span>
            <span className="text-white"> Center</span>
          </h1>
          <p className="text-xl text-gray-400">
            How can we help you today?
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Contact Support */}
          <div className="bg-black rounded-xl border border-zinc-800 p-6 hover:border-[#77010F] transition-all">
            <div className="w-12 h-12 bg-[#77010F]/10 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-[#77010F]" />
            </div>
            <h3 className="text-xl font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] mb-2">Contact Support</h3>
            <p className="text-gray-400 mb-4">
              Join our Discord server for instant support from our team.
            </p>
            <a
              href="https://discord.gg/retaliation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#77010F] hover:text-[#77010F]/80 font-medium"
            >
              Join Discord →
            </a>
          </div>

          {/* Discord Community */}
          <div className="bg-black rounded-xl border border-zinc-800 p-6 hover:border-[#77010F] transition-all">
            <div className="w-12 h-12 bg-[#5865F2]/10 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-[#5865F2]" />
            </div>
            <h3 className="text-xl font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] mb-2">Discord Community</h3>
            <p className="text-gray-400 mb-4">
              Join our Discord server for live support and community help.
            </p>
            <a
              href="https://discord.gg/retaliation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#5865F2] hover:text-[#5865F2]/80 font-medium"
            >
              Join Discord →
            </a>
          </div>

          {/* Documentation */}
          <div className="bg-black rounded-xl border border-zinc-800 p-6 hover:border-[#77010F] transition-all">
            <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[#00D9FF]" />
            </div>
            <h3 className="text-xl font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] mb-2">Documentation</h3>
            <p className="text-gray-400 mb-4">
              Browse our guides and tutorials for tournament participation.
            </p>
            <Link
              href="/docs"
              className="inline-flex items-center text-[#00D9FF] hover:text-[#00D9FF]/80 font-medium"
            >
              View Docs →
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-black rounded-xl border border-zinc-800 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <HelpCircle className="w-6 h-6 text-[#77010F]" />
            <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {/* FAQ Item */}
            <div className="border-b border-zinc-700 pb-6">
              <h3 className="text-lg font-semibold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.15)] mb-2">
                How do I register for a tournament?
              </h3>
              <p className="text-gray-400">
                Visit the <Link href="/tournaments" className="text-[#77010F] hover:underline">tournaments page</Link>, select an open tournament, and click the "Register Now" button. You'll need to create an account first if you haven't already.
              </p>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h3 className="text-lg font-semibold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.15)] mb-2">
                What if I need to withdraw from a tournament?
              </h3>
              <p className="text-gray-400">
                You can withdraw from a tournament before the registration deadline closes. Go to your dashboard and find the tournament in your registrations list.
              </p>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h3 className="text-lg font-semibold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.15)] mb-2">
                How do match disputes work?
              </h3>
              <p className="text-gray-400">
                If there's a dispute during a match, the team captain can file a dispute through the tournament dashboard. Our admin team will review the evidence and make a decision within 24 hours.
              </p>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <h3 className="text-lg font-semibold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.15)] mb-2">
                Where can I see the tournament rules?
              </h3>
              <p className="text-gray-400">
                Each tournament has its own specific rules linked on the tournament detail page. General rules and guidelines are available in our documentation.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-lg font-semibold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.15)] mb-2">
                How are prizes distributed?
              </h3>
              <p className="text-gray-400">
                Prize distribution varies by tournament. Winners will be contacted via email after the tournament concludes. Make sure your contact information is up to date in your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 text-center bg-black rounded-xl border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] mb-4">Still need help?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions or issues.
          </p>
          <a
            href="https://discord.gg/retaliation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-[#77010F] hover:bg-[#77010F]/80 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Join Discord Support</span>
          </a>
        </div>
      </div>
    </div>
  )
}
