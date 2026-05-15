import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Lock, User, Mail, ShieldCheck } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !email || !password) {
      setErrorMsg("Please fill in all neural data fields");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        createdAt: new Date().toISOString(),
        points: 0,
        age: "",
        mobile: ""
      });

      setLoading(false);
      navigate("/home");
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || "Failed to establish identity");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/10 blur-3xl"
            style={{ width: 400, height: 400, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.3, 1] }}
            transition={{ duration: 7, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg neural-card p-12 border border-white/10 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <ShieldCheck className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-4xl font-black futuristic-header tracking-widest uppercase">CalmMate</h1>
          <p className="text-purple-400/30 text-[10px] font-black mt-3 uppercase tracking-[0.4em]">Identity Synchronization</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold p-4 rounded-xl text-center uppercase tracking-widest">
              {errorMsg}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/60 mb-2 block ml-1">Entity Name</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 focus-within:border-purple-400/50 transition-all shadow-inner">
                <User className="w-5 h-5 text-white/20" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-transparent outline-none px-3 py-5 text-white font-bold placeholder:text-white/5"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/60 mb-2 block ml-1">Neural Email</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 focus-within:border-purple-400/50 transition-all shadow-inner">
                <Mail className="w-5 h-5 text-white/20" />
                <input
                  type="email"
                  placeholder="node@io.net"
                  className="w-full bg-transparent outline-none px-3 py-5 text-white font-bold placeholder:text-white/5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/60 mb-2 block ml-1">Access Protocol Key</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 focus-within:border-purple-400/50 transition-all shadow-inner">
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
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] text-white font-black uppercase tracking-[0.2em] transition-all duration-500 active:scale-95"
          >
            {loading ? "Establishing..." : "Establish Identity"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
            Identity already exists?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              Access Node
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
