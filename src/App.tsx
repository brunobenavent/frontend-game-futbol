import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import LoginPage from './pages/Login'; // Necesitas crear esta página
import RegisterPage from './pages/Register'; // Necesitas crear esta página
import DashboardPage from './pages/DashboardPage'; // Necesitas crear esta página
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';
import GameDetailPage from './pages/GameDetailPage';

// Componente para proteger rutas
const PrivateRoute = ({ element: Element }: { element: React.FC }) => {
    const { isAuthenticated } = useAuthStore();
    
    // Si no está autenticado, redirige al login
    return isAuthenticated ? <Element /> : <Navigate to="/login" replace />;
};

function App() {
    const initializeAuth = useAuthStore((state) => state.initialize);

    // Inicializa el estado de autenticación al montar la app
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <BrowserRouter>
            <Toaster position="top-center" />
            <Routes>
                {/* RUTAS SIN LAYOUT (Ej: Pantalla de carga o splash) */}
                
                {/* RUTAS CON LAYOUT (RootLayout manejará el Header/Footer) */}
                <Route path="/" element={<RootLayout />}>
                    
                    {/* RUTAS PÚBLICAS */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    {/* Aquí iría /verify, /forgot-password, etc. */}

                    {/* RUTAS PRIVADAS */}
                    <Route index element={<PrivateRoute element={DashboardPage} />} /> 
                    <Route path="/picks" element={<PrivateRoute element={DashboardPage} />} /> 
                    <Route path="/ranking" element={<PrivateRoute element={DashboardPage} />} />
                    <Route path="/settings" element={<PrivateRoute element={DashboardPage} />} />
                    
                    {/* Fallback para 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                    <Route path="/game/:id" element={<PrivateRoute element={GameDetailPage} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;