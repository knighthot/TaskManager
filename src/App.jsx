// Import library utama
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GrupPage from './pages/GrupPage';
import TugasPage from './pages/TugasPage';
import SubtaskPage from './pages/SubTaskPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<GrupPage />} />
          <Route path="/tugas/:grupId" element={<TugasPage />} />
          <Route path="/subtasks/:taskId" element={<SubtaskPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;