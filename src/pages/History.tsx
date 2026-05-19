import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  History as HistoryIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  Brain,
  Camera,
  LayoutList,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from "recharts";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/firebase";
import { getUserHistory, AnalysisHistory } from "@/lib/historyService";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateImprovementSummary } from "@/lib/utils";

const History = () => {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgScore: 0,
    peakScore: 0,
    totalSessions: 0,
    trend: 0, // difference between last session and avg
  });
  const [selectedCombinedId, setSelectedCombinedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const data = await getUserHistory(user.uid);
          setHistory(data);

          if (data.length > 0) {
            const avg = data.reduce((acc, curr) => acc + curr.score, 0) / data.length;
            const peak = Math.max(...data.map(d => d.score));
            const lastScore = data[0].score;
            const trend = lastScore - avg;

            setStats({
              avgScore: Math.round(avg),
              peakScore: peak,
              totalSessions: data.length,
              trend: Math.round(trend),
            });
          }
        } catch (error) {
          console.error("Error fetching history:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const chartData = [...history].reverse().map(item => ({
    date: format(item.timestamp, "MMM dd"),
    fullDate: format(item.timestamp, "MMM dd, HH:mm"),
    score: item.score,
    type: item.type === "combined" ? "Comparison" : item.type === "quiz" ? "Quiz" : "Live Scan",
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-6 max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      <div className="pt-24 px-6 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <HistoryIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
              <p className="text-muted-foreground">Track and compare your stress levels over time</p>
            </div>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 glass-card rounded-2xl">
            <div className="p-6 rounded-full bg-secondary/30">
              <Brain className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No history yet</h2>
            <p className="text-muted-foreground max-w-sm">
              Complete a questionnaire or start a facial analysis session to see your results here.
            </p>
            <div className="flex gap-4 pt-4">
              <Button onClick={() => window.location.href = '/questionnaire'}>Take Quiz</Button>
              <Button variant="outline" onClick={() => window.location.href = '/analysis'}>Live Mood Scan</Button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSessions}</div>
                  <p className="text-xs text-muted-foreground mt-1">Completed analyzes</p>
                </CardContent>
              </Card>
            </div>

            {/* Neural Shift Analysis */}
            {history.find(h => h.type === "combined") && (() => {
              const activeCombined = selectedCombinedId 
                ? history.find(h => h.id === selectedCombinedId) 
                : history.find(h => h.type === "combined");
                
              if (!activeCombined) return null;
              
              const beforeM = activeCombined.beforeMetrics || {};
              const afterM = activeCombined.afterMetrics || {};
              const metrics = ["Stress", "Anxiety", "Happiness", "Calmness", "Energy"];
              const barData = metrics.map(m => ({
                name: m,
                Before: beforeM[m] || 0,
                After: afterM[m] || 0,
              }));
              const isImproved = (activeCombined.improvementScore || 0) > 50;
              const summary = generateImprovementSummary(beforeM, afterM);

              return (
                <Card className="glass-card border-cyan-500/30 overflow-hidden relative group shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <CardHeader className="border-b border-white/5 bg-black/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                          <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Neural Shift Analysis</CardTitle>
                          <CardDescription className="text-cyan-400/60 font-medium text-xs tracking-widest uppercase mt-1">
                            {activeCombined.timestamp ? format(activeCombined.timestamp, "MMM dd, yyyy • HH:mm") : "Post-Activity Scan"}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Improvement Score</div>
                        <div className={`text-2xl font-black ${isImproved ? 'text-cyan-400' : 'text-white/80'}`}>{activeCombined.improvementScore}%</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.2} />
                            </linearGradient>
                            <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.2} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} domain={[0, 100]} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            contentStyle={{ backgroundColor: 'rgba(10, 10, 31, 0.9)', borderColor: 'rgba(34, 211, 238, 0.2)', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '14px', fontWeight: 700 }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                          <Bar dataKey="Before" fill="url(#colorBefore)" radius={[4, 4, 0, 0]} barSize={20} />
                          <Bar dataKey="After" fill="url(#colorAfter)" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                        <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          AI Synthesis
                        </div>
                        <p className="text-sm text-white/80 italic leading-relaxed">"{summary}"</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center pt-2">
                         <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Pre-Activity</div>
                            <div className="text-xl font-bold text-purple-400">{barData[0].Before}%</div>
                            <div className="text-[9px] text-muted-foreground uppercase mt-1">Stress</div>
                         </div>
                         <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Post-Activity</div>
                            <div className="text-xl font-bold text-cyan-400">{barData[0].After}%</div>
                            <div className="text-[9px] text-muted-foreground uppercase mt-1">Stress</div>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Comparison Chart */}
            <Card className="glass-card border-border/40 overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Stress Level Trend</CardTitle>
                    <CardDescription>Visual comparison of your mental well-being over time</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-xs font-medium">Stress Score</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Session List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <LayoutList className="w-5 h-5 text-primary" />
                  Recent Sessions
                </h3>
              </div>
              <div className="grid gap-3">
                {history.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                       if (item.type === 'combined') {
                           setSelectedCombinedId(item.id || null);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                       }
                    }}
                    className={`group p-4 rounded-xl border ${selectedCombinedId === item.id ? 'border-purple-500 bg-purple-500/10' : 'border-border/40 bg-card/50'} hover:bg-card hover:border-primary/30 transition-all flex items-center justify-between ${item.type === 'combined' ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${item.type === 'quiz' ? 'bg-amber-500/10' : item.type === 'combined' ? 'bg-purple-500/10' : 'bg-cyan-500/10'}`}>
                        {item.type === 'quiz' ? (
                          <Brain className="w-5 h-5 text-amber-500" />
                        ) : item.type === 'combined' ? (
                          <TrendingUp className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Camera className="w-5 h-5 text-cyan-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {item.type === 'quiz' ? 'Questionnaire' : item.type === 'combined' ? 'Activity Comparison' : 'Live Mood Scan'}
                          </span>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 h-5">
                            {item.type === 'combined' ? `${item.improvementScore}% Improved` : item.stressLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(item.timestamp, "MMM dd, yyyy • HH:mm")}
                          </div>
                          {item.duration && (
                            <span>• {Math.floor(item.duration / 60)}m {item.duration % 60}s</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">{item.score}%</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Score</div>
                      </div>
                      <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
