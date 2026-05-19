import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Lock, User, Phone, Calendar, Mail } from "lucide-react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
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

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !username || !password || !age || !mobile) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        age: parseInt(age),
        mobile,
        createdAt: new Date()
      });

      setLoading(false);
      navigate("/home");
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-primary/20">

        <div className="flex flex-col items-center mb-8">
          <Brain className="w-14 h-14 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join CalmMate today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {errorMsg && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <div className="mt-1 flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none px-3 py-3 text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Username</label>
            <div className="mt-1 flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
              <User className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full bg-transparent outline-none px-3 py-3 text-foreground"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Age</label>
              <div className="mt-1 flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="e.g. 25"
                  className="w-full bg-transparent outline-none px-3 py-3 text-foreground"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Mobile</label>
              <div className="mt-1 flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="Number"
                  className="w-full bg-transparent outline-none px-3 py-3 text-foreground"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <div className="mt-1 flex items-center bg-card border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Create a password"
                className="w-full bg-transparent outline-none px-3 py-3 text-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
