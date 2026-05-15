import Navbar from "@/components/Navbar";
import { User, Mail, Shield, Bell, Key, CreditCard, Activity, Clock, LogOut, Phone, Camera, Save, X, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse text-xl">Loading Account...</div>
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="page-title text-3xl font-bold mb-2">👤 My Account</div>
          <div className="text-muted-foreground mb-8">Manage your profile, preferences, and security</div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column: Profile Card */}
            <div className="md:col-span-1 space-y-6">
              <div className="glass-card rounded-2xl p-6 border-border/50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/20 to-cyan-400/20" />
                
                <div className="relative w-24 h-24 mx-auto mb-4 z-10 group">
                  <Avatar className="w-full h-full border-4 border-background bg-card">
                    <AvatarImage src={localImagePreview || userData?.photoURL || ""} className="object-cover" />
                    <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
                      {userData?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background cursor-pointer hover:bg-primary/90 transition"
                    >
                      <Camera className="w-4 h-4" />
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
                  <div className="mb-4 bg-destructive/10 border border-destructive text-destructive text-xs p-2 rounded-md">
                    {errorMsg}
                  </div>
                )}

                <h2 className="text-xl font-bold text-foreground mb-1 relative z-10">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="w-full bg-card/50 border border-border text-center rounded-md py-1 outline-none focus:border-primary"
                    />
                  ) : (
                    userData?.username || "Guest"
                  )}
                </h2>
                <p className="text-sm text-muted-foreground mb-6 relative z-10">User ID: {userData?.username}</p>
                
                {isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} disabled={saving} className="flex-1 bg-primary text-primary-foreground font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      {saving ? "..." : "Save"}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="bg-card border border-border text-foreground hover:bg-secondary font-medium px-3 py-2 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="w-full bg-primary/10 text-primary hover:bg-primary/20 font-medium py-2 rounded-lg transition-colors">
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Quick Stats Removed */}
            </div>

            {/* Right Column: Settings & Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6 border-border/50">
                <h3 className="font-semibold text-foreground mb-6 text-lg border-b border-border/50 pb-2">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 block">Username</label>
                      <div className="bg-input/30 border border-border rounded-lg px-4 py-2.5 text-foreground">
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
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 block">Age</label>
                      <div className="bg-input/30 border border-border rounded-lg px-4 py-2.5 text-foreground">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={editForm.age}
                            onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                            className="w-full bg-transparent outline-none"
                          />
                        ) : (
                          userData?.age || "Not specified"
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 block">Mobile Number</label>
                    <div className="flex items-center bg-input/30 border border-border rounded-lg px-4 py-2.5 text-foreground">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editForm.mobile}
                          onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                          className="w-full bg-transparent outline-none"
                        />
                      ) : (
                        userData?.mobile || "Not specified"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border-border/50">
                <h3 className="font-semibold text-foreground mb-6 text-lg border-b border-border/50 pb-2">Security & Preferences</h3>
                <div className="space-y-2">
                  <button onClick={handleChangePassword} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-card/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Key className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-foreground">Change Password</div>
                        <div className="text-xs text-muted-foreground">Update your login credentials</div>
                      </div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                  </button>

                  <button onClick={() => setIsPrivacyOpen(true)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-card/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-foreground">Privacy Settings</div>
                        <div className="text-xs text-muted-foreground">Manage your data sharing preferences</div>
                      </div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                  </button>

                  <div className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-card/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-foreground">Notification Preferences</div>
                        <div className="text-xs text-muted-foreground">Choose what alerts you receive</div>
                      </div>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="glass-card rounded-2xl p-6 border-destructive/20 bg-destructive/5">
                <h3 className="font-semibold text-destructive mb-2 text-lg">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <div className="flex gap-4">
                  <button className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground font-medium px-4 py-2 rounded-lg transition-colors border border-destructive/20">
                    Delete Account
                  </button>
                  <button onClick={handleLogout} className="bg-card/50 border border-border text-foreground hover:bg-secondary font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

      <Dialog open={isPasswordResetOpen} onOpenChange={setIsPasswordResetOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-4 text-xl">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              Email Sent!
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              We've securely sent a password reset link to <strong>{auth.currentUser?.email}</strong>. 
              Please check your inbox to create a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => setIsPasswordResetOpen(false)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium transition-transform hover:scale-105"
            >
              Okay
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
