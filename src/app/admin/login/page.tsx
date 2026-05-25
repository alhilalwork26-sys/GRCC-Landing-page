"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Email atau password salah.");
        setLoading(false);
      } else {
        router.replace("/admin");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-10%] left-[30%] w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #4F46E518 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[380px]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/grcc-logo.png" alt="GRCC" style={{ height: 56, width: "auto" }} className="mb-4" />
          <h1 className="text-white text-[1.3rem] font-extrabold">Admin Panel</h1>
          <p className="text-white/35 text-[0.82rem] mt-1">Masuk untuk mengelola konten website</p>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-7"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <form onSubmit={login} className="flex flex-col gap-4">
            <div>
              <label className="text-white/50 text-[0.72rem] font-semibold tracking-wider uppercase mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@grcc.org"
                required
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-[0.88rem] placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
              />
            </div>

            <div>
              <label className="text-white/50 text-[0.72rem] font-semibold tracking-wider uppercase mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 pr-11 text-white text-[0.88rem] placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-[0.78rem] bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2.5 w-full bg-white text-dark font-extrabold py-3.5 rounded-xl text-[0.88rem] hover:bg-white/90 transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Masuk</>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-white/18 text-[0.7rem] text-center mt-5">
          GRCC Admin Panel · Akses terbatas
        </p>
      </motion.div>
    </div>
  );
}
