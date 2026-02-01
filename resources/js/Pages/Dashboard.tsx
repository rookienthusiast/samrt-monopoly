
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';


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
    type: 'START' | 'PROPERTY' | 'CHANCE' | 'JAIL' | 'FREE_PARKING' | 'GO_TO_JAIL' | 'TAX' | 'UTILITY' | 'EVENT' | 'CRISIS' | 'AUDIT' | 'ZONE';
    name: string;
    subName?: string;
    property?: Property;
    color?: string;
    textColor?: string;
}

interface PageProps {
    properties: Property[];
}


const generateBoardTiles = (dbProperties: Property[]): TileData[] => {
    const tiles: TileData[] = [
        // Top Row (0-10) - Moving Right
        { index: 0, type: 'START', name: 'Start', color: 'bg-black', textColor: 'text-black' },
        { index: 1, type: 'PROPERTY', name: 'Apartment', subName: '(20-30 kamar) (1,5M - 2,5M)', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 2, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Internal)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 3, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (External)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 4, type: 'PROPERTY', name: 'Pabrik Tekstil', subName: '(10M - 20M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 5, type: 'EVENT', name: 'EVENT', subName: 'Activities - Implementing', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 6, type: 'PROPERTY', name: 'Kopi', subName: '(Rp 250jt - 500jt)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 7, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Objectives)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 8, type: 'EVENT', name: 'EVENT', subName: 'Environment (Integrity)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 9, type: 'PROPERTY', name: 'Rumah Sakit', subName: 'Pratama (4M - 6M)', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 10, type: 'AUDIT', name: 'AUDIT', subName: '(AI governance Audit)', color: 'bg-black', textColor: 'text-black' },

        // Right Column (11-19) - Moving Down
        { index: 11, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Identification)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 12, type: 'PROPERTY', name: 'Kost Mahasiswa', subName: '(1M - 1,8M)', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 13, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Fraud Risk)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 14, type: 'PROPERTY', name: 'Minimarket', subName: '(900jt - 1,5M)', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 15, type: 'ZONE', name: 'AUDIT ZONE', subName: '(biaya audit: 60-90jt)', color: 'bg-black', textColor: 'text-black' },
        { index: 16, type: 'PROPERTY', name: 'Cloud Kitchen', subName: '(300jt - 400jt)', color: 'bg-cyan-400', textColor: 'text-black' },
        { index: 17, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Risk Mitigation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 18, type: 'PROPERTY', name: 'Sewa Apartemen', subName: '(1,5 - 2M)', color: 'bg-cyan-400', textColor: 'text-black' },
        { index: 19, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (IT Controls)', color: 'bg-yellow-400', textColor: 'text-black' },

        // Bottom Row (20-30) - Moving Left
        { index: 20, type: 'AUDIT', name: 'Pengadilan', subName: '(kasus hukum) (perdata - pidana)', color: 'bg-black', textColor: 'text-black' },
        { index: 21, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Policies)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 22, type: 'PROPERTY', name: 'Pusat oleh-oleh', subName: '(1,3M - 1,6M)', color: 'bg-blue-400', textColor: 'text-black' },
        { index: 23, type: 'PROPERTY', name: 'Jasa Konsultan', subName: '(500-800jt)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 24, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Quality)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 25, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Special)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 26, type: 'PROPERTY', name: 'Kawasan Kuliner', subName: '(2,2M - 3M)', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 27, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (External)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 28, type: 'ZONE', name: 'Audit Zone', subName: '(80-100jt)', color: 'bg-black', textColor: 'text-black' },
        { index: 29, type: 'PROPERTY', name: 'Hotel Bisnis', subName: '(5-7 M)', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 30, type: 'CRISIS', name: 'CRISIS', subName: 'Systemic Fraud / ESG Shock', color: 'bg-black', textColor: 'text-black' },

        // Left Column (31-39) - Moving Up
        { index: 31, type: 'EVENT', name: 'EVENT', subName: 'Monitoring (Ongoing Evaluation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 32, type: 'PROPERTY', name: 'Super Mall', subName: '(7 - 10M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 33, type: 'EVENT', name: 'EVENT', subName: 'Monitoring (Deficiency)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 34, type: 'PROPERTY', name: 'Kawasan Industri', subName: '(7-10M)', color: 'bg-gray-200', textColor: 'text-black' },
        { index: 35, type: 'EVENT', name: 'EVENT', subName: 'Governance Reform', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 36, type: 'PROPERTY', name: 'Pecel Ayam', subName: '(100-200jt)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 37, type: 'PROPERTY', name: 'Hotel Resort', subName: '(8M-12M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 38, type: 'EVENT', name: 'EVENT', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 39, type: 'PROPERTY', name: 'Laundry', subName: '(Rp 250-450jt)', color: 'bg-blue-300', textColor: 'text-black' },
    ];

    return tiles;
};


const Dice3D = ({ value, rolling, transform, rotation }: { value: number, rolling: boolean, transform: string, rotation: string }) => {
    const renderDots = (num: number) => {
        const configurations: Record<number, number[]> = {
            1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 3, 6, 2, 5, 8]
        };
        const config = configurations[num as 1 | 2 | 3 | 4 | 5 | 6] || [];
        return (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center">
                        {config.includes(i) && <div className="w-2 h-2 bg-black rounded-full shadow-inner"></div>}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="absolute transition-all duration-[1500ms] cubic-bezier(0.175, 0.885, 0.32, 1.275)" style={{ transform }}>
            <div className="w-16 h-16 perspective-[1000px]">
                {/* Standard 3D Cube (No Isometric Tilt on land) */}
                <div
                    className="w-full h-full relative preserve-3d transition-transform duration-[1500ms] ease-out"
                    style={{ transform: rotation }}
                >
                    {[1, 6, 3, 4, 2, 5].map((num, i) => {
                        const sideRots = [
                            'rotateY(0deg) translateZ(32px)',
                            'rotateY(180deg) translateZ(32px)',
                            'rotateY(90deg) translateZ(32px)',
                            'rotateY(-90deg) translateZ(32px)',
                            'rotateX(90deg) translateZ(32px)',
                            'rotateX(-90deg) translateZ(32px)',
                        ];
                        return (
                            <div
                                key={num}
                                className="absolute inset-0 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.1)] backface-hidden"
                                style={{ transform: sideRots[i] }}
                            >
                                {renderDots(num)}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


export default function Dashboard({ properties }: PageProps) {
    const [dice, setDice] = useState<[number, number]>([1, 1]);
    const [diceTransforms, setDiceTransforms] = useState([
        'translate(-40px, 0px) rotate(0deg)',
        'translate(40px, 0px) rotate(0deg)'
    ]);
    const [diceRotations, setDiceRotations] = useState([
        'rotateX(0deg) rotateY(0deg)',
        'rotateX(0deg) rotateY(0deg)'
    ]);
    const [cumRot, setCumRot] = useState([0, 0]); // Track cumulative rotation
    const [isRolling, setIsRolling] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [showDice, setShowDice] = useState(true);
    const [logsActive, setLogsActive] = useState(false);
    const [playerPosition, setPlayerPosition] = useState(0);
    const [rollTotal, setRollTotal] = useState<number | null>(null);
    const [isJumping, setIsJumping] = useState(false);
    const boardTiles = generateBoardTiles(properties);
    const [logs, setLogs] = useState<string[]>([
        "> Initializing Smart Nodes...",
        "> Welcome Player. Market is volatile today.",
        "> All systems operational.",
    ]);

    const addLog = (msg: string) => {
        setLogs(prev => [msg, ...prev.slice(0, 5)]);
    };


    const getGridStyle = (index: number) => {
        let row = 1;
        let col = 1;
        if (index >= 0 && index <= 10) { row = 1; col = index + 1; }
        else if (index >= 11 && index <= 20) { col = 11; row = (index - 10) + 1; }
        else if (index >= 21 && index <= 30) { row = 11; col = 11 - (index - 20); }
        else if (index >= 31 && index <= 39) { col = 1; row = 11 - (index - 30); }
        return { gridRow: row, gridColumn: col };
    };

    const playSound = (type: 'dice' | 'step') => {
        try {
            // Check for AudioContext support
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const now = ctx.currentTime;

            if (type === 'step') {
                // Synthesize a short "tick" or "step" sound (high pitch decaying sine)
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'dice') {
                // Synthesize a "rattle" sound (multiple short burst of noise/square waves)
                for (let i = 0; i < 6; i++) {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.type = 'square';
                    // Random pitch for rattle effect
                    osc.frequency.setValueAtTime(200 + Math.random() * 200, now + i * 0.06);

                    gain.gain.setValueAtTime(0.05, now + i * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.04);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(now + i * 0.06);
                    osc.stop(now + i * 0.06 + 0.05);
                }
            }
        } catch (e) {
            console.error("Audio synth error:", e);
        }
    };

    const rollDice = () => {
        if (isRolling || isMoving) return;
        setIsRolling(true);
        setShowDice(true);
        setRollTotal(null);
        addLog("> Requesting market move...");

        // Play Dice Sound (Synthetic)
        playSound('dice');

        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const total = d1 + d2;
        setDice([d1, d2]);

        const getRot = (val: number, prevRot: number) => {
            const base = { 1: [0, 0], 2: [-90, 0], 3: [0, -90], 4: [0, 90], 5: [90, 0], 6: [180, 0] }[val as 1 | 2 | 3 | 4 | 5 | 6];
            // Use multiples of 360 for the extra spin so the final landing is perfectly flat (orthogonal)
            const extraSpins = 3 + Math.floor(Math.random() * 2); // 3 or 4 full spins
            const newRot = prevRot + (extraSpins * 360);
            return {
                str: `rotateX(${base[0] + newRot}deg) rotateY(${base[1] + newRot}deg)`,
                val: newRot
            };
        };

        const r1 = getRot(d1, cumRot[0]);
        const r2 = getRot(d2, cumRot[1]);

        setCumRot([r1.val, r2.val]);
        setDiceRotations([r1.str, r2.str]);

        setDiceTransforms([
            `translate(${-120 + (Math.random() * 60)}px, ${40 + (Math.random() * 40)}px) rotate(${Math.random() * 45}deg)`,
            `translate(${120 + (Math.random() * 60)}px, ${40 + (Math.random() * 40)}px) rotate(${Math.random() * -45}deg)`
        ]);

        // One fluid animation to final position
        setTimeout(() => {
            setRollTotal(total);
            setTimeout(() => {
                setIsRolling(false);
                animateMovement(total);
            }, 800);
        }, 1500);
    };

    const animateMovement = (steps: number) => {
        setIsMoving(true);
        let currentStep = 0;

        const moveInterval = setInterval(() => {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 200);

            setPlayerPosition(prev => {
                const nextPos = (prev + 1) % 40;

                // Play Step Sound (Synthetic)
                playSound('step');

                currentStep++;

                if (currentStep >= steps) {
                    clearInterval(moveInterval);
                    setIsMoving(false);
                    addLog(`> Landed on ${boardTiles[nextPos].name}`);
                    setTimeout(() => {
                        setRollTotal(null);
                    }, 500); // Reset total for next roll
                }
                return nextPos;
            });
        }, 400);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-1 font-sans text-white overflow-hidden">
            <Head title="Smart Monopoly" />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>

            <div className="relative w-full h-[95vh] flex items-center justify-center px-2">

                {/* Main Board Container (Adjusted to Fit) */}
                <div className="absolute inset-0 bg-[#f8f9fa] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] border-[10px] border-[#222] p-1 grid grid-rows-11 grid-cols-11 gap-1">

                    {/* Center Area UI (Decorated) */}
                    <div className="col-start-2 col-end-11 row-start-2 row-end-11 m-[2px] relative flex flex-col items-center justify-between p-6 bg-white rounded-xl border border-black/5 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">

                        {/* Top Right Info Bar (Relocated) */}
                        <div className="absolute top-4 right-4 z-[100] select-none">
                            <div className="flex flex-col items-end gap-1 bg-white/60 backdrop-blur-md p-3 rounded-lg border border-black/5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="text-[0.6rem] font-black text-gray-500 tracking-widest uppercase">PLAYER Status:</span>
                                    <span className="text-xl font-black text-red-700 italic">PLAYER (YOU)</span>
                                </div>
                                <div className="flex items-center gap-3 border-t border-black/5 pt-1 mt-1">
                                    <span className="text-[0.6rem] font-black text-gray-500 tracking-widest uppercase">Liquidity:</span>
                                    <span className="text-2xl font-mono font-black text-green-700">Rp 500<span className="text-sm">M</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Card Placement: Reverted to 2 Large Side Columns (as per original request) */}
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
                                <Dice3D value={dice[0]} rolling={isRolling} transform={diceTransforms[0]} rotation={diceRotations[0]} />
                                <Dice3D value={dice[1]} rolling={isRolling} transform={diceTransforms[1]} rotation={diceRotations[1]} />
                            </div>

                            <button
                                onClick={rollDice}
                                disabled={isRolling || isMoving}
                                className={`
                                    absolute bottom-2 px-12 py-3.5 rounded-xl font-black text-lg tracking-[0.4em] uppercase transition-all duration-300 transform
                                    ${(isRolling || isMoving)
                                        ? 'opacity-0 translate-y-10 pointer-events-none'
                                        : 'bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_10px_40px_rgba(220,38,38,0.4)] active:scale-95 border-b-[4px] border-red-900'
                                    }
                                `}
                            >
                                Roll Dice
                            </button>
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
                                            relative border border-white/5 flex flex-col items-center justify-center p-1
                                            ${tile.color || 'bg-[#15191e]'}
                                            transition-all duration-300 group
                                            ${tile.index === playerPosition
                                        ? 'z-40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] !bg-opacity-100 border-none'
                                        : 'hover:scale-105 hover:z-20 hover:border-white/10'
                                    }
                                            ${isCorner ? 'rounded-xl' : ''}
                                        `}
                            >
                                {
                                    /* Smart Monopoly Styling: Header colored bar for Name, white body for Icons */
                                }
                                <div className={`absolute top-0 inset-x-0 h-[22%] flex items-center justify-center ${tile.color || 'bg-gray-300'} z-10 border-b-2 border-black/5`}>
                                    <span className={`px-1 text-center ${isCorner ? 'text-[0.65rem] font-bold' : 'text-[0.52rem] font-black'} uppercase tracking-tight leading-none text-white drop-shadow-md`}>
                                        {tile.name}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-white z-0"></div>

                                <div className={`flex flex-col items-center justify-center text-center w-full h-full z-20 pt-[18%] px-0.5 ${tile.textColor || 'text-black'}`}>
                                    {/* Body: Priority Icon Rendering to prevent double icons */}
                                    <div className="flex-grow flex flex-col items-center justify-center w-full -mt-3 gap-1.5">
                                        <div className="pointer-events-none transition-all duration-300 group-hover:scale-110">
                                            {(() => {
                                                if (tile.type === 'START') {
                                                    return (
                                                        <div className="relative flex items-center justify-center w-full h-full pb-1">
                                                            <span className="text-[1.8rem] font-[1000] text-red-600 tracking-tighter leading-none drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]" style={{ fontFamily: 'Impact, sans-serif' }}>
                                                                GO
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                                if (tile.color?.includes('yellow') || tile.type === 'EVENT') {
                                                    return (
                                                        <div className="animate-bounce-slow">
                                                            <svg className="w-7 h-7 text-orange-500/40 group-hover:text-orange-500/80 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.011 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                    );
                                                }
                                                if (tile.color?.includes('black') || tile.type === 'ZONE' || tile.type === 'AUDIT' || tile.type === 'CRISIS') {
                                                    return (
                                                        <svg className="w-6 h-6 text-black/20 group-hover:text-black/50 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                                                        </svg>
                                                    );
                                                }
                                                if (tile.type === 'PROPERTY') {
                                                    return (
                                                        <svg className="w-6 h-6 text-blue-500/25 group-hover:text-blue-500/60 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                            <path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                                            <path d="M19 21V11L13 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                                            <rect x="7" y="10" width="2" height="2" fill="currentColor" opacity="0.4" />
                                                        </svg>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>

                                        {tile.subName && (
                                            <span className="text-[0.42rem] text-black font-black leading-[0.85] whitespace-normal px-0.5 uppercase tracking-tight block w-full line-clamp-2">
                                                {tile.subName.replace(/\n/g, ' ')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Chess Pawn (Bottom-Right) */}
                                {tile.index === playerPosition && (
                                    <div className="absolute inset-0 flex items-end justify-end p-0.5 pointer-events-none z-50">
                                        <div
                                            className={`
                                                absolute bottom-1 right-1 flex flex-col items-center transition-all duration-300 origin-bottom-right z-50
                                                ${isJumping ? '-translate-y-15' : 'translate-y-0'}
                                            `}
                                            style={{
                                                animation: 'pawnEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                                            }}
                                        >
                                            <div className="relative flex flex-col items-center group" style={{ transform: 'scale(0.45)', transformOrigin: 'bottom right' }}>
                                                {/* Magic Glow */}
                                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>

                                                {/* High-Fidelity SVG Chess Pawn */}
                                                <svg
                                                    className="w-24 h-32 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] z-10 transition-transform duration-300"
                                                    viewBox="0 0 100 140"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <defs>
                                                        <linearGradient id="pawnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#60A5FA" />
                                                            <stop offset="50%" stopColor="#2563EB" />
                                                            <stop offset="100%" stopColor="#1E3A8A" />
                                                        </linearGradient>
                                                        <filter id="pawnShadow">
                                                            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.3" />
                                                        </filter>
                                                    </defs>

                                                    {/* Bottom Base Tier */}
                                                    <ellipse cx="50" cy="125" rx="42" ry="12" fill="#1E3A8A" fillOpacity="0.4" />
                                                    <ellipse cx="50" cy="120" rx="40" ry="12" fill="url(#pawnGradient)" stroke="#FFFFFF33" strokeWidth="1" />

                                                    {/* Upper Base Tier */}
                                                    <ellipse cx="50" cy="110" rx="30" ry="8" fill="url(#pawnGradient)" stroke="#FFFFFF22" strokeWidth="0.5" />

                                                    {/* Curved Trunk (Lower Body) */}
                                                    <path
                                                        d="M25 110 C 25 110, 35 60, 50 60 C 65 60, 75 110, 75 110 L 25 110 Z"
                                                        fill="url(#pawnGradient)"
                                                        stroke="#FFFFFF11"
                                                        strokeWidth="0.5"
                                                    />

                                                    {/* Decorative Collar (Ring) */}
                                                    <ellipse cx="50" cy="58" rx="18" ry="5" fill="#1D4ED8" stroke="#FFFFFF44" strokeWidth="1" filter="url(#pawnShadow)" />

                                                    {/* Head (Sphere) */}
                                                    <circle cx="50" cy="35" r="22" fill="url(#pawnGradient)" stroke="#FFFFFF33" strokeWidth="1" />

                                                    {/* Specular Highlight (The "Shiny" bit) */}
                                                    <circle cx="42" cy="28" r="7" fill="white" fillOpacity="0.4" filter="blur(2px)" />
                                                    <ellipse cx="50" cy="118" rx="20" ry="3" fill="white" fillOpacity="0.1" filter="blur(3px)" />
                                                </svg>

                                                {/* Shadow on board */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <style>{`
                @keyframes pawnEnter {
                    0% { transform: translateY(-40px) scale(0.45); opacity: 0; }
                    100% { transform: translateY(0) scale(0.45); opacity: 1; }
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
}
