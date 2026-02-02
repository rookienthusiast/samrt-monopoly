
import React from 'react';
import Dice3D from './Dice3D';
import { TileData } from './MonopolyTypes';

interface ActiveGameProps {
    roomId: string;
    players: any[];
    turn: number;
    dice: [number, number];
    isRolling: boolean;
    diceTransforms: string[];
    diceRotations: string[];
    showDice: boolean;
    showTurnResult: boolean;
    rollTotal: number;
    isMoving: boolean;
    isJumping: boolean;
    landingTile: number | null;
    saveStatus: string;
    logs: string[];
    logsActive: boolean;
    showGameMenu: boolean;
    setShowGameMenu: (show: boolean) => void;
    boardTiles: TileData[];

    // Actions
    onRollDice: () => void;
    onResetGame: () => void;
    onExitGame: () => void;
    onSaveGame: () => void;
    toggleMusic: () => void;
    isMusicPlaying: boolean;
}

const ActiveGame: React.FC<ActiveGameProps> = (props) => {
    const {
        roomId, players, turn, dice, isRolling, diceTransforms, diceRotations, showDice, showTurnResult, rollTotal, isMoving, isJumping, landingTile, saveStatus, logs, logsActive, showGameMenu, setShowGameMenu, boardTiles,
        onRollDice, onResetGame, onExitGame, onSaveGame, toggleMusic, isMusicPlaying
    } = props;

    const getCurrentPlayer = () => players[turn % players.length];

    const getGridStyle = (index: number) => {
        let row = 1;
        let col = 1;
        if (index >= 0 && index <= 10) { row = 1; col = index + 1; }
        else if (index >= 11 && index <= 20) { col = 11; row = (index - 10) + 1; }
        else if (index >= 21 && index <= 30) { row = 11; col = 11 - (index - 20); }
        else if (index >= 31 && index <= 39) { col = 1; row = 11 - (index - 30); }
        return { gridRow: row, gridColumn: col };
    };

    return (
        <div className="absolute inset-0 p-0 grid grid-rows-11 grid-cols-11 gap-[1px] bg-gray-800 shadow-2xl"
            style={{
                // Border removed as per request (Frameless Design)
                border: 'none',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
                backgroundColor: '#475569', // Slate-600 for visible grout lines
                backgroundImage: `
                    // Glossy Shine
                    linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 100%),
                    // E-Gov Circuit Ornament Pattern
                    url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='1'%3E%3Cpath d='M10 10h20v20h-20z M50 10h20v20h-20z M10 50h20v20h-20z M50 50h20v20h-20z'/%3E%3Cpath d='M30 20h20 M20 30v20 M60 30v20 M30 60h20' stroke-dasharray='4 2'/%3E%3Ccircle cx='20' cy='20' r='2' fill='rgba(255,255,255,0.3)'/%3E%3Ccircle cx='60' cy='60' r='2' fill='rgba(255,255,255,0.3)'/%3E%3C/g%3E%3C/svg%3E"),
                    // Subtle Grid
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: 'cover, 80px 80px, 20px 20px, 20px 20px'
            }}
        >

            {/* Center Area UI (Decorated) */}
            <div className="col-start-2 col-end-11 row-start-2 row-end-11 m-0 relative flex flex-col items-center justify-between p-6 bg-white border border-black/5 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">

                {/* Center Top Player Info */}
                <div className="absolute top-8 left-8 z-[100] select-none transition-all duration-300">
                    {(() => {
                        const curPlayer = getCurrentPlayer();
                        const curTile = boardTiles[curPlayer.position || 0];
                        // Helper to get colors based on tile (Simplified inline)
                        const getTileColors = (t: any) => {
                            if (t.type === 'START') return { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', light: 'bg-red-50' };
                            if (t.type === 'EVENT' || t.color?.includes('yellow')) return { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-400', light: 'bg-yellow-50' };
                            if (t.color?.includes('sky-200')) return { bg: 'bg-sky-200', text: 'text-sky-700', border: 'border-sky-300', light: 'bg-sky-50' };
                            if (t.color?.includes('cyan-400')) return { bg: 'bg-cyan-400', text: 'text-cyan-700', border: 'border-cyan-500', light: 'bg-cyan-50' };
                            if (t.color?.includes('blue-300')) return { bg: 'bg-blue-300', text: 'text-blue-700', border: 'border-blue-400', light: 'bg-blue-50' };
                            if (t.color?.includes('blue-200')) return { bg: 'bg-blue-200', text: 'text-blue-600', border: 'border-blue-300', light: 'bg-blue-50' };
                            if (t.type === 'ZONE' || t.color?.includes('purple') || t.color?.includes('red')) return { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-400', light: 'bg-red-50' };
                            if (t.type === 'AUDIT' || t.type === 'CRISIS' || t.color?.includes('black')) {
                                if (t.color?.includes('red')) return { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', light: 'bg-red-50' };
                                return { bg: 'bg-gray-900', text: 'text-gray-800', border: 'border-gray-700', light: 'bg-gray-100' };
                            }
                            if (t.color?.includes('orange')) return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-400', light: 'bg-orange-50' };
                            if (t.color?.includes('green')) return { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-400', light: 'bg-green-50' };
                            if (t.color?.includes('pink')) return { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-400', light: 'bg-pink-50' };
                            if (t.color?.includes('blue')) return { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-400', light: 'bg-blue-50' };
                            return { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50' };
                        };
                        const colors = getTileColors(curTile);

                        return (
                            <div className="flex flex-col items-start gap-0 mt-4 select-none animate-[fadeIn_0.5s_ease-out]">
                                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Turn</span>
                                {(() => {
                                    // Player Color Mapping
                                    const pColorMap: Record<string, string> = {
                                        red: 'text-red-500',
                                        blue: 'text-blue-500',
                                        green: 'text-green-500',
                                        yellow: 'text-yellow-400',
                                        orange: 'text-orange-500',
                                        purple: 'text-purple-500',
                                    };
                                    const playerTextColor = pColorMap[curPlayer.color] || 'text-white';

                                    return (
                                        <span className={`text-3xl font-black ${playerTextColor} tracking-tighter uppercase leading-none drop-shadow-sm`}>
                                            {curPlayer.name}
                                        </span>
                                    );
                                })()}
                                <div className="flex items-center gap-2 mt-2 opacity-60">
                                    <div className={`w-2 h-2 rounded-full ${colors.bg}`}></div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{curTile.name}</span>
                                </div>
                            </div>
                        );
                    })()}

                </div>

                {/* Game Menu Overlay */}
                {showGameMenu && (
                    <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-white p-6 w-full max-w-sm flex flex-col gap-3 shadow-2xl">
                            <h3 className="text-2xl font-[1000] text-gray-800 text-center uppercase italic mb-2">Game Paused</h3>

                            <button
                                onClick={onSaveGame}
                                className="py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg"
                            >
                                SAVE GAME (Cloud)
                            </button>

                            <button
                                onClick={() => setShowGameMenu(false)}
                                className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg"
                            >
                                RESUME GAME
                            </button>

                            <div className="h-px bg-gray-200 my-1"></div>

                            <button
                                onClick={onResetGame}
                                className="py-3 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl shadow-lg"
                            >
                                RESET GAME
                            </button>

                            <button
                                onClick={onExitGame}
                                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl"
                            >
                                EXIT TO LOBBY
                            </button>
                        </div>
                    </div>
                )}

                {/* Top Right Controls - Minimalist No BG */}
                <div className="absolute top-6 right-8 z-[100] select-none flex items-center gap-6">
                    <button
                        onClick={toggleMusic}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        title={isMusicPlaying ? "Mute" : "Unmute"}
                    >
                        {isMusicPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zT12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                        )}
                    </button>

                    {/* Options Button - Gear Icon */}
                    <button
                        onClick={() => setShowGameMenu(true)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        title="Settings"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84a.484.484 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.8 8.91a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.27.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>
                    </button>
                </div>

                {/* Card Placement: Reverted to 2 Large Side Columns */}
                <div className="absolute inset-x-0 inset-y-0 z-20 pointer-events-none p-12">

                    {/* Left Side: 1-3 */}
                    <div className="absolute top-1/4 left-16 flex flex-col gap-10">
                        <div className="group rotate-[12deg] opacity-75 hover:opacity-100 transition-opacity flex items-center gap-5">
                            <div className="w-20 h-28 bg-blue-600 rounded-lg border-2 border-blue-400 shadow-xl relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1/3 bg-white/20"></div>
                                <span className="text-[0.45rem] font-bold text-white/40 rotate-[-45deg]">EST.</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[0.75rem] font-black text-black leading-tight uppercase tracking-tight">Ethics & <br />Governance</span>
                                <span className="text-[0.45rem] font-bold text-blue-600">ZONA: CONTROL ENVIRONMENT</span>
                            </div>
                        </div>
                        <div className="group rotate-[6deg] opacity-75 hover:opacity-100 transition-opacity flex items-center gap-5">
                            <div className="w-20 h-28 bg-yellow-400 rounded-lg border-2 border-yellow-500 shadow-xl relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1/3 bg-white/30"></div>
                                <span className="text-[0.45rem] font-bold text-black/20 rotate-[-45deg]">RISK.</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[0.75rem] font-black text-black leading-tight uppercase tracking-tight">Risk <br />Scenario</span>
                                <span className="text-[0.45rem] font-bold text-yellow-600">ZONA: RISK ASSESSMENT</span>
                            </div>
                        </div>
                        <div className="group rotate-[2deg] opacity-75 hover:opacity-100 transition-opacity flex items-center gap-5">
                            <div className="w-20 h-28 bg-indigo-500 rounded-lg border-2 border-indigo-400 shadow-xl relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1/3 bg-white/20"></div>
                                <span className="text-[0.45rem] font-bold text-white/30 rotate-[-45deg]">CTRL.</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[0.75rem] font-black text-black leading-tight uppercase tracking-tight">Audit & <br />Control</span>
                                <span className="text-[0.45rem] font-bold text-indigo-600">ZONA: CONTROL ACTIVITIES</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: 4-6 */}
                    <div className="absolute top-1/4 right-16 flex flex-col gap-10 items-end">
                        <div className="group rotate-[-12deg] opacity-75 hover:opacity-100 transition-opacity flex flex-row-reverse items-center gap-5 text-right">
                            <div className="w-20 h-28 bg-teal-500 rounded-lg border-2 border-teal-300 shadow-xl relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1/3 bg-white/20"></div>
                                <span className="text-[0.45rem] font-bold text-white/40 rotate-[45deg]">COMM.</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[0.75rem] font-black text-black leading-tight uppercase tracking-tight">Reporting & <br />Disclosure</span>
                                <span className="text-[0.45rem] font-bold text-teal-600">ZONA: INFORMATION & <br />COMMUNICATION</span>
                            </div>
                        </div>
                        <div className="group rotate-[-6deg] opacity-75 hover:opacity-100 transition-opacity flex flex-row-reverse items-center gap-5 text-right">
                            <div className="w-20 h-28 bg-emerald-600 rounded-lg border-2 border-emerald-400 shadow-xl relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1/3 bg-white/20"></div>
                                <span className="text-[0.45rem] font-bold text-white/30 rotate-[45deg]">EVAL.</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[0.75rem] font-black text-black leading-tight uppercase tracking-tight">Evaluation & <br />Improvement</span>
                                <span className="text-[0.45rem] font-bold text-emerald-600">ZONA: MONITORING ACTIVITIES</span>
                            </div>
                        </div>
                        <div className="group rotate-[-2deg] opacity-75 hover:opacity-100 transition-opacity flex flex-row-reverse items-center gap-5 text-right">
                            <div className="w-20 h-28 bg-black rounded-lg border-2 border-red-600 shadow-xl relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1/3 bg-red-900/30"></div>
                                <span className="text-[0.45rem] font-bold text-red-600/40 rotate-[45deg]">FRAUD.</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[0.75rem] font-black text-black leading-tight uppercase tracking-tight">Fraud Event & <br />Investment</span>
                                <span className="text-[0.45rem] font-bold text-red-600 uppercase italic">ZONA: CROSS-ZONE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Classic Monopoly Style Logo (Slanted Red Banner) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
                    {/* Rich CEO Character Peeking */}
                    <div className="relative mb-[-60px] ml-[240px] transform -rotate-[15deg] opacity-90 scale-125 z-0">
                        {/* Hat */}
                        <div className="w-16 h-12 bg-black rounded-sm relative">
                            <div className="absolute -bottom-1 -left-2 w-20 h-2 bg-black rounded-full"></div>
                            <div className="absolute bottom-2 left-0 w-full h-2 bg-red-700"></div>
                        </div>
                        {/* Face Area (Symbolic) */}
                        <div className="w-12 h-10 bg-[#fce3d5] mx-auto mt-[-2px] rounded-b-xl border-x border-b border-gray-300 relative">
                            {/* Moustache */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
                                <div className="w-0.5 h-full bg-gray-200"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-600 px-12 py-4 border-[6px] border-white shadow-[0_15px_40px_rgba(220,38,38,0.3)] transform -rotate-[20deg] z-10">
                        <h1 className="text-[6.5rem] font-[1000] text-white tracking-[-0.05em] leading-none drop-shadow-md">MONOPOLY</h1>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-4 py-1 border-2 border-red-600 rounded-sm">
                            <span className="text-red-700 font-black tracking-[0.3em] text-xs">E-GOVERNANCE EDITION</span>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col items-center justify-center flex-1 w-full relative z-20 p-4">

                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-[1000ms] ${showDice ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                        <Dice3D value={dice[0]} rolling={isRolling} transform={diceTransforms[0]} rotation={diceRotations[0]} color={getCurrentPlayer().color} />
                        <Dice3D value={dice[1]} rolling={isRolling} transform={diceTransforms[1]} rotation={diceRotations[1]} color={getCurrentPlayer().color} />
                    </div>

                    <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-50 transition-all duration-1000 ease-out ${showTurnResult ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'}`}>
                        <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-green-600 drop-shadow-lg tracking-tighter">
                            +{rollTotal}
                        </span>
                    </div>

                    <button
                        onClick={onRollDice}
                        disabled={isRolling || isMoving}
                        className={`
                        absolute bottom-12 z-50 bg-transparent text-slate-400 hover:text-red-500 p-2 
                        transition-all duration-300 transform group
                        ${(isRolling || isMoving)
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:scale-110 active:scale-95'
                            }
                    `}
                        title="Roll Dice"
                    >
                        <div className="flex flex-col items-center gap-1">
                            {/* Simple Dice Icon - Seamless */}
                            <svg className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <rect x="2" y="2" width="20" height="20" rx="4" />
                                <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
                                <circle cx="17" cy="17" r="1.5" fill="currentColor" stroke="none" />
                                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                                <circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none" />
                                <circle cx="7" cy="17" r="1.5" fill="currentColor" stroke="none" />
                            </svg>
                        </div>
                    </button>
                    {/* Auto-Save Status Log */}
                    <div className="absolute bottom-4 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500">
                        {saveStatus === 'saving' && <span className="text-[0.6rem] font-bold text-gray-400 animate-pulse">Sending to cloud...</span>}
                        {saveStatus === 'saved' && <span className="text-[0.6rem] font-bold text-green-500">✓ Saved</span>}
                        {saveStatus === 'error' && <span className="text-[0.6rem] font-bold text-red-500">⚠ Save Failed</span>}
                    </div>
                </div>



                {/* Bottom Area: Terminal Logs */}
                {logsActive && (
                    <div className="w-full grid grid-cols-12 gap-4 z-10 mt-auto animate-[fadeIn_0.3s_ease-out]">
                        <div className="col-span-12 bg-black/90 rounded-xl border border-white/20 p-4 font-mono text-sm h-32 overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                            <div className="space-y-1.5 h-full overflow-y-auto custom-scrollbar">
                                {logs.map((log, i) => (
                                    <div key={i} className={`${i === 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tiles Rendering */}
            {boardTiles.map((tile) => {
                const gridStyle = getGridStyle(tile.index);
                const isCorner = [0, 10, 20, 30].includes(tile.index);

                return (
                    <div
                        key={tile.index}
                        style={gridStyle}
                        className={`
                                relative flex flex-col items-center justify-center p-0.5
                                bg-white/95 border border-slate-200
                                transition-all duration-300 group
                                ${(() => {
                                // Check if players are on this tile to boost Z-Index
                                const hasPlayers = players.some(p => {
                                    const pos = p.position || 0;
                                    if (tile.index === 0) return pos === 0;
                                    return pos === tile.index;
                                });
                                // If players are here, lift the tile above neighbors (z-30) so pawns don't get clipped
                                // If moving player, z-40 is handled below, so we use z-30 as base for occupied tiles
                                return hasPlayers ? 'z-30' : 'z-10';
                            })()}
                                ${(() => {
                                // Check if any player is currently moving on this tile
                                let borderColor = 'border-yellow-300'; // Default fallback
                                const movingPlayer = players.find((p, idx) => {
                                    const isMovingHere = isMoving && (p?.position || 0) === tile.index && (turn % players.length) === idx;
                                    return isMovingHere;
                                });

                                if (movingPlayer) {
                                    switch (movingPlayer.color) {
                                        case 'red': borderColor = 'ring-red-500'; break;
                                        case 'blue': borderColor = 'ring-blue-500'; break;
                                        case 'green': borderColor = 'ring-green-500'; break;
                                        case 'yellow': borderColor = 'ring-yellow-400'; break;
                                        case 'orange': borderColor = 'ring-orange-500'; break;
                                        case 'purple': borderColor = 'ring-purple-500'; break;
                                        default: borderColor = 'ring-blue-500';
                                    }
                                    // Pop up effect tailored for 3D
                                    return `z-40 scale-110 !shadow-2xl ring-4 ${borderColor} bg-white`;
                                }

                                // Check Landing Animation (Static Highlight)
                                if (landingTile === tile.index) {
                                    // Determine color based on the player who just landed (previous turn)
                                    // calculate strictly based on who is AT the tile right now to be safe
                                    const landedPlayer = players.find(p => p.position === tile.index);
                                    let landRing = 'ring-yellow-400';
                                    let landShadow = 'rgba(250,204,21,0.5)';

                                    if (landedPlayer) {
                                        switch (landedPlayer.color) {
                                            case 'red': landRing = 'ring-red-500'; landShadow = 'rgba(239,68,68,0.5)'; break;
                                            case 'blue': landRing = 'ring-blue-500'; landShadow = 'rgba(59,130,246,0.5)'; break;
                                            case 'green': landRing = 'ring-green-500'; landShadow = 'rgba(34,197,94,0.5)'; break;
                                            case 'yellow': landRing = 'ring-yellow-400'; landShadow = 'rgba(250,204,21,0.5)'; break;
                                            case 'orange': landRing = 'ring-orange-500'; landShadow = 'rgba(249,115,22,0.5)'; break;
                                            case 'purple': landRing = 'ring-purple-500'; landShadow = 'rgba(168,85,247,0.5)'; break;
                                        }
                                    }

                                    return `z-[60] ring-4 ${landRing} !shadow-[0_0_20px_${landShadow}] scale-105 bg-yellow-50`;
                                }

                                return '';
                            })()}
                            `}
                    >
                        { /* Header - Color Bar (Only for Properties) */}
                        { /* Header - Color Bar (Only for Properties) */}
                        {
                            (() => {
                                const isFullColor = tile.color?.includes('yellow') || tile.color?.includes('black') || tile.color?.includes('red') || tile.type === 'EVENT' || tile.type === 'ZONE' || tile.type === 'AUDIT' || tile.type === 'CRISIS' || tile.type === 'START' || tile.type === 'JAIL';
                                if (isFullColor) return null;

                                return (
                                    <div className={`absolute top-0 inset-x-0 h-[28%] flex items-center justify-center z-10 ${tile.color || 'bg-blue-600'}`}>
                                        <span className={`px-1 text-center ${isCorner ? 'text-[0.7rem] font-extrabold' : 'text-[0.55rem] font-black'} uppercase tracking-tight leading-none ${tile.textColor || 'text-white'} drop-shadow-sm`}>
                                            {tile.name}
                                        </span>
                                    </div>
                                );
                            })()
                        }

                        { /* Background - Logic Full Color vs White (Override Black to Slate-900) */}
                        <div className={`absolute inset-0 z-0 ${(tile.color?.includes('yellow') || tile.color?.includes('black') || tile.color?.includes('red') || tile.type === 'EVENT' || tile.type === 'ZONE' || tile.type === 'AUDIT' || tile.type === 'CRISIS' || tile.type === 'START' || tile.type === 'JAIL') ? (tile.color === 'bg-black' ? 'bg-slate-900' : tile.color) : 'bg-white'}`}></div>

                        { /* Body Content */}
                        <div className={`flex flex-col items-center justify-center text-center w-full h-full z-20 px-0.5 
                            ${(tile.color?.includes('yellow') || tile.color?.includes('black') || tile.color?.includes('red') || tile.type === 'EVENT' || tile.type === 'ZONE' || tile.type === 'AUDIT' || tile.type === 'CRISIS' || tile.type === 'START' || tile.type === 'JAIL')
                                ? 'pt-1 pb-1 justify-between text-white'
                                : 'pt-[22%] text-gray-800'
                            }
                            ${(tile.color?.includes('yellow') || tile.type === 'EVENT') ? '!text-black' : ''}
                        `}>
                            {/* Name for Full Color Tiles */}
                            {(tile.color?.includes('yellow') || tile.color?.includes('black') || tile.color?.includes('red') || tile.type === 'EVENT' || tile.type === 'ZONE' || tile.type === 'AUDIT' || tile.type === 'CRISIS' || tile.type === 'START' || tile.type === 'JAIL') && (
                                <span className="text-[0.5rem] font-black uppercase tracking-tight leading-none mb-1 opacity-90 w-full">{tile.name}</span>
                            )}
                            <div className="flex-grow flex flex-col items-center justify-center w-full -mt-2 gap-1">
                                <div className="pointer-events-none transition-all duration-300 group-hover:scale-110 drop-shadow-sm">
                                    {(() => {
                                        // 1. START -> GO Text
                                        if (tile.type === 'START') {
                                            return (
                                                <div className="flex flex-col items-center justify-center -mt-2">
                                                    <span className="text-4xl font-black text-white italic tracking-tighter drop-shadow-md">GO</span>
                                                </div>
                                            );
                                        }

                                        // 2. SPECIFIC NAMES
                                        // JAIL / PENGADILAN -> Jail/Prisoner
                                        if (tile.type === 'JAIL' || tile.name?.toUpperCase().includes('PENGADILAN') || tile.name?.toUpperCase().includes('JAIL')) {
                                            return <img src="https://img.icons8.com/color/96/scales.png" className="w-10 h-10 object-contain" alt="Justice" />;
                                        }

                                        // 3. TYPES
                                        // EVENT -> Question Mark (White Filter)
                                        if (tile.type === 'EVENT' || tile.color?.includes('yellow')) {
                                            return <img src="https://img.icons8.com/color/96/question-mark.png" className="w-9 h-9 object-contain brightness-0 invert" alt="Chance" />;
                                        }

                                        // CRISIS -> Tax / Money
                                        if (tile.type === 'CRISIS') {
                                            return <img src="https://img.icons8.com/color/96/tax.png" className="w-9 h-9 object-contain" alt="Crisis" />;
                                        }

                                        // AUDIT -> Policeman
                                        if (tile.type === 'AUDIT') {
                                            return <img src="https://img.icons8.com/color/96/policeman-male.png" className="w-8 h-8 object-contain" alt="Police" />;
                                        }

                                        // ZONE -> No Entry / Parking
                                        if (tile.type === 'ZONE') {
                                            return <img src="https://img.icons8.com/color/96/high-priority.png" className="w-8 h-8 object-contain" alt="Danger Zone" />;
                                        }

                                        // Backup check for Black tiles
                                        if (tile.color?.includes('black')) {
                                            return <img src="https://img.icons8.com/color/96/high-priority.png" className="w-8 h-8 object-contain" alt="Special" />;
                                        }

                                        // PROPERTY -> House
                                        if (tile.type === 'PROPERTY') {
                                            return (
                                                <img src="https://img.icons8.com/color/96/home.png" className="w-6 h-6 object-contain opacity-90 group-hover:opacity-100" alt="Property" />
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>

                                {tile.subName && (
                                    <span className="text-[0.38rem] font-bold leading-tight whitespace-normal px-0.5 uppercase tracking-tight block w-full line-clamp-2 opacity-90 pb-0.5">
                                        {tile.subName.replace(/\n/g, ' ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Multiplayer Pawn Logic */}
                        <>
                            {(() => {
                                // Get all players on this tile OR at position 0 if this is START tile
                                let playersOnTile = Array.isArray(players)
                                    ? players.filter(p => {
                                        if (!p) return false;
                                        const pos = p.position || 0;
                                        // If START tile (index 0), show players at position 0 to the left
                                        if (tile.index === 0 && pos === 0) return true;
                                        // Otherwise show players at their actual position (> 0)
                                        return pos === tile.index && pos > 0;
                                    })
                                    : [];

                                // Sort players by ID to ensure consistent order
                                playersOnTile.sort((a, b) => {
                                    const idA = parseInt(String(a.id).replace(/\D/g, '')) || 0;
                                    const idB = parseInt(String(b.id).replace(/\D/g, '')) || 0;
                                    return idA - idB;
                                });

                                return playersOnTile.map((player, localIdx) => {
                                    const globalIdx = players.findIndex(p => p?.id === player.id);
                                    const isCurrentMoving = isMoving && (turn % players.length) === globalIdx;
                                    const playerPos = player.position || 0;
                                    const isCurrentTurn = (turn % players.length) === globalIdx;

                                    // Horizontal alignment (Left to Right lineup)
                                    const totalOnTile = playersOnTile.length;
                                    // Spacing: 35px is enough to separate them visually if z-index is fixed
                                    const spacing = 35;
                                    // Calculate x-offset to center the group on the tile
                                    const groupWidth = (totalOnTile - 1) * spacing;
                                    const startX = -groupWidth / 2; // Start from left relative to center

                                    const xOffset = startX + (localIdx * spacing);

                                    // Scale configuration (Slightly smaller to fit better)
                                    const pawnScale = isCurrentTurn ? 0.55 : 0.45;
                                    // Z-index: Active player on top, others ordered by position
                                    const zIndex = isCurrentTurn ? 100 : 50 + localIdx;

                                    return (
                                        <div
                                            key={player.id || globalIdx}
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                            style={{ zIndex }}
                                        >
                                            <div
                                                className="transition-transform duration-300 flex flex-col items-center"
                                                style={{
                                                    // Use unified translate for all tiles including Start
                                                    transform: `translate(${xOffset}px, 20px) scale(${pawnScale})`,
                                                    animation: isCurrentMoving && isJumping
                                                        ? 'pawnJump 0.3s ease-in-out infinite'
                                                        : 'pawnEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                                                }}
                                            >

                                                {/* Moving border effect */}
                                                {/* Moving border effect REMOVED as per request */}

                                                <svg
                                                    className="w-20 h-24 drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] z-10"
                                                    viewBox="0 0 100 120"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <defs>
                                                        <linearGradient id={`pieceGradient-${player.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                            {player.color === 'red' && (
                                                                <>
                                                                    <stop offset="0%" stopColor="#fca5a5" />
                                                                    <stop offset="50%" stopColor="#ef4444" />
                                                                    <stop offset="100%" stopColor="#991b1b" />
                                                                </>
                                                            )}
                                                            {player.color === 'blue' && (
                                                                <>
                                                                    <stop offset="0%" stopColor="#93c5fd" />
                                                                    <stop offset="50%" stopColor="#3b82f6" />
                                                                    <stop offset="100%" stopColor="#1e3a8a" />
                                                                </>
                                                            )}
                                                            {player.color === 'green' && (
                                                                <>
                                                                    <stop offset="0%" stopColor="#86efac" />
                                                                    <stop offset="50%" stopColor="#22c55e" />
                                                                    <stop offset="100%" stopColor="#14532d" />
                                                                </>
                                                            )}
                                                            {player.color === 'yellow' && (
                                                                <>
                                                                    <stop offset="0%" stopColor="#fde047" />
                                                                    <stop offset="50%" stopColor="#eab308" />
                                                                    <stop offset="100%" stopColor="#854d0e" />
                                                                </>
                                                            )}
                                                            {player.color === 'orange' && (
                                                                <>
                                                                    <stop offset="0%" stopColor="#fdba74" />
                                                                    <stop offset="50%" stopColor="#f97316" />
                                                                    <stop offset="100%" stopColor="#9a3412" />
                                                                </>
                                                            )}
                                                            {player.color === 'purple' && (
                                                                <>
                                                                    <stop offset="0%" stopColor="#c4b5fd" />
                                                                    <stop offset="50%" stopColor="#a855f7" />
                                                                    <stop offset="100%" stopColor="#581c87" />
                                                                </>
                                                            )}
                                                            {!['red', 'blue', 'green', 'yellow', 'orange', 'purple'].includes(player.color) && (
                                                                <>
                                                                    <stop offset="0%" stopColor="#93c5fd" />
                                                                    <stop offset="50%" stopColor="#3b82f6" />
                                                                    <stop offset="100%" stopColor="#1e3a8a" />
                                                                </>
                                                            )}
                                                        </linearGradient>
                                                    </defs>

                                                    {/* Shadow */}
                                                    <ellipse cx="50" cy="110" rx="30" ry="8" fill="rgba(0,0,0,0.3)" />

                                                    {/* Different piece for each player */}
                                                    {/* Simple Cone Pawn (Uniform for all players) */}
                                                    <g transform="translate(0, -5)">
                                                        {/* Main Cone Body */}
                                                        {/* Base 20-80, Top 40-60. Height 95 to 25 */}
                                                        <path
                                                            d="M 20 95 Q 50 105 80 95 L 62 25 Q 50 15 38 25 Z"
                                                            fill={`url(#pieceGradient-${player.id})`}
                                                        />
                                                        {/* Tip Highlight/Rim */}
                                                        <path
                                                            d="M 38 25 Q 50 15 62 25 L 60 30 Q 50 22 40 30 Z"
                                                            fill="rgba(255,255,255,0.5)"
                                                        />
                                                        {/* Side Glossy Highlight (Plastic feel) */}
                                                        <path
                                                            d="M 35 40 Q 40 40 42 90 L 35 90 Q 30 50 35 40"
                                                            fill="rgba(255,255,255,0.3)"
                                                        />
                                                        <ellipse cx="50" cy="30" rx="6" ry="3" fill="rgba(255,255,255,0.4)" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </>
                    </div>
                );
            })}
            <style>{`
                @keyframes pawnEnter {
                    0% { transform: translateY(-20px) scale(0.4); opacity: 0; }
                    100% { transform: translateY(0) scale(0.45); opacity: 1; }
                }
                @keyframes pawnJump {
                    0%, 100% { transform: translateY(0) scale(0.45); }
                    50% { transform: translateY(-20px) scale(0.42, 0.52); }
                }
                @keyframes zoomInEntry {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes landSuccess {
                    0% { transform: scale(1); z-index: 50; }
                    30% { transform: scale(1.25) translateY(-20px) rotate(3deg); box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); z-index: 60; border-color: #fbbf24; }
                    50% { transform: scale(1.25) translateY(-20px) rotate(-3deg); box-shadow: 0 0 50px rgba(255, 215, 0, 1); z-index: 60; }
                    70% { transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
                    100% { transform: scale(1); z-index: 10; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatUpFadeOut {
                    0% { transform: translate(-50%, 0); opacity: 0; }
                    20% { transform: translate(-50%, -20px); opacity: 1; }
                    100% { transform: translate(-50%, -100px); opacity: 0; }
                }
                @keyframes crystalFloat {
                    0%, 100% { transform: translateY(0) rotateY(0deg); }
                    50% { transform: translateY(-15px) rotateY(180deg); }
                }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .dice-bounce-ease { 
                    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,100,100,0.3);
                    border-radius: 10px;
                }
            `}</style>
        </div >
    );
};

export default ActiveGame;
