
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// --- TYPES ---
interface PropertyLevel {
    id: number;
    level: number;
    upgrade_cost: number;
    risk_Mitigation_fraud: number;
    sdg_benefit: number;
}

interface Property {
    id: number;
    name: string;
    slug: string;
    type: string;
    base_price: string;
    levels: PropertyLevel[];
    board_position?: number; 
}

interface TileData {
    index: number;
    type: 'START' | 'PROPERTY' | 'CHANCE' | 'JAIL' | 'FREE_PARKING' | 'GO_TO_JAIL' | 'TAX' | 'UTILITY';
    name: string;
    property?: Property;
    color?: string; 
}

interface PageProps {
    properties: Property[];
}

// --- ASSETS & HELPERS ---
const generateBoardTiles = (dbProperties: Property[]): TileData[] => {
    const tiles: TileData[] = Array(40).fill(null).map((_, i) => ({
        index: i,
        type: 'PROPERTY',
        name: `Land #${i}`,
        color: 'bg-gray-200'
    }));

    tiles[0] = { index: 0, type: 'START', name: 'START', color: 'bg-green-100' };
    tiles[10] = { index: 10, type: 'JAIL', name: 'JAIL', color: 'bg-gray-400' };
    tiles[20] = { index: 20, type: 'FREE_PARKING', name: 'FREE PARK', color: 'bg-blue-100' };
    tiles[30] = { index: 30, type: 'GO_TO_JAIL', name: 'GO TO JAIL', color: 'bg-red-100' };

    dbProperties.forEach(p => {
        let slot = -1;
        let color = 'bg-indigo-300';
        
        if (p.slug === 'hotel-budget') { slot = 1; color = 'bg-purple-400'; }
        else if (p.slug === 'laundry') { slot = 3; color = 'bg-orange-400'; }
        
        if (slot !== -1) {
            tiles[slot] = {
                index: slot,
                type: 'PROPERTY',
                name: p.name,
                property: p,
                color: color
            };
        }
    });

    return tiles;
};

// --- 3D DICE COMPONENT ---
const Dice3D = ({ value, rolling }: { value: number, rolling: boolean }) => {
    // Mapping dot positions for standard dice faces
    const dotPositions: Record<number, string[]> = {
        1: ['justify-center items-center'],
        2: ['justify-between'], // Top-left, Bottom-right handled by inner logic? simplistic 2 dots
        3: ['justify-between'],
        4: ['justify-between'],
        5: ['justify-between'],
        6: ['justify-between']
    };

    // Helper to render dots based on number
    const renderDots = (val: number) => {
        const dots = [];
        if (val === 1) dots.push(<div key="1" className="w-3 h-3 bg-black rounded-full"></div>);
        else if (val === 2) {
             dots.push(<div key="1" className="w-3 h-3 bg-black rounded-full self-start"></div>);
             dots.push(<div key="2" className="w-3 h-3 bg-black rounded-full self-end"></div>);
        } else if (val === 3) {
             dots.push(<div key="1" className="w-3 h-3 bg-black rounded-full self-start"></div>);
             dots.push(<div key="2" className="w-3 h-3 bg-black rounded-full self-center"></div>);
             dots.push(<div key="3" className="w-3 h-3 bg-black rounded-full self-end"></div>);
        } else if (val === 4) {
            return (
                <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                    <div className="w-3 h-3 bg-black rounded-full"></div><div className="w-3 h-3 bg-black rounded-full justify-self-end"></div>
                    <div className="w-3 h-3 bg-black rounded-full self-end"></div><div className="w-3 h-3 bg-black rounded-full self-end justify-self-end"></div>
                </div>
            )
        } else if (val === 5) {
             return (
                <div className="relative w-full h-full p-1">
                    <div className="absolute top-1 left-1 w-3 h-3 bg-black rounded-full"></div> <div className="absolute top-1 right-1 w-3 h-3 bg-black rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full"></div>
                    <div className="absolute bottom-1 left-1 w-3 h-3 bg-black rounded-full"></div> <div className="absolute bottom-1 right-1 w-3 h-3 bg-black rounded-full"></div>
                </div>
            )
        } else if (val === 6) {
             return (
                <div className="grid grid-cols-2 gap-0.5 w-full h-full p-1">
                    <div className="w-3 h-3 bg-black rounded-full"></div><div className="w-3 h-3 bg-black rounded-full justify-self-end"></div>
                    <div className="w-3 h-3 bg-black rounded-full"></div><div className="w-3 h-3 bg-black rounded-full justify-self-end"></div>
                    <div className="w-3 h-3 bg-black rounded-full"></div><div className="w-3 h-3 bg-black rounded-full justify-self-end"></div>
                </div>
            )
        }

        return <div className={`flex w-full h-full p-2 ${dotPositions[val]}`}>{dots}</div>;
    };

    return (
        <div className={`w-16 h-16 bg-white rounded-xl shadow-[0_5px_0_#ccc] border-2 border-gray-100 flex items-center justify-center transform transition-transform duration-500 ${rolling ? 'animate-spin' : ''}`}>
           {renderDots(value)}
        </div>
    );
};


