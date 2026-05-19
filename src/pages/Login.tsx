import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Lock, User, Mail } from "lucide-react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-primary/20">

        <div className="flex flex-col items-center mb-8">
          <Brain className="w-14 h-14 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-foreground">CalmMate</h1>
          <p className="text-muted-foreground mt-2">Your Space For Peace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <div className="mt-2 flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none px-3 py-4 text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <div className="mt-2 flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none px-3 py-4 text-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/" className="text-primary hover:underline font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;