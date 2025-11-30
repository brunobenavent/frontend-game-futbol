import { Home, TrendingUp, BarChart3, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom"; // <--- CAMBIO VITE

// Datos falsos (Mock) para ver el diseño
const playerNames = [
  "El Gladiador", "Reina Roja", "Sniper Gol", "Mago del Balón"
];

const teamColors = [
  ["bg-neutral-300", "bg-red-900"],
  ["bg-red-700", "bg-orange-600"],
];

const players = playerNames.map((name, index) => ({
  id: index + 1,
  name,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // Avatar aleatorio
  initials: name.split(" ").map((n) => n[0]).join(""),
  teams: teamColors[index % teamColors.length],
}));

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white md:bg-neutral-200 pb-20">
      {/* Header */}
      <header className="hidden md:block px-6 sm:px-8 py-4 sm:py-6 bg-white shadow-sm mb-4">
        <h1 className="text-lg sm:text-xl font-medium text-neutral-600">Dashboard del Juego</h1>
      </header>

      {/* Main Content */}
      <main className="md:px-6 md:pb-8 max-w-2xl mx-auto">
        <Card className="rounded-none md:rounded-3xl shadow-none md:shadow-lg min-h-screen md:min-h-0 border-0 md:border">
          <div className="p-6 sm:p-8">
            {/* Title */}
            <h2 className="text-center text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Inicio</h2>

            {/* Jornada */}
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-600">Jornada 8</h3>
            </div>

            <div className="border-t border-neutral-200 mb-6 sm:mb-8" />

            {/* Matches */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {/* Match 1 - Live */}
              <div className="flex items-center justify-between gap-2 sm:gap-4 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <span className="font-semibold text-sm sm:text-base truncate">RMA</span>
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-neutral-200">
                    {/* IMAGEN NORMAL */}
                    <img
                      src="https://placehold.co/40x40/white/black?text=RM"
                      alt="Real Madrid"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>

                <div className="text-center flex-shrink-0">
                  <div className="text-lg sm:text-2xl font-bold">2 - 1</div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium animate-pulse">82'</div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-neutral-200">
                     <img
                      src="https://placehold.co/40x40/blue/red?text=FCB"
                      alt="Barcelona"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="font-semibold text-sm sm:text-base truncate">FCB</span>
                </div>
              </div>
            </div>

            {/* Players Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Jugadores</h3>
                <Select defaultValue="activos">
                  <SelectTrigger className="w-28 sm:w-32 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activos">Activos</SelectItem>
                    <SelectItem value="eliminados">Eliminados</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3 sm:space-y-4 pr-2">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center gap-2 sm:gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-neutral-500 w-6 text-sm">{player.id}</span>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>{player.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold flex-1 text-sm truncate">{player.name}</span>
                    
                    {/* Bolitas de Equipos */}
                    <div className="flex gap-1">
                      <div className={`w-6 h-6 rounded-full ${player.teams[0]}`}></div>
                      <div className={`w-6 h-6 rounded-full ${player.teams[1]}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
        <div className="flex items-center justify-around py-2 sm:py-3">
          <Link to="/">
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 text-purple-600">
              <Home className="h-5 w-5" />
              <span className="text-[10px]">Inicio</span>
            </Button>
          </Link>
          <Link to="/picks">
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 text-gray-500">
              <TrendingUp className="h-5 w-5" />
              <span className="text-[10px]">Jugar</span>
            </Button>
          </Link>
          <Link to="/ranking">
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 text-gray-500">
              <BarChart3 className="h-5 w-5" />
              <span className="text-[10px]">Ranking</span>
            </Button>
          </Link>
           <Link to="/settings">
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 text-gray-500">
              <Settings className="h-5 w-5" />
              <span className="text-[10px]">Ajustes</span>
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}