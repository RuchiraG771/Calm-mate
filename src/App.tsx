import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Index from "./pages/Index";
import Analysis from "./pages/Analysis";
import Breathing from "./pages/Breathing";
import NotFound from "./pages/NotFound";
import Account from "./pages/Account";
import TextAnalysis from "./component/TextAnalysis";
import Wellness from "./component/Wellness";
import Questionnaire from "./pages/Questionnaire";

function App() {
  return (
    <HashRouter>   
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Index />} />

        <Route path="/analysis" element={<Analysis />} />

        <Route path="/breathing" element={<Breathing />} />

        <Route path="/account" element={<Account />} />

        <Route path="*" element={<NotFound />} />

        <Route path="/text-analysis" element={<TextAnalysis />} />

        <Route path="/questionnaire" element={<Questionnaire />} />

        <Route path="/wellness" element={<Wellness />} />
      </Routes>
    </HashRouter>
  );
}

export default App;