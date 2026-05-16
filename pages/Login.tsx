import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Lock, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (email && password) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-primary/20">
        
        <div className="flex flex-col items-center mb-8">
          <Brain className="w-14 h-14 text-primary mb-4" />

          <h1 className="text-4xl font-bold text-foreground">
            CalmMate
          </h1>

          <p className="text-muted-foreground mt-2">
            AI Mental Wellness Platform
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="text-sm text-muted-foreground">
              Email
            </label>

            <div className="mt-2 flex items-center bg-card border border-border rounded-xl px-4">
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
            <label className="text-sm text-muted-foreground">
              Password
            </label>

            <div className="mt-2 flex items-center bg-card border border-border rounded-xl px-4">
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
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;