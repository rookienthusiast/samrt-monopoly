
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';


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
        { index: 0, type: 'START', name: 'Start', color: 'bg-black', textColor: 'text-white' },
        { index: 1, type: 'PROPERTY', name: 'Hotel Budget', subName: '(20-30 kamar) (Rp 2.5M - 4M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 2, type: 'EVENT', name: 'EVENT', subName: 'Control Environment (Integrity & Ethical Values)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 3, type: 'EVENT', name: 'EVENT', subName: 'Control Environment (Independent Oversight)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 4, type: 'PROPERTY', name: 'Restoran menengah', subName: '(Rp 700jt - 1.2M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 5, type: 'PROPERTY', name: 'Pabrik Tekstil', subName: '(10M - 20M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 6, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Implementation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 7, type: 'PROPERTY', name: 'Warung Kopi', subName: '(Rp 200jt - 350jt)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 8, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Objective Setting)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 9, type: 'PROPERTY', name: 'Rumah Sakit', subName: 'Pratama (4M - 6M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 10, type: 'AUDIT', name: 'AUDIT', subName: '(AI Governance Audit)', color: 'bg-black', textColor: 'text-white' },

        // Right Column (11-19) - Moving Down
        { index: 11, type: 'PROPERTY', name: 'Kost Mahasiswa', subName: '(1M - 1,8M)', color: 'bg-sky-200', textColor: 'text-black' },
        { index: 12, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Fraud Risk)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 13, type: 'PROPERTY', name: 'Minimarket', subName: '(900jt - 1,5M)', color: 'bg-sky-200', textColor: 'text-black' },
        { index: 14, type: 'ZONE', name: 'AUDIT', subName: '(biaya audit: 60-90jt)', color: 'bg-red-600', textColor: 'text-white' },
        { index: 15, type: 'PROPERTY', name: 'Cloud Kitchen', subName: '(300jt - 400jt)', color: 'bg-cyan-400', textColor: 'text-black' },
        { index: 16, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Risk Mitigation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 17, type: 'PROPERTY', name: 'Sewa Apartemen', subName: '(1,5 - 2M)', color: 'bg-cyan-400', textColor: 'text-black' },
        { index: 18, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (IT Controls)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 19, type: 'PROPERTY', name: 'Desa Wisata', subName: '(2M - 2,5M)', color: 'bg-cyan-400', textColor: 'text-black' },

        // Bottom Row (20-30) - Moving Left
        { index: 20, type: 'AUDIT', name: 'Pengadilan', subName: '(kasus hukum) (perdata - pidana)', color: 'bg-black', textColor: 'text-white' },
        { index: 21, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Policies & Procedures)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 22, type: 'PROPERTY', name: 'Pusat oleh-oleh', subName: '(1.3M - 1.6M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 23, type: 'PROPERTY', name: 'Jasa Konsultan', subName: '(500 - 800jt)', color: 'bg-blue-400', textColor: 'text-black' },
        { index: 24, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Quality Information)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 25, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Internal Communication)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 26, type: 'PROPERTY', name: 'Kawasan Kuliner', subName: '(2.2M - 3M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 27, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (External Communication)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 28, type: 'ZONE', name: 'AUDIT ZONE', subName: '(80 - 100jt)', color: 'bg-red-600', textColor: 'text-white' },
        { index: 29, type: 'PROPERTY', name: 'Hotel Bisnis', subName: '(5 - 7 M)', color: 'bg-blue-200', textColor: 'text-black' },
        { index: 30, type: 'CRISIS', name: 'CRISIS', subName: 'Systemic Fraud / ESG Shock', color: 'bg-black', textColor: 'text-white' },

        // Left Column (31-39) - Moving Up
        { index: 31, type: 'EVENT', name: 'EVENT', subName: 'Monitoring (Ongoing Evaluation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 32, type: 'PROPERTY', name: 'Super Mall', subName: '(7 - 10M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 33, type: 'EVENT', name: 'EVENT', subName: 'Monitoring (Deficiency & Corrective Action)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 34, type: 'PROPERTY', name: 'Kawasan Industri', subName: '(7 - 10M)', color: 'bg-gray-400', textColor: 'text-black' },
        { index: 35, type: 'EVENT', name: 'EVENT', subName: 'Governance Reform', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 36, type: 'PROPERTY', name: 'Pecel Ayam', subName: '(100 - 200jt)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 37, type: 'PROPERTY', name: 'Hotel Resort', subName: '(8M - 12M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 38, type: 'EVENT', name: 'EVENT', subName: '', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 39, type: 'PROPERTY', name: 'Laundry', subName: '(Rp 250 - 450jt)', color: 'bg-blue-300', textColor: 'text-black' },
    ];

    return tiles;
};


const Dice3D = ({ value, rolling, transform, rotation, color = 'white' }: { value: number, rolling: boolean, transform: string, rotation: string, color?: string }) => {
    const renderDots = (num: number) => {
        const configurations: Record<number, number[]> = {
            1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 3, 6, 2, 5, 8]
        };
        const config = configurations[num as 1 | 2 | 3 | 4 | 5 | 6] || [];
        return (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center">
                        {config.includes(i) && <div className="w-2 h-2 bg-white rounded-full shadow-inner"></div>}
                    </div>
                ))}
            </div>
        );
    };

    const getDiceColor = () => {
        switch (color) {
            case 'red': return 'bg-gradient-to-br from-red-400 to-red-600';
            case 'blue': return 'bg-gradient-to-br from-blue-400 to-blue-600';
            case 'green': return 'bg-gradient-to-br from-green-400 to-green-600';
            case 'yellow': return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
            case 'orange': return 'bg-gradient-to-br from-orange-400 to-orange-600';
            case 'purple': return 'bg-gradient-to-br from-purple-400 to-purple-600';
            default: return 'bg-gradient-to-br from-white to-gray-100';
        }
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
                                className={`absolute w-full h-full ${getDiceColor()} border-2 border-white/30 rounded-lg shadow-lg flex items-center justify-center backface-hidden`}
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
    const audioCtxRef = useRef<AudioContext | null>(null);
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
    const [showTurnResult, setShowTurnResult] = useState(false);
    // Default Music ON
    const [isMusicPlaying, setIsMusicPlaying] = useState(true);

    // Game System State
    const [gamePhase, setGamePhase] = useState<'LOBBY' | 'SETUP' | 'PLAYING'>('LOBBY');
    const [roomId, setRoomId] = useState<string>('');
    const [inputRoomId, setInputRoomId] = useState('');
    const [rooms, setRooms] = useState<any[]>([]); // New: List of rooms
    const [roomStatus, setRoomStatus] = useState<string>('WAITING'); // Track room status

    // UI State
    const [isResuming, setIsResuming] = useState(true);
    const [showGameMenu, setShowGameMenu] = useState(false);

    const [players, setPlayers] = useState([
        { id: 1, name: 'Player 1', color: 'red', position: 0, money: 1500 },
        { id: 2, name: 'Player 2', color: 'blue', position: 0, money: 1500 },
        { id: 3, name: 'Player 3', color: 'green', position: 0, money: 1500 },
        { id: 4, name: 'Player 4', color: 'yellow', position: 0, money: 1500 },
        { id: 5, name: 'Player 5', color: 'orange', position: 0, money: 1500 },
        { id: 6, name: 'Player 6', color: 'purple', position: 0, money: 1500 }
    ]);
    const [turn, setTurn] = useState(0);

    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const boardTiles = generateBoardTiles(properties);
    const [logs, setLogs] = useState<string[]>([
        "> Initializing Smart Nodes...",
        "> Connected to Governance Network.",
        "> Ready for Ethical Audit."
    ]);

    // Auto-start Music Effect
    useEffect(() => {
        const initAudio = () => {
            if (!bgMusicRef.current) {
                // Kids Game Gaming Background Music from Pixabay
                bgMusicRef.current = new Audio('/sounds/background.mp3');
                bgMusicRef.current.loop = true;
                bgMusicRef.current.volume = 0.3;
            }
        };

        const attemptPlay = () => {
            initAudio();
            if (bgMusicRef.current && bgMusicRef.current.paused) {
                bgMusicRef.current.play().catch(() => {
                    // Auto-play blocked, waiting for interaction
                });
            }
        };

        // Try play immediately
        attemptPlay();

        // Ensure play on first click (fallback for browser blocking)
        const handleInteraction = () => {
            attemptPlay();
            window.removeEventListener('click', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    // Auto-Resume Session
    useEffect(() => {
        const savedRoomId = localStorage.getItem('monopoly_room_id');
        if (savedRoomId) {
            axios.post('/game/room/join', { code: savedRoomId }).then(res => {
                if (res.data.success) {
                    const room = res.data.room;
                    setRoomId(room.code);
                    if (room.players) {
                        setPlayers(room.players);
                        if (room.turn !== undefined) setTurn(room.turn);
                        if (room.logs) setLogs(room.logs);
                    }
                    setRoomStatus(room.status);
                    setGamePhase(room.status === 'LOBBY' ? 'SETUP' : 'PLAYING');
                    addLog(`> Resumed Session: ${room.code}`);
                }
            }).catch(err => {
                console.log("Resume failed", err);
                localStorage.removeItem('monopoly_room_id');
            }).finally(() => {
                setIsResuming(false);
            });
        } else {
            setIsResuming(false);
        }
    }, []);

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

    const toggleMusic = () => {
        if (!bgMusicRef.current) {
            bgMusicRef.current = new Audio('/sounds/background.mp3');
            bgMusicRef.current.loop = true;
            bgMusicRef.current.volume = 0.2;
        }

        if (isMusicPlaying) {
            bgMusicRef.current.pause();
            setIsMusicPlaying(false);
        } else {
            bgMusicRef.current.play().then(() => {
                setIsMusicPlaying(true);
            }).catch(e => console.log("Music play failed", e));
        }
    };

    // Game Room Logic
    const fetchRooms = async () => {
        try {
            const res = await axios.get('/game/rooms');
            if (res.data.success) {
                setRooms(res.data.rooms);
            }
        } catch (error) {
            console.error("Failed to fetch rooms");
        }
    };

    // Poll rooms every 5s when in Lobby
    useEffect(() => {
        if (gamePhase === 'LOBBY') {
            fetchRooms();
            const interval = setInterval(fetchRooms, 3000);
            return () => clearInterval(interval);
        }
    }, [gamePhase]);

    const handleCreateRoom = async () => {
        try {
            // Check if limit reached (max 6)
            if (rooms.length >= 6) {
                alert("Room limit reached (Max 6). Please delete a room first.");
                return;
            }

            const response = await axios.post('/game/room/create');
            if (response.data.success) {
                // Just refresh list, stay in Lobby
                fetchRooms();
                addLog(`> Created Room: ${response.data.room.code}`);
                if (!isMusicPlaying) toggleMusic();
            }
        } catch (error: any) {
            console.error("Failed to create room", error);
            const msg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Start Failed: ${msg} (Status: ${error.response?.status})`);
        }
    };

    const handleDeleteRoom = async (code: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        try {
            await axios.post('/game/room/delete', { code });
            fetchRooms();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleDeleteAllRooms = async () => {
        try {
            await axios.post('/game/rooms/delete-all');
            setRooms([]);
        } catch (error) {
            console.error("Delete all failed", error);
        }
    };

    const handleEnterRoom = (room: any) => {
        setRoomId(room.code);
        setRoomStatus(room.status);
        localStorage.setItem('monopoly_room_id', room.code); // Save for refresh persistence
        // Load Full State from Server for Cross-Device Play
        if (room.players) {
            setPlayers(room.players);
            if (room.turn !== undefined) setTurn(room.turn);
            if (room.logs) setLogs(room.logs);
        }
        setGamePhase('SETUP');
    };

    const handleStartGame = async () => {
        try {
            // Save final player config to DB
            await axios.post('/game/room/update', {
                code: roomId,
                players: players,
                status: 'PLAYING',
                logs: logs,
                turn: turn
            });

            setGamePhase('PLAYING');
            addLog(`> Game Started! Players: ${players.length}`);
        } catch (error) {
            console.error("Failed to start game", error);
            // Fallback to local start if offline/error
            setGamePhase('PLAYING');
        }
    };

    const addPlayer = () => {
        if (players.length < 6) {
            setPlayers([...players, { id: Date.now(), name: `Player ${players.length + 1}`, color: 'gray', position: 0, money: 1500 }]);
        }
    };

    const removePlayer = (id: number) => {
        if (players.length > 2) {
            setPlayers(players.filter(p => p.id !== id));
        }
    };

    const updatePlayerName = (id: number, newName: string) => {
        setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const handleJoinRoom = async () => {
        if (!inputRoomId.trim()) return;

        try {
            const code = inputRoomId.toUpperCase();
            const response = await axios.post('/game/room/join', { code });

            if (response.data.success) {
                const room = response.data.room;
                localStorage.setItem('monopoly_room_id', room.code);
                setRoomId(room.code);
                if (room.players) setPlayers(room.players);

                // If room is already playing, join as spectator/player directly
                setGamePhase(room.status === 'LOBBY' ? 'SETUP' : 'PLAYING');

                addLog(`> Joined Room: ${code}`);
                if (!isMusicPlaying) toggleMusic();
            }
        } catch (error) {
            console.error("Join failed", error);
            alert("Room not found or error joining!");
        }
    };

    const handleExitGame = () => {
        localStorage.removeItem('monopoly_room_id');
        setRoomId('');
        setGamePhase('LOBBY');
        setShowGameMenu(false);
        fetchRooms();
    };

    const handleResetGame = async () => {

        // Reset Logic
        // 1. Reset Players to start
        const resetPlayers = players.map(p => ({ ...p, money: 1500, position: 0 })); // Simplified reset
        setPlayers(resetPlayers);
        // setPlayerPosition(0); // This was local state? Revisit if needed.

        // 2. Sync DB
        try {
            await axios.post('/game/room/update', {
                code: roomId,
                players: resetPlayers,
                status: 'PLAYING',
                logs: ["> Game Reset by Admin"]
            });
            addLog("> Game Reset!");
            setShowGameMenu(false);
        } catch (e) { console.error(e); }
    };

    // Loading Screen check moved to end to prevent Hook errors

    const getCurrentPlayer = () => players[turn % players.length];

    const playSound = (type: 'dice' | 'step') => {
        try {
            const file = type === 'dice' ? '/sounds/dice-roll.mp3' : '/sounds/pawn-move.mp3';
            const audio = new Audio(file);
            audio.volume = type === 'dice' ? 0.8 : 0.5;
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) {
            console.error("Audio error:", e);
        }
    };

    const rollDice = () => {
        if (isRolling || isMoving) return;

        // Start background music on first interaction if not playing
        if (!bgMusicRef.current) {
            toggleMusic();
        }

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

        // One fluid animation to final position, synced with longer sound
        setTimeout(() => {
            setRollTotal(total);
            setShowTurnResult(true);

            setTimeout(() => {
                setIsRolling(false);
                setShowTurnResult(false);
                animateMovement(total);
            }, 800);
        }, 2500);
    };

    const animateMovement = (steps: number) => {
        setIsMoving(true);
        let currentStep = 0;
        const currentPlayerIndex = turn % players.length;

        const moveInterval = setInterval(() => {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 200);

            setPlayers(prevPlayers => {
                const newPlayers = [...prevPlayers];
                const player = { ...newPlayers[currentPlayerIndex] };
                player.position = (player.position + 1) % 40;
                newPlayers[currentPlayerIndex] = player;

                // Track global position for camera/focus if needed
                // setPlayerPosition(player.position); 

                // Play Step Sound
                playSound('step');

                // Check if step is done inside state updater to capture latest state? 
                // Actually safer to track steps outside.
                return newPlayers;
            });

            currentStep++;

            if (currentStep >= steps) {
                clearInterval(moveInterval);
                setIsMoving(false);

                // Get final player for log
                const finalPlayers = [...players]; // Note: this might be stale usage inside interval, but for logs ok
                // Actually, let's just log generic or use ref.
                addLog(`> Move complete.`);

                setTimeout(() => {
                    setRollTotal(null);
                    // Next Turn
                    setTurn(prev => prev + 1);

                    // Sync to DB
                    // We need the *latest* players state. 
                    // Best way is to call a sync function that uses the state, but inside interval state forms closure.
                    // Let's rely on the React State update cycle to trigger a sync effect or just send "best effort" with calculated final pos.
                    // For now, simpler:
                    const pIndex = turn % players.length;
                    const finalPos = (players[pIndex].position + steps) % 40; // Approx calc for DB sync
                    // Ideally we sync in a useEffect on [turn], but let's do explicit here.
                }, 500);
            }
        }, 400);
    };

    // Auto-Sync Turn Change
    useEffect(() => {
        if (gamePhase === 'PLAYING' && roomId) {
            axios.post('/game/room/update', {
                code: roomId,
                players: players,
                status: 'PLAYING',
                logs: logs,
                turn: turn
            }).catch(e => console.error(e));
        }
    }, [turn]); // Sync when turn changes

    // Loading Screen
    if (isResuming) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono animate-pulse">
                LOADING SESSION...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-1 font-sans text-white overflow-hidden">
            <Head title="Smart Monopoly" />
            <style>{`
                @keyframes zoomInEntry { 
                    0% { opacity: 0; transform: scale(0.92) translateY(20px); } 
                    100% { opacity: 1; transform: scale(1) translateY(0); } 
                }
                @keyframes slideUpEntry { 
                    0% { opacity: 0; transform: translateY(100vh); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }
                .animate-zoom-in { animation: zoomInEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .animate-slide-up { animation: slideUpEntry 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
            `}</style>

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>

            <div className="relative w-full h-[95vh] flex items-center justify-center px-2">

                {/* GAME LOBBY - CLASSIC CARTOON THEME */}
                {gamePhase === 'LOBBY' && (
                    <div className="fixed inset-0 z-[999] bg-sky-300 flex flex-col items-center justify-center font-sans overflow-hidden animate-zoom-in">

                        {/* Background Elements */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Clouds using radial gradients/shapes or simple divs */}
                            <div className="absolute top-[10%] left-[10%] w-32 h-16 bg-white/70 rounded-full blur-xl opacity-80 animate-pulse"></div>
                            <div className="absolute top-[20%] right-[15%] w-48 h-24 bg-white/60 rounded-full blur-2xl opacity-70 animate-pulse delay-700"></div>
                            <div className="absolute top-[5%] left-[40%] w-64 h-32 bg-white/40 rounded-full blur-3xl opacity-50"></div>

                            {/* Cityscape Silhouette */}
                            <div className="absolute bottom-0 inset-x-0 h-[35vh] flex items-end opacity-90 text-slate-600">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 320" fill="currentColor">
                                    <path d="M0,320 L0,180 L50,180 L50,120 L120,120 L120,240 L180,240 L180,80 L250,80 L250,260 L320,260 L320,150 L400,150 L400,320 Z 
                                             M400,320 L400,200 L480,200 L480,280 L550,280 L550,100 L650,100 L650,320 Z 
                                             M650,320 L650,220 L720,220 L720,140 L800,140 L800,250 L880,250 L880,90 L950,90 L950,320 Z 
                                             M950,320 L950,190 L1020,190 L1020,270 L1100,270 L1100,110 L1200,110 L1200,320 Z" opacity="0.8" />
                                    <path d="M-50,320 L1250,320 L1250,300 L-50,300 Z" fill="#334155" /> {/* Ground line */}
                                </svg>
                            </div>
                        </div>

                        {/* Main Menu Container */}
                        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-6 p-4">

                            {/* Red Box Logo */}
                            <div className="relative bg-[#e11d21] border-[6px] border-white px-12 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] transform -rotate-1 mb-6">
                                <div className="absolute inset-0 border-[3px] border-white/20 m-1 pointer-events-none"></div>
                                <h1 className="text-center leading-none drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                                    <span className="block text-[5rem] md:text-[6.5rem] font-[1000] text-white tracking-tighter" style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '-0.05em' }}>MONOPOLY</span>
                                    <span className="block text-[1rem] md:text-[1.5rem] font-[900] text-white tracking-[0.2em] uppercase mt-2 border-t-2 border-white/50 pt-1">E-GOVERNANCE EDITION</span>
                                </h1>
                                <div className="absolute -top-12 -right-10 text-[5rem] transform rotate-12 drop-shadow-lg filter brightness-110">🎩</div>
                            </div>

                            {/* Menu Buttons Area */}
                            <div className="w-full max-w-sm flex flex-col gap-5">

                                {/* 3D Glossy Buttons for Menu Items */}
                                <div className="flex flex-col gap-4 w-full">

                                    {/* Create Game Button (Main Action) */}
                                    {rooms.length < 6 && (
                                        <button
                                            onClick={handleCreateRoom}
                                            className="group relative w-full bg-gradient-to-b from-cyan-300 to-cyan-500 hover:from-cyan-200 hover:to-cyan-400 border-2 border-cyan-100 rounded-xl py-3 shadow-[0_6px_0_#0ea5e9,0_15px_20px_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_#0ea5e9] active:translate-y-[4px] transition-all"
                                        >
                                            <span className="text-2xl font-[1000] text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] uppercase tracking-wider">
                                                New Game
                                            </span>
                                        </button>
                                    )}

                                    {/* Room List (Presented as 'Load Game' slots styling) */}
                                    <div className="flex flex-col gap-2 max-h-[35vh] overflow-y-auto w-full custom-scrollbar pr-1 pb-2">
                                        {rooms.map(room => (
                                            <div key={room.id} onClick={() => handleEnterRoom(room)}
                                                className="cursor-pointer relative group bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border-2 border-blue-300 rounded-lg py-2 px-4 shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none transition-all flex items-center justify-between"
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className="text-lg font-black text-white drop-shadow-sm leading-none">ROOM #{room.code}</span>
                                                    <span className="text-[0.6rem] font-bold text-blue-200 uppercase">{room.status} • {room.players?.length || 4} P</span>
                                                </div>

                                            </div>
                                        ))}
                                        {rooms.length === 0 && (
                                            <div className="text-center py-4 text-slate-700 font-bold italic bg-white/20 rounded-xl border-2 border-white/30 backdrop-blur-sm">
                                                No Games Found
                                            </div>
                                        )}
                                    </div>

                                    {/* Delete All & Options */}
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button
                                            onClick={handleDeleteAllRooms}
                                            disabled={rooms.length === 0}
                                            className={`rounded-lg py-2 font-bold text-sm text-white shadow-[0_4px_0_#b91c1c] active:shadow-none active:translate-y-[3px] transition-all border-2 border-red-300 ${rooms.length === 0 ? 'bg-gray-400 border-gray-400 shadow-none cursor-not-allowed opacity-50' : 'bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400'}`}
                                        >
                                            RESET ALL
                                        </button>
                                        <button
                                            onClick={toggleMusic}
                                            className="bg-gradient-to-b from-slate-500 to-slate-700 hover:from-slate-400 border-2 border-slate-400 rounded-lg py-2 font-bold text-sm text-white shadow-[0_4px_0_#334155] active:shadow-none active:translate-y-[3px] transition-all"
                                        >
                                            {isMusicPlaying ? 'MUSIC: ON' : 'MUSIC: OFF'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Licenses */}
                        <div className="absolute bottom-2 w-full text-center z-10 opacity-70">
                            <p className="text-[0.6rem] text-slate-700 font-bold">Smart Monopoly E-Governance Edition © 2026</p>
                        </div>
                    </div>
                )}

                {/* GAME SETUP (LOBBY ROOM) - CARTOON THEME */}
                {gamePhase === 'SETUP' && (
                    <div className="fixed inset-0 z-[999] bg-sky-300 flex flex-col items-center justify-center font-sans overflow-hidden animate-slide-up">

                        {/* Background Elements (Matched with Lobby) */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-[10%] left-[10%] w-32 h-16 bg-white/70 rounded-full blur-xl opacity-80 animate-pulse"></div>
                            <div className="absolute top-[20%] right-[15%] w-48 h-24 bg-white/60 rounded-full blur-2xl opacity-70 animate-pulse delay-700"></div>
                            <div className="absolute bottom-0 inset-x-0 h-[35vh] flex items-end opacity-90 text-slate-600">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 320" fill="currentColor">
                                    <path d="M0,320 L0,180 L50,180 L50,120 L120,120 L120,240 L180,240 L180,80 L250,80 L250,260 L320,260 L320,150 L400,150 L400,320 Z M400,320 L400,200 L480,200 L480,280 L550,280 L550,100 L650,100 L650,320 Z M650,320 L650,220 L720,220 L720,140 L800,140 L800,250 L880,250 L880,90 L950,90 L950,320 Z M950,320 L950,190 L1020,190 L1020,270 L1100,270 L1100,110 L1200,110 L1200,320 Z" opacity="0.8" />
                                    <path d="M-50,320 L1250,320 L1250,300 L-50,300 Z" fill="#334155" />
                                </svg>
                            </div>
                        </div>

                        {/* Setup Container */}
                        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-6 p-4">



                            {/* Header Panel */}
                            <div className="flex flex-col items-center gap-2 mb-2">
                                <div className="bg-[#e11d21] border-[4px] border-white px-8 py-2 shadow-[0_10px_20px_rgba(0,0,0,0.2)] transform -rotate-1 relative">
                                    <div className="absolute inset-0 border-[2px] border-white/20 m-1 pointer-events-none"></div>
                                    <h1 className="text-center leading-none">
                                        <span className="block text-[3rem] font-[1000] text-white tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>MONOPOLY</span>
                                        <span className="block text-[0.7rem] font-[900] text-white tracking-[0.2em] uppercase mt-1 border-t border-white/50 pt-1">E-GOVERNANCE EDITION</span>
                                    </h1>
                                </div>

                                <div className="bg-white px-8 py-3 rounded-xl border-b-[6px] border-slate-200 shadow-xl flex items-center gap-4 mt-4 transform rotate-1">
                                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">ROOM CODE</span>
                                    <span className="text-4xl font-black text-slate-800 font-mono tracking-widest">{roomId}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(roomId)}
                                        className="ml-2 w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 border-2 border-blue-100 transition-colors"
                                        title="Copy Code"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>

                            {/* Players Grid */}
                            <div className="w-full bg-white/30 backdrop-blur-md rounded-3xl border-4 border-white/60 p-6 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[45vh] overflow-y-auto custom-scrollbar">
                                {players.map((player, idx) => {
                                    const borderColor =
                                        player.color === 'red' ? '#ef4444' :
                                            player.color === 'blue' ? '#3b82f6' :
                                                player.color === 'green' ? '#22c55e' :
                                                    player.color === 'yellow' ? '#eab308' :
                                                        player.color === 'orange' ? '#f97316' :
                                                            player.color === 'purple' ? '#a855f7' :
                                                                '#3b82f6';
                                    return (
                                        <div key={player.id} className="bg-white p-3 rounded-xl flex items-center gap-3 shadow-[0_4px_0_rgba(0,0,0,0.1)] border-2 transition-all hover:-translate-y-1"
                                            style={{ borderColor: borderColor }}
                                        >
                                            <div className="w-12 h-12 min-w-[3rem] shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner border-2 border-white"
                                                style={{ background: `linear-gradient(135deg, ${borderColor}, ${borderColor}dd)` }}>
                                                P{idx + 1}
                                            </div>
                                            {roomStatus === 'PLAYING' ? (
                                                <span className="bg-transparent text-gray-800 font-bold text-lg w-full px-1 cursor-default">{player.name}</span>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={player.name}
                                                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                                                    className="bg-transparent border-b-2 border-transparent focus:border-gray-300 text-gray-800 font-bold text-lg focus:outline-none w-full px-1"
                                                    placeholder="Player Name"
                                                />
                                            )}
                                            {roomStatus !== 'PLAYING' && players.length > 2 && (
                                                <button onClick={() => removePlayer(player.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full font-bold transition-colors">✕</button>
                                            )}
                                        </div>
                                    );
                                })}
                                {roomStatus !== 'PLAYING' && players.length < 6 && (
                                    <button onClick={addPlayer} className="group border-4 border-dashed border-white/50 hover:border-white hover:bg-white/20 rounded-xl flex items-center justify-center text-white font-bold transition-all p-4 min-h-[80px]">
                                        <span className="bg-white/20 group-hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center text-2xl mr-2">+</span>
                                        ADD PLAYER
                                    </button>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full max-w-sm flex flex-col gap-3 mt-2">
                                <button
                                    onClick={handleStartGame}
                                    className="w-full py-4 rounded-xl bg-gradient-to-b from-green-400 to-green-600 border-b-[6px] border-green-700 text-white font-[1000] text-3xl shadow-[0_10px_20px_rgba(22,163,74,0.3)] hover:brightness-110 active:border-b-0 active:translate-y-2 active:shadow-none transition-all uppercase tracking-wider transform hover:scale-[1.02]"
                                >
                                    {roomStatus === 'PLAYING' ? 'RESUME GAME' : 'START GAME'}
                                </button>
                                <button
                                    onClick={handleExitGame}
                                    className="w-full py-3 rounded-xl bg-gradient-to-b from-slate-500 to-slate-700 border-b-[4px] border-slate-800 text-white font-bold text-lg shadow-lg active:border-b-0 active:translate-y-1 active:shadow-none transition-all"
                                >
                                    CANCEL & RETURN
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Main Board Container (Adjusted to Fit) */}
                {gamePhase === 'PLAYING' && (
                    <div className="absolute inset-0 rounded-3xl p-1 grid grid-rows-11 grid-cols-11 gap-1 animate-[zoomIn_0.5s_ease-out]"
                        style={{
                            border: '12px solid #1e3a8a',
                            boxShadow: `
                                0 0 0 2px #1e40af,
                                0 0 0 4px #2563eb,
                                inset 0 2px 4px rgba(59, 130, 246, 0.3),
                                inset 0 -2px 4px rgba(0,0,0,0.4),
                                0 8px 16px rgba(0,0,0,0.5),
                                0 16px 32px rgba(0,0,0,0.4),
                                0 24px 48px rgba(0,0,0,0.3)
                            `,
                            background: 'linear-gradient(145deg, #1e3a8a, #1e40af, #2563eb)',
                            backgroundImage: `
                                linear-gradient(145deg, #1e3a8a, #1e40af, #2563eb),
                                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)
                            `
                        }}
                    >

                        {/* Center Area UI (Decorated) */}
                        <div className="col-start-2 col-end-11 row-start-2 row-end-11 m-[2px] relative flex flex-col items-center justify-between p-6 bg-white rounded-xl border border-black/5 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">

                            {/* Center Top Player Info */}
                            {/* Center Top Player Info - Moved to Top Left */}
                            <div className="absolute top-8 left-8 z-[100] select-none transition-all duration-300">
                                {(() => {
                                    const curPlayer = getCurrentPlayer();
                                    const curTile = boardTiles[curPlayer.position || 0];

                                    // Helper to get colors based on tile
                                    const getTileColors = (t: any) => {
                                        if (t.type === 'START') return { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', light: 'bg-red-50' };
                                        if (t.type === 'EVENT' || t.color?.includes('yellow')) return { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-400', light: 'bg-yellow-50' };

                                        // Specific checks first
                                        if (t.color?.includes('sky-200')) return { bg: 'bg-sky-200', text: 'text-sky-700', border: 'border-sky-300', light: 'bg-sky-50' };
                                        if (t.color?.includes('cyan-400')) return { bg: 'bg-cyan-400', text: 'text-cyan-700', border: 'border-cyan-500', light: 'bg-cyan-50' };
                                        if (t.color?.includes('blue-300')) return { bg: 'bg-blue-300', text: 'text-blue-700', border: 'border-blue-400', light: 'bg-blue-50' };
                                        if (t.color?.includes('blue-200')) return { bg: 'bg-blue-200', text: 'text-blue-600', border: 'border-blue-300', light: 'bg-blue-50' };

                                        // Audit/Zone
                                        if (t.type === 'ZONE' || t.color?.includes('purple') || t.color?.includes('red')) return { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-400', light: 'bg-red-50' };
                                        if (t.type === 'AUDIT' || t.type === 'CRISIS' || t.color?.includes('black')) {
                                            if (t.color?.includes('red')) return { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', light: 'bg-red-50' };
                                            return { bg: 'bg-gray-900', text: 'text-gray-800', border: 'border-gray-700', light: 'bg-gray-100' };
                                        }

                                        // Fallback Colors
                                        if (t.color?.includes('orange')) return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-400', light: 'bg-orange-50' };
                                        if (t.color?.includes('green')) return { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-400', light: 'bg-green-50' };
                                        if (t.color?.includes('pink')) return { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-400', light: 'bg-pink-50' };
                                        if (t.color?.includes('blue')) return { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-400', light: 'bg-blue-50' };

                                        return { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50' };
                                    };

                                    const colors = getTileColors(curTile);

                                    return (
                                        <div className={`flex flex-row items-center justify-between gap-4 ${colors.light} px-6 py-2 rounded-full border-[3px] ${colors.border} transition-all duration-500 scale-90 origin-top-left min-w-[320px]`}>

                                            {/* Player Info */}
                                            <div className="flex flex-col items-center min-w-[70px]">
                                                <span
                                                    className="text-white px-2 py-0.5 rounded text-[0.65rem] font-bold shadow-sm mb-0.5"
                                                    style={{
                                                        backgroundColor: curPlayer.color === 'red' ? '#dc2626' :
                                                            curPlayer.color === 'blue' ? '#2563eb' :
                                                                curPlayer.color === 'green' ? '#16a34a' :
                                                                    curPlayer.color === 'yellow' ? '#ca8a04' :
                                                                        curPlayer.color === 'orange' ? '#ea580c' :
                                                                            curPlayer.color === 'purple' ? '#9333ea' : '#dc2626'
                                                    }}
                                                >
                                                    P{(turn % players.length) + 1}
                                                </span>
                                                <span className="text-sm font-black italic uppercase tracking-tight text-black leading-none">
                                                    {curPlayer.name}
                                                </span>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px h-8 bg-black/10"></div>

                                            {/* Zone/Tile Info */}
                                            <div className="flex flex-col items-center justify-center text-center max-w-[140px]">
                                                <div className={`${colors.text} mb-0.5`}>
                                                    {(curTile.type === 'EVENT' || curTile.color?.includes('yellow')) ? (
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17H12.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><path d="M9.09 9C9.32 8.33 9.79 7.76 10.4 7.41C11 7 11.7 6.9 12.4 7C13.1 7.15 13.7 7.5 14.2 8C14.6 8.6 14.9 9.3 14.9 10C14.9 12 11.9 13 11.9 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                                    ) : (
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                                    )}
                                                </div>
                                                <span className={`text-[0.6rem] font-black uppercase tracking-wide leading-tight ${colors.text} line-clamp-2`}>
                                                    {curTile.name}
                                                </span>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px h-8 bg-black/10"></div>

                                            {/* Liquidity */}
                                            <div className="flex flex-col items-center min-w-[80px]">
                                                <span className="text-[0.5rem] font-bold text-gray-500 uppercase tracking-widest">CASH</span>
                                                <span className="text-lg font-mono font-black text-green-700 leading-none mt-0.5">Rp 500<span className="text-xs">M</span></span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Top Right Controls */}
                            <div className="absolute top-4 right-4 z-[100] select-none">
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={toggleMusic}
                                        className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        {isMusicPlaying ? (
                                            <><span>🔊</span> PAUSE MUSIC</>
                                        ) : (
                                            <><span>🔇</span> PLAY MUSIC</>
                                        )}
                                    </button>

                                    {/* Menu Button */}
                                    <button
                                        onClick={() => setShowGameMenu(true)}
                                        className="text-xs font-bold bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg transition-colors shadow-sm"
                                    >
                                        ⚙️ MENU / PAUSE
                                    </button>
                                </div>
                            </div>

                            {/* Game Menu Overlay */}
                            {showGameMenu && (
                                <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-[fadeIn_0.2s_ease-out]">
                                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-3 shadow-2xl">
                                        <h3 className="text-2xl font-[1000] text-gray-800 text-center uppercase italic mb-2">Game Paused</h3>

                                        <button
                                            onClick={() => setShowGameMenu(false)}
                                            className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg"
                                        >
                                            RESUME GAME
                                        </button>

                                        <div className="h-px bg-gray-200 my-1"></div>

                                        <button
                                            onClick={handleResetGame}
                                            className="py-3 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl shadow-lg"
                                        >
                                            RESET GAME
                                        </button>

                                        <button
                                            onClick={handleExitGame}
                                            className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl"
                                        >
                                            EXIT TO LOBBY
                                        </button>
                                    </div>
                                </div>
                            )}

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
                                    <Dice3D value={dice[0]} rolling={isRolling} transform={diceTransforms[0]} rotation={diceRotations[0]} color={getCurrentPlayer().color} />
                                    <Dice3D value={dice[1]} rolling={isRolling} transform={diceTransforms[1]} rotation={diceRotations[1]} color={getCurrentPlayer().color} />
                                </div>

                                <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-50 transition-all duration-1000 ease-out ${showTurnResult ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'}`}>
                                    <span className="text-6xl font-[1000] text-green-500 drop-shadow-[0_2px_0_rgba(255,255,255,0.5)] tracking-tighter" style={{ WebkitTextStroke: '1px black' }}>
                                        +{rollTotal}
                                    </span>
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
                                            relative border-4 border-white flex flex-col items-center justify-center p-1
                                            transition-all duration-300 group
                                            ${(() => {
                                            // Check if any player is currently moving on this tile
                                            let borderColor = 'border-yellow-300'; // Default fallback
                                            const movingPlayer = players.find((p, idx) => {
                                                const isMovingHere = isMoving && (p?.position || 0) === tile.index && (turn % players.length) === idx;
                                                return isMovingHere;
                                            });

                                            if (movingPlayer) {
                                                switch (movingPlayer.color) {
                                                    case 'red': borderColor = 'border-red-500'; break;
                                                    case 'blue': borderColor = 'border-blue-500'; break;
                                                    case 'green': borderColor = 'border-green-500'; break;
                                                    case 'yellow': borderColor = 'border-yellow-400'; break;
                                                    case 'orange': borderColor = 'border-orange-500'; break;
                                                    case 'purple': borderColor = 'border-purple-500'; break;
                                                    default: borderColor = 'border-blue-500';
                                                }
                                                return `z-40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] scale-105 ${borderColor}`;
                                            }
                                            return '';
                                        })()}
                                            ${isCorner ? 'rounded-xl' : 'rounded-lg'}
                                        `}
                                >
                                    { /* Header - Color Bar */}
                                    <div className={`absolute top-0 inset-x-0 h-[28%] flex items-center justify-center z-10 ${tile.color || 'bg-blue-600'} ${isCorner ? 'rounded-t-lg' : 'rounded-t'}`}>
                                        <span className={`px-1 text-center ${isCorner ? 'text-[0.7rem] font-extrabold' : 'text-[0.55rem] font-black'} uppercase tracking-tight leading-none text-white drop-shadow-lg`}>
                                            {tile.name}
                                        </span>
                                    </div>

                                    { /* Background - White/Light */}
                                    <div className={`absolute inset-0 z-0 bg-white ${isCorner ? 'rounded-lg' : 'rounded'}`}></div>

                                    { /* Body Content */}
                                    <div className={`flex flex-col items-center justify-center text-center w-full h-full z-20 pt-[22%] px-0.5 text-gray-800`}>
                                        <div className="flex-grow flex flex-col items-center justify-center w-full -mt-2 gap-1">
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

                                            // Sort players by ID to ensure consistent order (1, 2, 3...)
                                            playersOnTile.sort((a, b) => a.id - b.id);

                                            return playersOnTile.map((player, localIdx) => {
                                                const globalIdx = players.findIndex(p => p?.id === player.id);
                                                const isCurrentMoving = isMoving && (turn % players.length) === globalIdx;
                                                const playerPos = player.position || 0;
                                                const isCurrentTurn = (turn % players.length) === globalIdx;

                                                // Center alignment (no horizontal spread)
                                                // Pawns will stack on top of each other, current turn player on top (handled by zIndex)
                                                const xOffset = 0;

                                                // Scale configuration
                                                const pawnScale = isCurrentTurn ? 0.6 : 0.4;
                                                // Z-index: Active player on top, others layered
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
                                                                // Use specific translate based on state
                                                                transform: playerPos === 0
                                                                    // For Start Position (Left Side)
                                                                    ? `translate(-130px, ${localIdx * 30}px) scale(${pawnScale})`
                                                                    // For Board Tiles (Stacked Center)
                                                                    // 25px down from center puts it right on the icon
                                                                    : `translateY(25px) scale(${pawnScale})`,
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
                                                                {(() => {
                                                                    const playerIndex = players.findIndex(p => p?.id === player.id) + 1;

                                                                    // Player 1: Car
                                                                    if (playerIndex === 1) {
                                                                        return (
                                                                            <>
                                                                                {/* Car body */}
                                                                                <rect x="20" y="70" width="60" height="25" rx="4" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Car roof */}
                                                                                <path d="M30 70 L30 55 L70 55 L70 70" fill={`url(#pieceGradient-${player.id})`} opacity="0.9" />
                                                                                {/* Windows */}
                                                                                <rect x="35" y="58" width="12" height="10" fill="rgba(135,206,250,0.6)" />
                                                                                <rect x="53" y="58" width="12" height="10" fill="rgba(135,206,250,0.6)" />
                                                                                {/* Wheels */}
                                                                                <circle cx="32" cy="95" r="7" fill="#2d3748" />
                                                                                <circle cx="68" cy="95" r="7" fill="#2d3748" />
                                                                            </>
                                                                        );
                                                                    }

                                                                    // Player 2: Top Hat
                                                                    if (playerIndex === 2) {
                                                                        return (
                                                                            <>
                                                                                {/* Hat brim */}
                                                                                <ellipse cx="50" cy="90" rx="30" ry="8" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Hat body */}
                                                                                <rect x="35" y="50" width="30" height="40" rx="2" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Hat band */}
                                                                                <rect x="33" y="75" width="34" height="6" fill="rgba(0,0,0,0.3)" />
                                                                                {/* Shine */}
                                                                                <ellipse cx="45" cy="60" rx="8" ry="15" fill="rgba(255,255,255,0.3)" />
                                                                            </>
                                                                        );
                                                                    }

                                                                    // Player 3: Boot
                                                                    if (playerIndex === 3) {
                                                                        return (
                                                                            <>
                                                                                {/* Boot sole */}
                                                                                <ellipse cx="50" cy="95" rx="25" ry="8" fill={`url(#pieceGradient-${player.id})`} opacity="0.8" />
                                                                                {/* Boot foot */}
                                                                                <rect x="30" y="75" width="35" height="20" rx="3" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Boot shaft */}
                                                                                <rect x="35" y="45" width="25" height="35" rx="2" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Boot top */}
                                                                                <rect x="33" y="45" width="29" height="8" rx="2" fill={`url(#pieceGradient-${player.id})`} opacity="0.7" />
                                                                            </>
                                                                        );
                                                                    }

                                                                    // Player 4: Battleship
                                                                    if (playerIndex === 4) {
                                                                        return (
                                                                            <>
                                                                                {/* Ship hull */}
                                                                                <path d="M25 85 L75 85 L70 95 L30 95 Z" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Ship deck */}
                                                                                <rect x="30" y="70" width="40" height="15" rx="2" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Ship tower */}
                                                                                <rect x="40" y="55" width="20" height="15" rx="1" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Cannons */}
                                                                                <rect x="25" y="75" width="8" height="3" fill="rgba(0,0,0,0.4)" />
                                                                                <rect x="67" y="75" width="8" height="3" fill="rgba(0,0,0,0.4)" />
                                                                            </>
                                                                        );
                                                                    }

                                                                    // Player 5: Dog
                                                                    if (playerIndex === 5) {
                                                                        return (
                                                                            <>
                                                                                {/* Dog body */}
                                                                                <ellipse cx="50" cy="75" rx="20" ry="15" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Dog head */}
                                                                                <circle cx="65" cy="65" r="12" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Dog snout */}
                                                                                <ellipse cx="72" cy="68" rx="6" ry="5" fill={`url(#pieceGradient-${player.id})`} opacity="0.8" />
                                                                                {/* Dog ears */}
                                                                                <ellipse cx="60" cy="58" rx="5" ry="8" fill={`url(#pieceGradient-${player.id})`} opacity="0.9" />
                                                                                <ellipse cx="70" cy="58" rx="5" ry="8" fill={`url(#pieceGradient-${player.id})`} opacity="0.9" />
                                                                                {/* Dog legs */}
                                                                                <rect x="38" y="85" width="6" height="12" rx="2" fill={`url(#pieceGradient-${player.id})`} />
                                                                                <rect x="56" y="85" width="6" height="12" rx="2" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Dog tail */}
                                                                                <path d="M32 70 Q28 65 30 60" stroke={`url(#pieceGradient-${player.id})`} strokeWidth="4" fill="none" strokeLinecap="round" />
                                                                            </>
                                                                        );
                                                                    }

                                                                    // Player 6: Iron
                                                                    if (playerIndex === 6) {
                                                                        return (
                                                                            <>
                                                                                {/* Iron base */}
                                                                                <path d="M25 95 L75 95 L70 85 L30 85 Z" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Iron body */}
                                                                                <path d="M30 85 L70 85 L65 60 L35 60 Z" fill={`url(#pieceGradient-${player.id})`} />
                                                                                {/* Iron handle */}
                                                                                <path d="M40 60 Q50 45 60 60" stroke={`url(#pieceGradient-${player.id})`} strokeWidth="6" fill="none" strokeLinecap="round" />
                                                                                {/* Steam holes */}
                                                                                <circle cx="45" cy="75" r="2" fill="rgba(0,0,0,0.3)" />
                                                                                <circle cx="50" cy="75" r="2" fill="rgba(0,0,0,0.3)" />
                                                                                <circle cx="55" cy="75" r="2" fill="rgba(0,0,0,0.3)" />
                                                                            </>
                                                                        );
                                                                    }

                                                                    // Default fallback
                                                                    return (
                                                                        <>
                                                                            <circle cx="50" cy="70" r="20" fill={`url(#pieceGradient-${player.id})`} />
                                                                        </>
                                                                    );
                                                                })()}
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
                    </div >
                )}
            </div >
            <style>{`
                @keyframes pawnEnter {
                    0% { transform: translateY(-20px) scale(0.4); opacity: 0; }
                    100% { transform: translateY(0) scale(0.45); opacity: 1; }
                }
                @keyframes pawnJump {
                    0%, 100% { transform: translateY(0) scale(0.45); }
                    50% { transform: translateY(-20px) scale(0.42, 0.52); }
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
