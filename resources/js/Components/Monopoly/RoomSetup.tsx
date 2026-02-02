
import React from 'react';

interface RoomSetupProps {
    roomId: string;
    players: any[];
    roomStatus: string;
    onStartGame: () => void;
    onLeaveRoom: () => void;
    onUpdatePlayerName: (id: number, name: string) => void;
    onAddPlayer: () => void;
    onRemovePlayer: (id: number) => void;
}

const RoomSetup: React.FC<RoomSetupProps> = ({ roomId, players, roomStatus, onStartGame, onLeaveRoom, onUpdatePlayerName, onAddPlayer, onRemovePlayer }) => {
    return (
        <div className="fixed inset-0 z-[999] bg-slate-950 flex flex-col items-center justify-center font-sans overflow-hidden">

            {/* Fluid Background (Static) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Setup Glass Card */}
            <div className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col gap-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tighter">
                            GAME SETUP
                        </h1>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prepare your strategy</span>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-900/50 px-6 py-3 rounded-xl border border-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ROOM CODE:</span>
                        <span className="text-2xl font-mono font-black text-white tracking-widest">{roomId}</span>
                        <button onClick={() => navigator.clipboard.writeText(roomId)} className="text-slate-400 hover:text-white transition-colors" title="Copy">
                            📋
                        </button>
                    </div>
                </div>

                {/* Players Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                    {players.map((player, idx) => {
                        const colorMap: any = { red: 'bg-red-500', blue: 'bg-blue-500', green: 'bg-green-500', yellow: 'bg-yellow-500', orange: 'bg-orange-500', purple: 'bg-purple-500' };
                        const pColor = colorMap[player.color] || 'bg-gray-500';

                        return (
                            <div key={player.id} className="bg-slate-800/40 p-4 rounded-xl flex items-center gap-4 border border-white/5 relative group hover:bg-slate-800/60 transition-colors">
                                <div className={`w-10 h-10 rounded-full ${pColor} shadow-lg flex items-center justify-center text-white font-black text-sm`}>
                                    P{idx + 1}
                                </div>
                                <div className="flex-1">
                                    {/* Editable Name or Readonly if Playing */}
                                    {roomStatus === 'PLAYING' ? (
                                        <div className="w-full bg-transparent text-white font-bold text-lg py-1 border-b border-transparent">{player.name}</div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={player.name}
                                            onChange={(e) => onUpdatePlayerName(player.id, e.target.value)}
                                            className="w-full bg-transparent text-white font-bold border-b border-transparent focus:border-white/50 focus:outline-none transition-colors placeholder-slate-600"
                                            placeholder="Enter Name"
                                        />
                                    )}
                                    <div className="text-[0.6rem] text-slate-500 font-bold uppercase tracking-wider mt-1">Player {idx + 1}</div>
                                </div>
                                {players.length > 2 && roomStatus !== 'PLAYING' && (
                                    <button onClick={() => onRemovePlayer(player.id)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-bold px-2">
                                        ✕
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {/* Add Player Slot - Only if not Playing */}
                    {players.length < 6 && roomStatus !== 'PLAYING' && (
                        <button onClick={onAddPlayer} className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 transition-all group h-[88px]">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">+</div>
                            <span className="font-bold text-sm uppercase tracking-wide">Add Slot</span>
                        </button>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col md:flex-row items-center gap-4 pt-4 border-t border-white/10 mt-auto">
                    <button
                        onClick={onLeaveRoom}
                        className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full md:w-auto"
                    >
                        ← Leave Room
                    </button>
                    <button
                        onClick={onStartGame}
                        className="flex-1 w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {roomStatus === 'PLAYING' ? 'RESUME GAME SESSION' : 'START GAME SESSION'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomSetup;
