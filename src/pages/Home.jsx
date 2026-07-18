import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaLinkedin, FaSearch } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16">

        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-5xl font-extrabold md:text-7xl">
            Welcome to <span className="text-blue-500">VEYID</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
            Verify identities, build digital trust and search trusted profiles
            with a transparent Trust Score.
          </p>
<div className="mt-8 flex flex-col items-center">

<Link
to="/get-verified"
  className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-xl bg-cyan-600 px-6 py-3 text-white"
>
  <MdVerified
    size={40}
    className="text-cyan-300"
    style={{
      filter:
        "drop-shadow(0 0 8px #00D4FF) drop-shadow(0 0 16px #00D4FF)",
    }}
  />
  Get Verified
</Link>

  <p className="mt-2 text-xs text-slate-400">
    🔒 Your data is end-to-end encrypted.
  </p>

  <div className="relative mt-6 w-full max-w-sm">
    <FaSearch
      size={14}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      type="text"
      placeholder="Search by VEYID..."
      className="w-full rounded-xl border border-slate-600 bg-slate-900 py-3 pl-10 pr-4 text-white placeholder:text-slate-400 outline-none transition duration-300 focus:border-cyan-500"
    />
  </div>

  <button
    className="mt-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition duration-300 hover:bg-sky-500 hover:shadow-lg"
  >
    Search
  </button>

  <button className="mt-4 text-sm font-medium text-cyan-400 transition duration-300 hover:text-cyan-300 hover:underline">
    Learn More →
  </button>

   </div>	
 </section>

        {/* Why Choose VEYID */}
        <section className="mt-24">
          <h2 className="mb-10 text-center text-4xl font-bold">
            Why Choose VEYID?
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">
                🛡 Secure Identity Verification
              </h3>
              <p className="mt-3 text-slate-400">
                Verify identities securely using trusted verification methods.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">
                ⚡ Fast Verification
              </h3>
              <p className="mt-3 text-slate-400">
                Complete verification quickly with a simple process.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">
                📊 Transparent Trust Score
              </h3>
              <p className="mt-3 text-slate-400">
                Every verified profile receives a transparent Trust Score.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">
                🤖 AI Features
              </h3>
              <p className="mt-3 text-slate-400">
                Future Ready
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">
                🌍 Global Access
              </h3>
              <p className="mt-3 text-slate-400">
                Access VEYID from anywhere in the world.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">
                🔒 Privacy & Security
              </h3>
              <p className="mt-3 text-slate-400">
                Your data is protected with strong security practices.
              </p>
            </div>

          </div>
        </section>

        {/* Platform Statistics */}
        <section className="mt-24">
          <h2 className="mb-10 text-center text-4xl font-bold">
            Platform Statistics
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center">
              <h3 className="text-3xl font-bold text-blue-500">
                10,000+
              </h3>
              <p className="mt-2 text-slate-300">
                Users
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center">
              <h3 className="text-3xl font-bold text-green-500">
                2,500+
              </h3>
              <p className="mt-2 text-slate-300">
                Verified IDs
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center">
              <h3 className="text-3xl font-bold text-yellow-500">
                99%+
              </h3>
              <p className="mt-2 text-slate-300">
                Trust Accuracy
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center">
              <h3 className="text-3xl font-bold text-cyan-500">
                Global
              </h3>
              <p className="mt-2 text-slate-300">
                Access
              </p>
            </div>
{/* Our Professionals */}
<section className="mx-auto mt-20 max-w-7xl px-6">
  <h2 className="mb-10 text-center text-4xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
    Our Professionals
  </h2>

<div className="w-[96%] max-w-md mx-auto bg-[#111827] border border-gray-700 rounded-[32px] px-4 py-6">
    <div className="flex justify-center">
      <img
        src="/Founder.jpg"
        alt="Sachin Bhardwaj"
className="mx-auto w-[92%] h-[260px] object-cover rounded-[32px] border-2 border-blue-500 shadow-xl"
      />
    </div>

    <div className="mt-6 text-center">
      <h3 className="text-2x1 font-bold text-cyan-400 whitespace-nowrap">
        Sachin Bhardwaj
      </h3>

      <p className="mt-1 text-xs font-medium text-white">
        CEO / Founder
      </p>
<a
  href="https://www.linkedin.com/in/sachin-bhardwaj-1b1734227"
  target="_blank"
  rel="noopener noreferrer"
className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-400 hover:underline transition duration-300"
>
  <FaLinkedin size={18} />
  <span>LinkedIn</span>
</a>

<p className="mt-4 text-sm text-gray-300 leading-6 text-center">
Passionate about digital marketing, branding and technology. Focused on building trusted digital products with innovation and long-term vision.
      </p>
    </div>

  </div>
</section>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default Home;
