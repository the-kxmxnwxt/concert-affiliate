import logo from './logo.svg';
import Navbar from './Components/Navbar';
//import AngelgangService from './Pages/AngelgangService';
import MicrowaveService from './Pages/MicrowaveService';
import CapibaraService from './Pages/CapibaraService';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // import Router
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/microwave" element={<MicrowaveService />} />
          <Route path="/capibara" element={<CapibaraService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
