import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MatchCard, type MatchData } from "@/components/MatchCard";
import api from "../lib/api";
import { Trophy, Users, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [myGames, setMyGames] = useState<any[]>([]);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Juegos
        const gamesRes = await api.get('/game/dashboard');
        setMyGames(gamesRes.data.myGames);
        setAvailableGames(gamesRes.data.availableGames);

        // 2. Jornada
        const matchesRes = await api.get('/matches/current-round');
        setMatches(matchesRes.data.matches);
        setCurrentRound(matchesRes.data.currentRound);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="space-y-6">
      
      {/* SECCIÓN 1: MIS JUEGOS */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3 px-1">Mis Juegos Activos</h2>
        {myGames.length > 0 ? (
            <div className="grid gap-3">
                {myGames.map((entry) => (
                    <Link key={entry._id} to={`/game/${entry.game._id}`}>
                        <Card className="p-4 bg-white border-l-4 border-l-purple-500 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800">{entry.game.name}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${entry.isAlive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {entry.isAlive ? 'Estás Vivo' : 'Eliminado'} • Ronda {entry.game.currentRound}
                                    </p>
                                </div>
                                <ArrowRight className="text-slate-300 w-5 h-5" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100">
                No estás inscrito en ningún juego. ¡Únete a uno abajo!
            </div>
        )}
      </div>

      {/* SECCIÓN 2: JUEGOS DISPONIBLES (Si no estás en ninguno o quieres más) */}
      {availableGames.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3 px-1">Unirse a un Juego</h2>
            <div className="grid gap-3">
                {availableGames.map((game) => (
                    <Card key={game._id} className="p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{game.name}</h3>
                            <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><Trophy className="w-3 h-3"/> {game.pot} Tkn</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {game.entryPrice} Entrada</span>
                            </div>
                        </div>
                        <Link to={`/game/${game._id}`}>
                            <Button size="sm" variant="outline">Ver</Button>
                        </Link>
                    </Card>
                ))}
            </div>
          </div>
      )}

      {/* SECCIÓN 3: PARTIDOS DE LA JORNADA */}
      <div>
        <div className="flex justify-between items-end mb-3 px-1">
            <h2 className="text-lg font-bold text-slate-800">Jornada {currentRound}</h2>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">En curso</span>
        </div>
        <div className="space-y-3">
            {matches.map(match => <MatchCard key={match._id} match={match} />)}
        </div>
      </div>
    </div>
  );
}