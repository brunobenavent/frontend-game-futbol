import React from 'react';
import { Clock } from 'lucide-react';

interface Team { name: string; logo: string; }
export interface MatchData {
    _id: string;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
    currentMinute: string | null;
    matchDate: string;
}

export const MatchCard = ({ match }: { match: MatchData }) => {
    const date = new Date(match.matchDate);
    
    // Formateo de fecha: "Viernes 5"
    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
    const dayNum = date.getDate();
    const formattedDate = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum}`;
    
    // Formateo de hora: "21:00"
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const isLive = match.status === 'LIVE';
    const isFinished = match.status === 'FINISHED';
    const isScheduled = match.status === 'SCHEDULED';

    return (
        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-purple-200 transition-all">
            
            {/* LOCAL */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-bold text-xs sm:text-sm truncate w-10 text-right text-slate-600">
                    {match.homeTeam.name.substring(0, 3).toUpperCase()}
                </span>
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-8 h-8 object-contain" />
            </div>

            {/* INFO CENTRAL */}
            <div className="flex flex-col items-center justify-center w-24 mx-2">
                {isScheduled ? (
                    <>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">{formattedDate}</span>
                        <div className="bg-slate-100 px-2 py-1 rounded-md mt-1">
                            <span className="text-xs font-bold text-slate-700">{time}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-xl font-black text-slate-800 leading-none tracking-tight">
                            {match.homeScore ?? 0} - {match.awayScore ?? 0}
                        </div>
                        {isLive && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-green-600">{match.currentMinute}</span>
                            </div>
                        )}
                        {isFinished && <span className="text-[10px] font-bold text-slate-400 mt-1">Finalizado</span>}
                    </>
                )}
            </div>

            {/* VISITANTE */}
            <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-8 h-8 object-contain" />
                <span className="font-bold text-xs sm:text-sm truncate w-10 text-left text-slate-600">
                    {match.awayTeam.name.substring(0, 3).toUpperCase()}
                </span>
            </div>
        </div>
    );
};