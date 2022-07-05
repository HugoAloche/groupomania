import {
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home';
import Profile from './components/Profile';
import Hub from './components/Hub';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/hub" element={<Hub />} />
    </Routes>
  );
}

export default App;
