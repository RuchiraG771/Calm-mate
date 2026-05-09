import { Link, useLocation } from "react-router-dom";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-x-0"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold text-foreground">CalmMate</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/analysis"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/analysis" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Analysis
          </Link>
          <Link
            to="/breathing"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/breathing" ? "text-primary" : "text-muted-foreground"
              
            }`}
          >
            Breathing
          </Link>
<Link
  to="/text-analysis"
  className={`text-sm font-medium transition-colors hover:text-primary ${
    location.pathname === "/text-analysis"
      ? "text-cyan-400"
      : "text-muted-foreground"
  }`}
>
  Text Analysis
</Link>
          <Link
  to="/wellness"
  className={`text-sm font-medium transition-colors hover:text-primary ${
    location.pathname === "/wellness"
      ? "text-cyan-400"
      : "text-muted-foreground"
  }`}
>
  Wellness
</Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
