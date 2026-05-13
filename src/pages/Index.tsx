import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Eye, Activity, Thermometer, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";


const features = [
  {
    icon: Eye,
    title: "Facial Expression",
    description: "Real-time detection of 7 core emotions using advanced AI models running entirely in your browser.",
  },
  {
    icon: Activity,
    title: "Behavioral Patterns",
    description: "Track micro-expressions, blink rate, and emotional shifts to identify anxiety patterns over time.",
  },
  {
    icon: Thermometer,
    title: "Stress Heatmap",
    description: "Visual overlay on facial landmarks showing areas of tension and stress concentration.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Your Space For Peace</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">Real-Time</span>
              <br />
              <span className="text-gradient">Stress Detection</span>
              </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Using advanced facial recognition AI to detect emotions, measure anxiety levels,
              and provide guided breathing exercises — all processed locally in your browser for complete privacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-base px-8 glow-primary">
                <Link to="/analysis">
                  Start Analysis <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to="/breathing">Try Breathing Exercise</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">CalmMate</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;