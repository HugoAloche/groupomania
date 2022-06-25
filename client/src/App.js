import {
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home';
import Profile from './components/Profile';
import Company from './components/Company';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/company" element={<Company />} />
    </Routes>
  );
}

export default App;
