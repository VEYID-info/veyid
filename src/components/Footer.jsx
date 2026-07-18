function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-white text-2xl font-bold">VEYID</h2>

        <p className="mt-3">
          Secure Identity Verification & Digital Trust Platform
        </p>

        <div className="mt-6 flex justify-center gap-6">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact</a>
        </div>

        <p className="mt-6 text-sm">
          © 2026 VEYID. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
