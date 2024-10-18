import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages";
import Toevoegen from "./pages/Toevoegen";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Aanmaak from "./pages/Accountaanmaak";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Index />} />
        <Route path="/toevoegen" element={<Toevoegen />} />
        <Route path="/Aanmelden" element={<Aanmaak />} />
        <Route path="/Inloggen" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
