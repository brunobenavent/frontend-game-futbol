import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
 // <--- Importa tu página nueva
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* ... otras rutas ... */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;