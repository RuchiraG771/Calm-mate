import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, User, Bell, Moon, Sun, ShieldAlert, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getUserPoints, checkDailyPointsDeduction } from "@/lib/utils";
import { Coins } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [points, setPoints] = useState(getUserPoints());

  useEffect(() => {
    checkDailyPointsDeduction();
    setPoints(getUserPoints());
    
    // Listen for storage changes to update points in real-time across tabs
    const handleStorageChange = () => setPoints(getUserPoints());
    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener("pointsUpdated", handleStorageChange);

    // Notification setup
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const lastDateStr = localStorage.getItem("calmmate_last_completion_date");
      const isDoneToday = lastDateStr && new Date(lastDateStr).toDateString() === new Date().toDateString();
      if (!isDoneToday) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("CalmMate Reminder", {
            body: "It's been a while! Take a moment to complete a wellness session and earn points.",
          });
        }
      }
    }, 60 * 60 * 1000); // Every hour
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pointsUpdated", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData({ ...docSnap.data(), email: user.email });
          } else {
            setUserData({ email: user.email, username: user.email });
          }
        } catch (error) {
          console.error("Error fetching user for navbar:", error);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-x-0"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
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
              Live Mood Scan
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
              to="/questionnaire"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/questionnaire"
                  ? "text-cyan-400"
                  : "text-muted-foreground"
              }`}
            >
              Questionnaire
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
            <Link
              to="/history"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/history"
                  ? "text-cyan-400"
                  : "text-muted-foreground"
              }`}
            >
              History
            </Link>

            {userData && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mr-2">
                <Coins className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{points}</span>
              </div>
            )}

            {userData && (
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border border-border hover:opacity-80 transition-opacity">
                  <AvatarImage src={userData?.photoURL || ""} className="object-cover" />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {userData?.username ? userData.username[0].toUpperCase() : <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {userData?.username ? `Hi, ${userData.username}` : "My Account"}
                </DropdownMenuLabel>
                
                <DropdownMenuItem className="cursor-pointer font-medium text-primary" onSelect={() => navigate("/account")}>
                  <User className="w-4 h-4 mr-2" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </div>
                  <Switch 
                    checked={notificationsEnabled} 
                    onCheckedChange={setNotificationsEnabled}
                  />
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-2">
                    {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span>Dark Mode</span>
                  </div>
                  <Switch 
                    checked={theme === "dark"} 
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onSelect={() => setIsPrivacyOpen(true)}
                >
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  <span>Privacy & Data</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
        </div>
      </motion.nav>

      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy & Data Security</DialogTitle>
            <DialogDescription className="pt-4 space-y-3">
              <p>
                At CalmMate, your privacy is our top priority. All real-time stress detection and facial recognition processes are executed <strong>locally in your browser</strong>.
              </p>
              <p>
                We do not store, record, or transmit any video feed or facial data to our servers.
              </p>
              <p>
                Your journal entries and wellness data are saved exclusively in your browser's local storage unless you explicitly choose to sync them.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
