import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Toevoegen from "./pages/Toevoegen";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Aanmaak from "./pages/Accountaanmaak";
import Huizen from "./pages/Huizen";
import Account from "./pages/Account";
import SlimmeApparaten from "./pages/SlimmeApparaten";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Index />} />
        <Route path="/toevoegen" element={<Toevoegen />} />
        <Route path="/Aanmelden" element={<Aanmaak />} />
        <Route path="/Inloggen" element={<Login />} />
        <Route path="/Huizen" element={<Huizen />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Slimmeapparaten" element={<SlimmeApparaten />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
