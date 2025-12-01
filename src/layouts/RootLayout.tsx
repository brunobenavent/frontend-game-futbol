import { Outlet, useLocation } from 'react-router-dom';
import { Home, BarChart3, Settings, LogOut, TrendingUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../store/authStore';

const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Pronósticos', path: '/picks', icon: TrendingUp },
    { name: 'Clasificación', path: '/ranking', icon: BarChart3 },
    { name: 'Perfil', path: '/settings', icon: User },
];

export default function RootLayout() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const location = useLocation();

    // No mostrar navegación en login/register
    const isAuthRoute = location.pathname.includes('/login') || location.pathname.includes('/register');
    
    return (
        <div className="min-h-screen bg-slate-100 pb-20 md:pb-0">
            {/* --- HEADER (NavBar Superior - Solo Logo/Perfil en móvil, fijo en desktop) --- */}
            <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-black text-purple-600">
                    Survivor ⚽️
                </h1>
                
                <div className="flex items-center gap-3">
                    {isAuthenticated && (
                        <>
                            <span className="text-sm font-semibold hidden sm:block">{user?.alias}</span>
                            <Button onClick={logout} variant="ghost" size="icon">
                                <LogOut className="h-5 w-5 text-red-500" />
                            </Button>
                        </>
                    )}
                    {!isAuthenticated && !isAuthRoute && (
                         <Link to="/login"><Button size="sm">Acceder</Button></Link>
                    )}
                </div>
            </header>

            {/* --- CONTENIDO DE LA RUTA --- */}
            <div className="max-w-xl mx-auto p-0 md:p-6">
                <Outlet /> {/* Aquí se renderiza el contenido de la ruta hija */}
            </div>


            {/* --- NAV INFERIOR (Móvil First) --- */}
            {isAuthenticated && !isAuthRoute && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-300 z-50">
                    <div className="flex items-center justify-around py-2">
                        {navItems.map(item => (
                            <Link key={item.name} to={item.path} className={`flex flex-col items-center gap-1 p-2 ${location.pathname === item.path ? 'text-purple-600 font-bold' : 'text-neutral-500'}`}>
                                <item.icon className="h-6 w-6" />
                                <span className="text-[10px]">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </div>
    );
}