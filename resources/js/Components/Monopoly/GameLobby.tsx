
import React from 'react';

interface GameLobbyProps {
    rooms: any[];
    onCreateRoom: () => void;
    onJoinRoom: (room: any) => void;
    onDeleteRoom: (code: string, e: React.MouseEvent) => void;
    onResetRooms: () => void;
    onToggleMusic: () => void;
    isMusicPlaying: boolean;
}

const GameLobby: React.FC<GameLobbyProps> = ({ rooms, onCreateRoom, onJoinRoom, onDeleteRoom, onResetRooms, onToggleMusic, isMusicPlaying }) => {
    return (
        <div className="fixed inset-0 z-[999] bg-slate-950 flex flex-col items-center justify-center font-sans overflow-hidden">

            {/* Fluid Background (Static) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-red-900/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Glass Card Container */}
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-10">

                {/* Modern Logo */}
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter mb-3 drop-shadow-lg">
                        MONOPOLY
                    </h1>
                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-3"></div>
                    <span className="text-[0.65rem] font-bold text-red-500 tracking-[0.4em] uppercase opacity-80">E-Governance Edition</span>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-4">
                    {rooms.length < 6 && (
                        <button
                            onClick={onCreateRoom}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm tracking-widest rounded-xl shadow-lg shadow-red-900/30 hover:shadow-red-900/60 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            START NEW GAME
                        </button>
                    )}

                    {/* Room List (Modern List) */}
                    <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-auto custom-scrollbar w-full px-1">
                        {rooms.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-xs font-medium italic border border-dashed border-slate-800 rounded-xl">
                                No active sessions found
                            </div>
                        )}
                        {rooms.map(room => (
                            <div key={room.id} onClick={() => onJoinRoom(room)}
                                className="cursor-pointer group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-500/50 rounded-xl p-4 transition-all flex items-center justify-between"
                            >
                                <div className="flex flex-col">
                                    <span className="text-slate-200 font-bold text-sm tracking-wide">ROOM {room.code}</span>
                                    <span className="text-slate-500 text-[0.6rem] font-bold uppercase tracking-wider">{room.status} • {room.players?.length || 0} P</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteRoom(room.code, e); }}
                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-slate-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete this room"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    </button>
                                    <div className="text-slate-600 group-hover:text-white transition-colors transform group-hover:translate-x-1 pl-2 border-l border-slate-700">→</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer / Utilities */}
                <div className="flex items-center gap-6 text-[0.6rem] font-bold text-slate-600 uppercase tracking-widest">
                    <button onClick={onResetRooms} className="hover:text-red-400 transition-colors">Reset All</button>
                    <span className="opacity-30">•</span>
                    <button onClick={onToggleMusic} className="hover:text-slate-300 transition-colors">{isMusicPlaying ? 'Mute Music' : 'Play Music'}</button>
                </div>
            </div>

            {/* Simple Footer */}
            <div className="absolute bottom-6 text-[0.55rem] text-slate-700 font-medium tracking-[0.3em] opacity-50">
                SMART MONOPOLY © 2026
            </div>
        </div>
    );
};

export default GameLobby;