export default function Dashboard({ properties }: PageProps) {
    const [dice, setDice] = useState<[number, number]>([1, 1]);
    const [isRolling, setIsRolling] = useState(false);
    const [playerPosition, setPlayerPosition] = useState(0);
    const boardTiles = generateBoardTiles(properties);
    const [logs, setLogs] = useState<string[]>([
        "> System Initialized...",
        "> Welcome to Smart Monopoly V.1.0",
        "> Market Data Loaded.",
    ]);

    const addLog = (msg: string) => {
        setLogs(prev => [msg, ...prev.slice(0, 5)]);
    };

    // Grid Mapping (Same as before)
    const getGridStyle = (index: number) => {
        let row = 1;
        let col = 1;
        if (index >= 0 && index <= 10) { row = 11; col = 11 - index; } 
        else if (index >= 11 && index <= 20) { col = 1; row = 11 - (index - 10); } 
        else if (index >= 21 && index <= 30) { row = 1; col = 1 + (index - 20); } 
        else if (index >= 31 && index <= 39) { col = 11; row = 1 + (index - 30); }
        return { gridRow: row, gridColumn: col };
    };

    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);
        addLog("> Rolling dice...");

        setTimeout(() => {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            setDice([d1, d2]);
            
            const total = d1 + d2;
            const newPos = (playerPosition + total) % 40;
            setPlayerPosition(newPos);
            
            addLog(`> Rolled ${total} (${d1} + ${d2}). Moving to #${newPos}`);
            setIsRolling(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black flex items-center justify-center p-6 font-sans text-white">
            <Head title="Smart Monopoly" />

            <div className="flex w-full max-w-[1600px] h-[95vh] gap-8">
                
                {/* --- LEFT: THE BOARD (Now with Glass Effect) --- */}
                <div className="flex-grow relative bg-[#CDE6D0] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border-[12px] border-[#8B0000]">
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none"></div>

                    {/* Center Branding */}
                    <div className="absolute inset-[13%] flex flex-col items-center justify-center transform -rotate-45 opacity-15 pointer-events-none select-none">
                        <h1 className="text-9xl font-black text-[#5C0000] tracking-tighter drop-shadow-lg">SMART</h1>
                        <h1 className="text-8xl font-black text-[#5C0000] tracking-widest drop-shadow-md">OPOLY</h1>
                        <p className="mt-4 text-2xl font-bold uppercase tracking-[0.5em] text-red-900">Business Simulation</p>
                    </div>

                    {/* The Grid Container */}
                    <div className="absolute inset-0 grid grid-rows-11 grid-cols-11 gap-0.5 box-border p-1">
                        {boardTiles.map((tile) => {
                            const gridStyle = getGridStyle(tile.index);
                            return (
                                <div 
                                    key={tile.index}
                                    style={gridStyle}
                                    className={`
                                        relative border-[0.5px] border-gray-600/30 flex flex-col justify-between 
                                        ${tile.color || 'bg-[#DBEGD6]'} 
                                        transition-all duration-300
                                        ${tile.index === playerPosition ? 'z-20 scale-105 shadow-[0_0_20px_rgba(255,255,0,0.6)] ring-2 ring-yellow-400' : 'hover:scale-110 hover:z-10 hover:shadow-lg'}
                                    `}
                                >
                                    {/* Property Header (Color Bar) */}
                                    {tile.type === 'PROPERTY' && (
                                        <div className={`h-[22%] w-full border-b border-black/20 ${tile.color}`}></div>
                                    )}
                                    
                                    {/* Tile Content */}
                                    <div className="flex-grow flex flex-col justify-center items-center text-center p-1">
                                        <span className="text-[0.6rem] font-bold leading-tight text-gray-800 uppercase">{tile.name}</span>
                                        {tile.property && (
                                            <span className="text-[0.5rem] font-mono text-gray-600 mt-1">
                                               {/* Rp {parseInt(tile.property.base_price)/1_000_000}M */}
                                            </span>
                                        )}
                                    </div>

                                    {/* Player Pawn */}
                                    {tile.index === playerPosition && (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-red-400 border-2 border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] animate-bounce"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- RIGHT: CONTROL PANEL (Futuristic Dashboard) --- */}
                <div className="w-[400px] flex flex-col gap-6">
                    
                    {/* 1. Player Card */}
                    <div className="relative overflow-hidden bg-slate-800/80 backdrop-blur-xl border border-slate-600 rounded-2xl p-6 shadow-2xl">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-40"></div>
                        
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-sm font-bold text-blue-400 tracking-wider uppercase">Player 1</h2>
                                <h1 className="text-3xl font-bold text-white">CEO (You)</h1>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white/20 shadow-lg"></div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-black/30 rounded-lg p-3 border border-white/5 flex justify-between items-center">
                                <span className="text-gray-400 text-sm">CASH BALANCE</span>
                                <span className="text-2xl font-mono font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                                    Rp 500<span className="text-sm">M</span>
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-black/30 p-2 rounded border border-white/5 text-center">
                                    <div className="text-xs text-gray-400 uppercase mb-1">Fatigue</div>
                                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                        <div className="bg-red-500 w-[10%] h-full"></div>
                                    </div>
                                    <div className="text-xs text-right mt-1 text-red-400 font-mono">10%</div>
                                </div>
                                <div className="bg-black/30 p-2 rounded border border-white/5 text-center">
                                    <div className="text-xs text-gray-400 uppercase mb-1">Risk Score</div>
                                    <div className="text-lg font-bold text-yellow-500">LOW</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Action Area (Dice & Log) */}
                    <div className="flex-grow bg-slate-800/80 backdrop-blur-xl border border-slate-600 rounded-2xl p-6 shadow-2xl flex flex-col">
                        
                        {/* Terminal Log */}
                        <div className="flex-grow bg-[#0c0c0c] rounded-lg border border-gray-700 p-4 font-mono text-xs overflow-hidden relative mb-6">
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 shadow-[0_0_10px_#22c55e]"></div>
                            <div className="space-y-1 h-full overflow-y-auto custom-scrollbar">
                                {logs.map((log, i) => (
                                    <div key={i} className={`${i === 0 ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dice Area */}
                        <div className="flex justify-center gap-8 mb-8 perspective-[1000px]">
                            <Dice3D value={dice[0]} rolling={isRolling} />
                            <Dice3D value={dice[1]} rolling={isRolling} />
                        </div>

                        {/* Main Button */}
                        <button 
                            onClick={rollDice}
                            disabled={isRolling}
                            className={`
                                group relative w-full py-4 rounded-xl font-black text-xl tracking-widest uppercase transition-all duration-200
                                ${isRolling 
                                    ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-[1.02] active:scale-[0.98]'
                                }
                            `}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isRolling ? 'ROLLING...' : 'ROLL DICE'}
                                {!isRolling && <span className="text-2xl">🎲</span>}
                            </span>
                        </button>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold border border-slate-500 transition-colors text-gray-300">
                                Trade Asset
                            </button>
                            <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold border border-slate-500 transition-colors text-gray-300">
                                Portfolio
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
