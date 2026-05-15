import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Lock, User, Mail } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/home");
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 blur-3xl"
            style={{ width: 300, height: 300, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md neural-card p-12 border border-white/10 relative z-10 shadow-2xl"
      >

        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <Brain className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-black futuristic-header tracking-widest uppercase">CalmMate</h1>
          <p className="text-cyan-400/20 text-[10px] font-black mt-3 uppercase tracking-[0.4em]">Neural Protocol Entry</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold p-4 rounded-xl text-center uppercase tracking-widest">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60 mb-2 block ml-1">Secure Email</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 focus-within:border-cyan-400/50 transition-all shadow-inner">
              <Mail className="w-5 h-5 text-white/20" />
              <input
                type="email"
                placeholder="node@calm-mate.io"
                className="w-full bg-transparent outline-none px-4 py-5 text-white font-bold placeholder:text-white/5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60 mb-2 block ml-1">Access Key</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 focus-within:border-cyan-400/50 transition-all shadow-inner">
              <Lock className="w-5 h-5 text-white/20" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent outline-none px-4 py-5 text-white font-bold placeholder:text-white/5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] text-white font-black uppercase tracking-[0.2em] transition-all duration-500 active:scale-95"
          >
            {loading ? "Authorizing..." : "Initiate Login"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
            New Entity?{" "}
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Establish Identity
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;