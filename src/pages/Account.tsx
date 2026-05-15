import Navbar from "@/components/Navbar";
import { User, Mail, Shield, Bell, Key, CreditCard, Activity, Clock, LogOut, Phone, Camera, Save, X, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Account = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", age: "", mobile: "" });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setEditForm({
              username: data.username || "",
              age: data.age || "",
              mobile: data.mobile || ""
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center">
        <div className="text-cyan-400 font-black animate-pulse text-xl uppercase tracking-[0.3em]">Synchronizing Profile...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleChangePassword = async () => {
    if (auth.currentUser?.email) {
      try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        setIsPasswordResetOpen(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    setErrorMsg("");
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        username: editForm.username,
        age: parseInt(editForm.age as string) || "",
        mobile: editForm.mobile
      });
      setUserData({ ...userData, ...editForm });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update profile", error);
      setErrorMsg(error.message || "Failed to save profile. Check permissions.");
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    // Show local preview instantly
    const objectUrl = URL.createObjectURL(file);
    setLocalImagePreview(objectUrl);

    setSaving(true);
    setErrorMsg("");
    try {
      const storageRef = ref(storage, `profiles/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { photoURL });
      
      setUserData({ ...userData, photoURL });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setErrorMsg(error.message || "Failed to upload image. Did you enable Firebase Storage?");
      setLocalImagePreview(null); // revert on failure
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white relative overflow-hidden">
      <Navbar />

      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 blur-3xl"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="pt-24 pb-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-black futuristic-header mb-2"
              >
                👤 Profile Node
              </motion.h1>
              <p className="text-cyan-400/60 font-medium tracking-wide uppercase text-xs">Identity Management & Neural Preferences</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
              <div className="flex gap-1.5 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Verified User</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <div className="md:col-span-1 space-y-8">
              <div className="neural-card p-8 text-center relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-50" />
                
                <div className="relative w-32 h-32 mx-auto mb-6 z-10">
                  <Avatar className="w-full h-full border-4 border-white/10 bg-[#0a0a1f] shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <AvatarImage src={localImagePreview || userData?.photoURL || ""} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-4xl font-black uppercase">
                      {userData?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 w-10 h-10 bg-cyan-500 text-white rounded-2xl flex items-center justify-center border-2 border-[#0a0a1f] cursor-pointer hover:bg-cyan-400 transition-all shadow-lg active:scale-90"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                  />
                </div>

                {errorMsg && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-xl font-bold">
                    {errorMsg}
                  </div>
                )}

                <h2 className="text-2xl font-black text-white mb-1 relative z-10 tracking-tight">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-center rounded-xl py-2 outline-none focus:border-cyan-400 font-black"
                    />
                  ) : (
                    userData?.username || "Guest Node"
                  )}
                </h2>
                <p className="text-[10px] font-black text-white/30 mb-8 relative z-10 uppercase tracking-widest leading-none">NODE-ID: {userData?.username?.toUpperCase() || "UNASSIGNED"}</p>
                
                {isEditing ? (
                  <div className="flex gap-3 relative z-10">
                    <Button onClick={handleSaveProfile} disabled={saving} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-black uppercase tracking-widest h-12 rounded-xl transition-all shadow-lg">
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-4 h-12 rounded-xl">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest h-12 rounded-xl relative z-10 transition-all group-hover:border-cyan-400/40">
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column: Settings & Details */}
            <div className="md:col-span-2 space-y-8">
              <div className="neural-card p-10 shadow-2xl border-white/5">
                <h3 className="font-black text-white mb-8 text-xl uppercase tracking-widest flex items-center gap-3">
                   <div className="w-2 h-8 bg-cyan-500 rounded-full" />
                   Neural Information
                </h3>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-cyan-400/60 font-black uppercase tracking-[0.3em] mb-2 block ml-1">Username</label>
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold tracking-wide">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editForm.username}
                            onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                            className="w-full bg-transparent outline-none"
                          />
                        ) : (
                          userData?.username
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-cyan-400/60 font-black uppercase tracking-[0.3em] mb-2 block ml-1">Current Age</label>
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold tracking-wide">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={editForm.age}
                            onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                            className="w-full bg-transparent outline-none"
                          />
                        ) : (
                          userData?.age || "Unspecified"
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-cyan-400/60 font-black uppercase tracking-[0.3em] mb-2 block ml-1">Bio-Link Mobile</label>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold tracking-wide">
                      <Phone className="w-4 h-4 mr-3 text-cyan-400/60" />
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editForm.mobile}
                          onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                          className="w-full bg-transparent outline-none"
                        />
                      ) : (
                        userData?.mobile || "No link established"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="neural-card p-10 shadow-2xl border-white/5">
                <h3 className="font-black text-white mb-8 text-xl uppercase tracking-widest flex items-center gap-3">
                   <div className="w-2 h-8 bg-purple-500 rounded-full" />
                   Security Protocols
                </h3>
                <div className="space-y-4">
                  <button onClick={handleChangePassword} className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] hover:bg-white/5 transition-all border border-white/5 hover:border-cyan-400/20 group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                        <Key className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-black text-white uppercase tracking-widest text-sm mb-1">Access Credentials</div>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Update your secure login key</div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">→</div>
                  </button>

                  <button onClick={() => setIsPrivacyOpen(true)} className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] hover:bg-white/5 transition-all border border-white/5 hover:border-purple-400/20 group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-black text-white uppercase tracking-widest text-sm mb-1">Privacy Firewall</div>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Manage data encryption & visibility</div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-purple-400 group-hover:translate-x-1 transition-all">→</div>
                  </button>

                  <div className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <Bell className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-black text-white uppercase tracking-widest text-sm mb-1">Neural Alerts</div>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Toggle real-time status notifications</div>
                      </div>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} className="data-[state=checked]:bg-cyan-500" />
                  </div>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="neural-card p-10 border-red-500/10 bg-red-500/[0.02] shadow-2xl">
                <h3 className="font-black text-red-500 mb-4 text-xl uppercase tracking-widest">Critical Override</h3>
                <p className="text-xs font-bold text-white/30 mb-8 uppercase tracking-widest leading-relaxed">Account termination is permanent and cannot be reversed. Proceed with extreme caution.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="h-14 px-8 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest rounded-2xl transition-all">
                    Delete Neural ID
                  </Button>
                  <Button onClick={handleLogout} className="h-14 px-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    Terminate Session
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogContent className="bg-[#0a0a1f] border border-white/10 text-white rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black futuristic-header uppercase tracking-widest">Neural Privacy Protocol</DialogTitle>
            <DialogDescription className="pt-6 space-y-4 text-white/60 font-bold leading-relaxed uppercase text-xs tracking-widest">
              <p>
                At CalmMate, your privacy is our top priority. All real-time stress detection and facial recognition processes are executed <strong className="text-cyan-400">locally in your neural-net browser</strong>.
              </p>
              <p>
                We do not store, record, or transmit any video feed or facial data to our central nodes.
              </p>
              <p>
                Your journal entries and wellness data are saved exclusively in your browser's local storage unless you explicitly choose to sync them with our encrypted cloud.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordResetOpen} onOpenChange={setIsPasswordResetOpen}>
        <DialogContent className="sm:max-w-md text-center bg-[#0a0a1f] border border-white/10 text-white rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-6 text-xl">
              <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-3xl flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="font-black futuristic-header uppercase tracking-widest">Transmission Successful</span>
            </DialogTitle>
            <DialogDescription className="text-sm font-bold text-white/40 pt-4 uppercase tracking-[0.2em] leading-relaxed">
              A secure password reset link has been dispatched to <strong className="text-white">{auth.currentUser?.email}</strong>. 
              Please verify the transmission in your inbox.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => setIsPasswordResetOpen(false)}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-10 h-14 rounded-2xl font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              Acknowledged
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default Account;
