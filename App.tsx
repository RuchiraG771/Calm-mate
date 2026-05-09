import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Index from "./pages/Index";
import Analysis from "./pages/Analysis";
import Breathing from "./pages/Breathing";
import NotFound from "./pages/NotFound";
import TextAnalysis from "./components/TextAnalysis";
import Wellness from "./components/Wellness";

function App() {
  return (
    <BrowserRouter>   
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<Index />} />

        <Route path="/analysis" element={<Analysis />} />

        <Route path="/breathing" element={<Breathing />} />

        <Route path="*" element={<NotFound />} />

        <Route path="/text-analysis" element={<TextAnalysis />} />

        <Route path="/wellness" element={<Wellness />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;