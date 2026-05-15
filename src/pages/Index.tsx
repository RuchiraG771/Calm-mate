import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Eye, Activity, Thermometer, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";


const features = [
  {
    icon: Eye,
    title: "Neural Vision",
    description: "Real-time detection of 7 core emotions using advanced AI models running locally in your neural-net browser.",
    color: "cyan"
  },
  {
    icon: Activity,
    title: "Bio-Patterns",
    description: "Track micro-expressions and blink rate to identify anxiety patterns within your physiological data stream.",
    color: "purple"
  },
  {
    icon: Thermometer,
    title: "Thermal Stress",
    description: "Visual heatmap overlay showing areas of tension and physiological stress concentration in real-time.",
    color: "indigo"
  },
];

const Index = () => {
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
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-40 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-10 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">Neural Optimization Active</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black leading-none mb-8 tracking-tighter">
                <span className="text-white">RECLAIM YOUR</span>
                <br />
                <span className="futuristic-header">INNER CALM</span>
              </h1>

              <p className="text-xl text-white/40 max-w-2xl mx-auto mb-12 font-bold uppercase tracking-widest leading-relaxed">
                Advanced biometrics and AI-guided wellness protocols processed at the edge.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] px-12 h-16 text-lg font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105">
                  <Link to="/analysis">
                    Initiate Scan <ArrowRight className="w-5 h-5 ml-3" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white/5 px-12 h-16 text-lg font-black uppercase tracking-widest rounded-2xl">
                  <Link to="/wellness">
                    Wellness Hub
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="neural-card p-10 group"
                >
                  <div className="w-16 h-16 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-500">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wider">{feature.title}</h3>
                  <p className="text-sm text-white/30 font-bold leading-relaxed uppercase tracking-wide">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-16 px-6 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xl font-black futuristic-header tracking-widest">CalmMate</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              <Link to="/analysis" className="hover:text-cyan-400 transition-colors">Security Protocol</Link>
              <Link to="/questionnaire" className="hover:text-cyan-400 transition-colors">Neural Assessment</Link>
              <Link to="/wellness" className="hover:text-cyan-400 transition-colors">Bio-Link</Link>
            </div>
            <div className="text-[10px] font-black text-white/10 uppercase tracking-widest">
              &copy; 2026 CALMMATE NEURAL SYSTEMS
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;