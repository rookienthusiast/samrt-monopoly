
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
        { index: 1, type: 'PROPERTY', name: 'Hotel Budget', subName: '(20-30 kamar) (Rp 2.5M - 4M)', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 2, type: 'EVENT', name: 'EVENT', subName: 'Control Environment (Integrity & Ethical Values)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 3, type: 'EVENT', name: 'EVENT', subName: 'Control Environment (Independent Oversight)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 4, type: 'PROPERTY', name: 'Restoran menengah', subName: '(Rp 700jt - 1.2M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 5, type: 'PROPERTY', name: 'Pabrik Tekstil', subName: '(10M - 20M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 6, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Implementation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 7, type: 'PROPERTY', name: 'Warung Kopi', subName: '(Rp 200jt - 350jt)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 8, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Objective Setting)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 9, type: 'PROPERTY', name: 'Rumah Sakit', subName: 'Pratama (4M - 6M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 10, type: 'AUDIT', name: 'AUDIT', subName: '(IA Governance Audit)', color: 'bg-black', textColor: 'text-white' },

        // Right Column (11-19) - Moving Down
        { index: 11, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Risk Identification)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 12, type: 'PROPERTY', name: 'Kost Mahasiswa', subName: '(1M - 1.8M)', color: 'bg-blue-600', textColor: 'text-black' },
        { index: 13, type: 'EVENT', name: 'EVENT', subName: 'Risk Assessment (Fraud Risk)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 14, type: 'PROPERTY', name: 'Minimarket', subName: '(900jt - 1.5M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 15, type: 'ZONE', name: 'AUDIT ZONE', subName: '(biaya audit: 60-90jt)', color: 'bg-black', textColor: 'text-white' },
        { index: 16, type: 'PROPERTY', name: 'Cloud Kitchen', subName: '(300jt - 400jt)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 17, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Risk Mitigation)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 18, type: 'PROPERTY', name: 'Sewa Apartemen', subName: '(1.5M - 2M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 19, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (IT Controls)', color: 'bg-yellow-400', textColor: 'text-black' },

        // Bottom Row (20-30) - Moving Left
        { index: 20, type: 'AUDIT', name: 'Pengadilan', subName: '(kasus hukum) (perdata - pidana)', color: 'bg-black', textColor: 'text-white' },
        { index: 21, type: 'EVENT', name: 'EVENT', subName: 'Control Activities (Policies & Procedures)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 22, type: 'PROPERTY', name: 'Pusat oleh-oleh', subName: '(1.3M - 1.6M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 23, type: 'PROPERTY', name: 'Jasa Konsultan', subName: '(500 - 800jt)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 24, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Internal Communication)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 25, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (Quality Information)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 26, type: 'PROPERTY', name: 'Kawasan Kuliner', subName: '(2.2M - 3M)', color: 'bg-blue-300', textColor: 'text-black' },
        { index: 27, type: 'EVENT', name: 'EVENT', subName: 'Information & Communication (External Communication)', color: 'bg-yellow-400', textColor: 'text-black' },
        { index: 28, type: 'ZONE', name: 'Audit Zone', subName: '(50 - 100jt)', color: 'bg-black', textColor: 'text-white' },
        { index: 29, type: 'PROPERTY', name: 'Hotel Bisnis', subName: '(5 - 7 M)', color: 'bg-blue-600', textColor: 'text-black' },
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

    // UI State
    const [isResuming, setIsResuming] = useState(true);
    const [showGameMenu, setShowGameMenu] = useState(false);

    const [players, setPlayers] = useState([
        { id: 1, name: 'Player 1', color: 'red', position: 0, money: 1500 },
        { id: 2, name: 'Player 2', color: 'blue', position: 0, money: 1500 },
        { id: 3, name: 'Player 3', color: 'green', position: 0, money: 1500 },
        { id: 4, name: 'Player 4', color: 'yellow', position: 0, money: 1500 }
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
                bgMusicRef.current = new Audio('/sounds/background.mp3');
                bgMusicRef.current.loop = true;
                bgMusicRef.current.volume = 0.2;
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
                    if (room.players) setPlayers(room.players);
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

    const handleDeleteRoom = async (code: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent entering room
        if (!confirm('Delete this room?')) return;

        try {
            await axios.post('/game/room/delete', { code });
            fetchRooms();
        } catch (e) { console.error(e); }
    };

    const handleEnterRoom = (room: any) => {
        setRoomId(room.code);
        localStorage.setItem('monopoly_room_id', room.code);
        if (room.players) setPlayers(room.players);
        // User rule: "harus klik room nya dulu baru masuk ke situ baru main".
        // Always go to SETUP first unless game is strictly running? 
        // He says "baru masuk ke situ (Setup) baru main".
        // So allow SETUP even if status is playing? Maybe catch up logic is 'PLAYING', but we join via Setup?
        // Let's stick to standard flow: LOBBY -> SETUP.
        setGamePhase('SETUP');
    };

    const handleStartGame = async () => {
        try {
            // Save final player config to DB
            await axios.post('/game/room/update', {
                code: roomId,
                players: players,
                status: 'PLAYING',
                logs: logs
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
        if (!confirm("Exit to Main Menu?")) return;
        localStorage.removeItem('monopoly_room_id');
        setRoomId('');
        setGamePhase('LOBBY');
        setShowGameMenu(false);
        fetchRooms();
    };

    const handleResetGame = async () => {
        if (!confirm("Reset Game State? All progress will be lost.")) return;

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
                logs: logs
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

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>

            <div className="relative w-full h-[95vh] flex items-center justify-center px-2">

                {/* GAME LOBBY */}
                {gamePhase === 'LOBBY' && (
                    <div className="z-50 flex flex-col items-center justify-center w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-[fadeIn_0.5s_ease-out]">

                        {/* Logo / Header */}
                        <div className="mb-12 text-center relative">
                            <div className="inline-block px-3 py-1 mb-4 border border-blue-500/30 rounded-full bg-blue-500/10 backdrop-blur-sm">
                                <span className="text-[0.65rem] font-bold text-blue-400 tracking-widest uppercase">E-Governance Edition</span>
                            </div>
                            <h1 className="text-6xl font-[1000] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter drop-shadow-sm leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>
                                SMART<br />MONOPOLY
                            </h1>
                        </div>

                        {/* Room Grid System */}
                        <div className="w-full grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-2">
                            {/* Active Rooms */}
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    onClick={() => handleEnterRoom(room)}
                                    className="relative group cursor-pointer bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
                                >
                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => handleDeleteRoom(room.code, e)}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white rounded-full text-xs transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        ✕
                                    </button>

                                    <span className="text-xl font-mono font-black text-blue-400">#{room.code}</span>
                                    <span className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-wider mt-1">
                                        {room.status} • {room.players?.length || 4} Players
                                    </span>
                                </div>
                            ))}

                            {/* Add Button (Only if < 6 rooms) */}
                            {rooms.length < 6 && (
                                <button
                                    onClick={handleCreateRoom}
                                    className="border-2 border-dashed border-white/20 hover:border-blue-500/50 hover:bg-blue-500/10 p-4 rounded-2xl flex flex-col items-center justify-center transition-all group"
                                >
                                    <span className="text-3xl text-white/30 group-hover:text-blue-400 transform group-hover:scale-110 transition-transform mb-1">+</span>
                                    <span className="text-[0.6rem] font-bold text-white/30 group-hover:text-blue-300 uppercase tracking-widest">Create Room</span>
                                </button>
                            )}
                        </div>

                        {/* Lobby Music Toggle */}
                        <button
                            onClick={toggleMusic}
                            className="mt-8 text-xs font-bold text-gray-500 flex items-center gap-2 hover:text-white transition-colors"
                        >
                            {isMusicPlaying ? '🔊 MUSIC ON' : '🔇 MUSIC OFF'}
                        </button>
                    </div>
                )}

                {/* GAME SETUP (LOBBY ROOM) */}
                {gamePhase === 'SETUP' && (
                    <div className="z-50 flex flex-col items-center justify-center w-full max-w-2xl p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-3xl font-[1000] text-white tracking-tight mb-2 uppercase italic">Room Setup</h2>
                        <div className="bg-white/10 px-4 py-1 rounded-full mb-8 border border-white/5">
                            <span className="text-blue-400 font-mono font-bold tracking-widest text-lg">#{roomId}</span>
                            <button onClick={() => navigator.clipboard.writeText(roomId)} className="ml-2 text-xs text-gray-500 hover:text-white transition-colors">📋</button>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4 mb-8">
                            {players.map((player, idx) => (
                                <div key={player.id} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3 group focus-within:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white font-bold shadow-inner">
                                        P{idx + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={player.name}
                                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                                        className="bg-transparent border-none text-white font-bold text-lg focus:outline-none w-full"
                                    />
                                    {players.length > 2 && (
                                        <button onClick={() => removePlayer(player.id)} className="text-red-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity p-1">✕</button>
                                    )}
                                </div>
                            ))}
                            {players.length < 6 && (
                                <button onClick={addPlayer} className="border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 rounded-xl flex items-center justify-center text-white/50 hover:text-white font-bold transition-all p-3">
                                    + ADD PLAYER
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleStartGame}
                            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-[1000] text-2xl italic tracking-wider rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-95"
                        >
                            START GAME 🚀
                        </button>
                    </div>
                )}


                {/* Main Board Container (Adjusted to Fit) */}
                {gamePhase === 'PLAYING' && (
                    <div className="absolute inset-0 bg-[#f8f9fa] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] border-[10px] border-[#222] p-1 grid grid-rows-11 grid-cols-11 gap-1 animate-[zoomIn_0.5s_ease-out]">

                        {/* Center Area UI (Decorated) */}
                        <div className="col-start-2 col-end-11 row-start-2 row-end-11 m-[2px] relative flex flex-col items-center justify-between p-6 bg-white rounded-xl border border-black/5 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">

                            {/* Top Right Info Bar (Relocated) */}
                            <div className="absolute top-4 right-4 z-[100] select-none">
                                <div className="flex flex-col items-end gap-1 bg-white/60 backdrop-blur-md p-3 rounded-lg border border-black/5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[0.6rem] font-black text-gray-400 tracking-widest uppercase">ROOM ID</span>
                                            <span className="text-xs font-mono font-black text-gray-800">{roomId}</span>
                                        </div>
                                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[0.6rem] font-black text-gray-500 tracking-widest uppercase">TURN:</span>
                                                <span className="text-white bg-red-600 px-1.5 py-0.5 rounded text-[0.6rem] font-bold">P{(turn % players.length) + 1}</span>
                                            </div>
                                            <span className="text-xl font-black text-red-700 italic uppercase">{getCurrentPlayer().name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 border-t border-black/5 pt-1 mt-1 w-full justify-end">
                                        <span className="text-[0.6rem] font-black text-gray-500 tracking-widest uppercase">Liquidity:</span>
                                        <span className="text-2xl font-mono font-black text-green-700">Rp 500<span className="text-sm">M</span></span>
                                    </div>
                                    <button
                                        onClick={toggleMusic}
                                        className="mt-2 w-full text-[0.6rem] font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-2 rounded-md transition-colors flex items-center justify-center gap-2"
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
                                        className="mt-2 w-full text-[0.6rem] font-bold bg-gray-800 hover:bg-gray-700 text-white py-1 px-2 rounded-md transition-colors"
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
                                            RESET GAME ⚠️
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
                                    <Dice3D value={dice[0]} rolling={isRolling} transform={diceTransforms[0]} rotation={diceRotations[0]} />
                                    <Dice3D value={dice[1]} rolling={isRolling} transform={diceTransforms[1]} rotation={diceRotations[1]} />
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
                                    { /* Header */}
                                    <div className={`absolute top-0 inset-x-0 h-[22%] flex items-center justify-center ${tile.color || 'bg-gray-300'} z-10 border-b-2 border-black/5`}>
                                        <span className={`px-1 text-center ${isCorner ? 'text-[0.65rem] font-bold' : 'text-[0.52rem] font-black'} uppercase tracking-tight leading-none text-white drop-shadow-md`}>
                                            {tile.name}
                                        </span>
                                    </div>

                                    { /* Background */}
                                    <div className={`absolute inset-0 z-0 
                                    ${tile.type === 'EVENT' ? 'bg-yellow-50' : ''}
                                    ${tile.type === 'ZONE' || tile.type === 'AUDIT' || tile.type === 'CRISIS' ? 'bg-gray-200' : ''}
                                    ${tile.type === 'START' ? 'bg-white' : ''}
                                    ${tile.type === 'PROPERTY' && tile.color?.includes('blue-600') ? 'bg-blue-50' : ''}
                                    ${tile.type === 'PROPERTY' && tile.color?.includes('blue-400') ? 'bg-blue-50' : ''}
                                    ${tile.type === 'PROPERTY' && tile.color?.includes('blue-300') ? 'bg-blue-50/50' : ''}
                                    ${tile.type === 'PROPERTY' && tile.color?.includes('cyan') ? 'bg-cyan-50' : ''}
                                    ${tile.type === 'PROPERTY' && tile.color?.includes('gray') ? 'bg-gray-100' : ''}
                                `}></div>

                                    { /* Body Content */}
                                    <div className={`flex flex-col items-center justify-center text-center w-full h-full z-20 pt-[18%] px-0.5 ${tile.textColor || 'text-black'}`}>
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

                                    {/* Multiplayer Pawn Logic */}
                                    {Array.isArray(players) && players.map((player, idx) => {
                                        if (!player) return null;
                                        const pos = player.position || 0;
                                        if (pos !== tile.index) return null;
                                        const offset = idx * 6;
                                        const isCurrentMoving = isMoving && (turn % players.length) === idx;

                                        return (
                                            <div
                                                key={player.id || idx}
                                                className="absolute inset-0 flex items-end justify-end pb-1 pr-1 z-50 pointer-events-none"
                                                style={{
                                                    transform: `translateX(-${offset}px) translateY(-${offset}px)`,
                                                    animation: isCurrentMoving && isJumping
                                                        ? 'pawnJump 0.4s ease-out infinite'
                                                        : 'pawnEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                                                }}
                                            >
                                                <div className="relative flex flex-col items-center group" style={{ transform: 'scale(0.45)', transformOrigin: 'bottom right' }}>
                                                    <div className={`absolute inset-0 bg-${player.color || 'blue'}-500/40 blur-xl rounded-full scale-150 animate-pulse`}></div>

                                                    <div className="absolute -top-10 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {player.name}
                                                    </div>

                                                    <svg
                                                        className="w-24 h-32 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] z-10"
                                                        viewBox="0 0 100 140"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <defs>
                                                            <linearGradient id={`pawnGradient-${player.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#60A5FA" />
                                                                <stop offset="100%" stopColor="#1E3A8A" />
                                                            </linearGradient>
                                                        </defs>
                                                        <ellipse cx="50" cy="125" rx="42" ry="12" fill="#1E3A8A" fillOpacity="0.4" />
                                                        <ellipse cx="50" cy="120" rx="40" ry="12" fill={`url(#pawnGradient-${player.id})`} stroke="#FFFFFF33" strokeWidth="1" />
                                                        <path d="M50 115C75 115 85 105 85 95C85 85 75 75 50 65C25 75 15 85 15 95C15 105 25 115 50 115Z" fill={`url(#pawnGradient-${player.id})`} stroke="#FFFFFF33" strokeWidth="1" />
                                                        <path d="M50 65L35 35C35 35 35 25 50 25C65 25 65 35 65 35L50 65Z" fill={`url(#pawnGradient-${player.id})`} />
                                                        <circle cx="50" cy="20" r="15" fill={`url(#pawnGradient-${player.id})`} stroke="#FFFFFF66" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })}
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
                    50% { transform: translateY(-30px) scale(0.4, 0.55); }
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
