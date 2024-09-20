import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages";
import Toevoegen from "./pages/Toevoegen";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Index />} />
        <Route path="/toevoegen" element={<Toevoegen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
