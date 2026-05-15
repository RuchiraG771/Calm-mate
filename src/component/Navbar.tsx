import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, User, Bell, Moon, Sun, ShieldAlert, LogOut, Heart } from "lucide-react";
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
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pointsUpdated", handleStorageChange);
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
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xl font-black futuristic-header tracking-widest">CalmMate</span>
          </Link>

          <div className="flex items-center gap-8">
            {[
              { path: "/analysis", label: "Analysis" },
              { path: "/text-analysis", label: "Text Analysis" },
              { path: "/questionnaire", label: "Questionnaire" },
              { path: "/wellness", label: "Wellness" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:text-cyan-400 relative group ${
                  location.pathname === item.path ? "text-cyan-400" : "text-white/40"
                }`}
              >
                {item.label}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: location.pathname === item.path ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-2 px-4 rounded-2xl ml-4 shadow-xl">
              <div className="flex gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
              </div>
              <div className="h-5 w-[1px] bg-white/10" />
              <div className="text-right">
                <div className="text-[8px] text-cyan-400/50 uppercase font-black tracking-tighter leading-none">Status</div>
                <div className="text-[10px] font-black text-white tracking-widest leading-tight uppercase">Calm-X88</div>
              </div>
            </div>


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
