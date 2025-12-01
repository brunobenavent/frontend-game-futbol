import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MatchCard, type MatchData } from "@/components/MatchCard";
import { Trophy, Skull, Users } from "lucide-react";

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        // 1. Info del juego y jugadores
        const gameRes = await api.get(`/game/${id}`);
        setGame(gameRes.data);
        setPlayers(gameRes.data.players);

        // 2. Partidos (Para filtrar los 3 relevantes)
        // Ojo: Idealmente la API debería darte ya los filtrados, pero lo hacemos aquí por ahora
        const matchesRes = await api.get('/matches/current-round');
        const allMatches = matchesRes.data.matches;
        
        // Lógica de filtrado: 3 partidos relevantes
        // Prioridad: LIVE > Recién terminados > Próximos
        const live = allMatches.filter((m: any) => m.status === 'LIVE');
        const scheduled = allMatches.filter((m: any) => m.status === 'SCHEDULED');
        const finished = allMatches.filter((m: any) => m.status === 'FINISHED');
        
        let relevantMatches = [...live];
        if (relevantMatches.length < 3) {
            // Si faltan, rellenamos con los próximos inmediatos
            relevantMatches = [...relevantMatches, ...scheduled].slice(0, 3);
        }
        // Si aún faltan (ej: domingo noche), rellenamos con los últimos acabados
        if (relevantMatches.length < 3) {
             relevantMatches = [...relevantMatches, ...finished.slice(-3)];
        }
        
        setMatches(relevantMatches);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadGameData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Cargando juego...</div>;
  if (!game) return <div className="p-10 text-center">Juego no encontrado</div>;

  const aliveCount = players.filter(p => p.isAlive).length;
  const deadCount = players.length - aliveCount;

  return (
    <div className="space-y-6">
      
      {/* CABECERA DE ESTADÍSTICAS */}
      <Card className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
        
        <h1 className="text-2xl font-black mb-1">{game.name}</h1>
        <p className="text-slate-400 text-sm mb-6">Temporada {game.season.name}</p>
        
        <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-xl font-bold">{game.pot}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Bote</div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm">
                <Users className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-xl font-bold">{aliveCount}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Vivos</div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm">
                <Skull className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <div className="text-xl font-bold">{deadCount}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Caídos</div>
            </div>
        </div>
      </Card>

      {/* PARTIDOS DESTACADOS */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 px-1">En el foco</h3>
        <div className="space-y-2">
            {matches.map(m => <MatchCard key={m._id} match={m} />)}
        </div>
      </div>

      {/* LISTA DE JUGADORES */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 px-1">Jugadores</h3>
        <Card className="divide-y divide-slate-100">
            {players.map((player) => (
                <div key={player._id} className="flex items-center justify-between p-3 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-300 w-6">#{player.playerNumber}</span>
                        <Avatar className="h-10 w-10 border border-slate-100">
                            <AvatarImage src={player.user.avatar} />
                            <AvatarFallback>{player.user.alias[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className={`text-sm font-bold ${player.isAlive ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                                {player.user.alias}
                            </p>
                            <p className="text-[10px] text-slate-400">
                                {player.isAlive ? '🟢 Sobreviviendo' : '🔴 Eliminado J' + (player.picks[player.picks.length-1]?.round || '?')}
                            </p>
                        </div>
                    </div>
                    
                    {/* Aquí podrías poner el escudo del equipo que eligió si quieres mostrarlo público */}
                </div>
            ))}
        </Card>
      </div>

    </div>
  );
}