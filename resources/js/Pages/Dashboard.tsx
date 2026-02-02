
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Property, PageProps, TileData } from '../Components/Monopoly/MonopolyTypes';
import { generateBoardTiles } from '../Components/Monopoly/MonopolyAssets';

import GameLobby from '../Components/Monopoly/GameLobby';
import RoomSetup from '../Components/Monopoly/RoomSetup';
import ActiveGame from '../Components/Monopoly/ActiveGame';


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
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle'); // Auto-Save Status
    const [landingTile, setLandingTile] = useState<number | null>(null); // Track landing animation

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

    // Music Initialization (Default Mute)
    useEffect(() => {
        if (!bgMusicRef.current) {
            bgMusicRef.current = new Audio('/sounds/funky_bg.mp3');
            bgMusicRef.current.loop = true;
            bgMusicRef.current.volume = 0.3;
        }

        // Attempt Autoplay if state is true
        if (isMusicPlaying) {
            bgMusicRef.current.play().catch(() => {
                // Autoplay blocked by browser policy - sync state to false
                setIsMusicPlaying(false);
            });
        }
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
                        // Robust Turn Loading with LocalStorage Backup
                        let dbTurn = 0;
                        if (room.turn !== undefined) dbTurn = Number(room.turn);
                        else if (room.current_turn !== undefined) dbTurn = Number(room.current_turn);

                        // Check LocalStorage for latest turn (in case DB failed to save)
                        const localTurn = Number(localStorage.getItem(`monopoly_turn_${room.code}`) || 0);
                        const finalTurn = (localTurn > dbTurn) ? localTurn : dbTurn;

                        setTurn(finalTurn);
                        console.log("Syncing Turn - DB:", dbTurn, "Local:", localTurn, "Using:", finalTurn);
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



    const toggleMusic = () => {
        if (!bgMusicRef.current) {
            bgMusicRef.current = new Audio('/sounds/funky_bg.mp3');
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

    const handleManualSave = () => {
        axios.post('/game/room/update', {
            code: roomId, players, status: 'PLAYING', logs, turn, current_turn: turn
        }).then(() => alert("Game Saved to Cloud!")).catch(() => alert("Save Failed!"));
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
                    // Calculate final position based on initial state + steps
                    const pIndex = currentPlayerIndex;
                    const calculatedFinalPos = (players[pIndex].position + steps) % 40;

                    // Trigger Landing Animation
                    setLandingTile(calculatedFinalPos);
                    setTimeout(() => setLandingTile(null), 1500); // Reset animation after 1.5s
                }, 500);
            }
        }, 400);
    };

    // Auto-Sync Turn Change
    useEffect(() => {
        if (roomId) {
            // Backup Turn to LocalStorage
            localStorage.setItem(`monopoly_turn_${roomId}`, String(turn));

            if (gamePhase === 'PLAYING') {
                console.log(`> Auto-Saving Turn ${turn} to DB...`);
                setSaveStatus('saving');
                axios.post('/game/room/update', {
                    code: roomId,
                    players: players,
                    status: 'PLAYING',
                    logs: logs,
                    turn: turn,
                    current_turn: turn // Send BOTH to ensure Backend catches it regardless of column name
                }).then(() => {
                    console.log("> Save Success");
                    setSaveStatus('saved');
                    setTimeout(() => setSaveStatus('idle'), 2000);
                })
                    .catch(e => {
                        console.error("> Save Failed", e);
                        setSaveStatus('error');
                    });
            }
        }
    }, [turn, gamePhase, roomId]); // Sync when turn changes

    // Loading Screen
    if (isResuming) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono animate-pulse">
                LOADING SESSION...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-1 font-sans text-gray-900 overflow-hidden">
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
            {/* Background Effects Removed -> Clean Look */}
            <div className="absolute inset-0 bg-white/50"></div>

            <div className="relative w-full h-screen flex items-center justify-center p-0 overflow-hidden">

                {/* GAME LOBBY - COMPONENT */}
                {gamePhase === 'LOBBY' && (
                    <GameLobby
                        rooms={rooms}
                        onCreateRoom={handleCreateRoom}
                        onJoinRoom={handleEnterRoom}
                        onDeleteRoom={handleDeleteRoom}
                        onResetRooms={handleDeleteAllRooms}
                        onToggleMusic={toggleMusic}
                        isMusicPlaying={isMusicPlaying}
                    />
                )}

                {/* GAME SETUP (LOBBY ROOM) - COMPONENT */}
                {gamePhase === 'SETUP' && (
                    <RoomSetup
                        roomId={roomId}
                        players={players}
                        roomStatus={roomStatus}
                        onStartGame={handleStartGame}
                        onLeaveRoom={handleExitGame}
                        onUpdatePlayerName={updatePlayerName}
                        onAddPlayer={addPlayer}
                        onRemovePlayer={removePlayer}
                    />
                )}

                {/* GAME BOARD (Full Screen Stretch - Flat/Clean) */}
                {gamePhase === 'PLAYING' && (
                    <ActiveGame
                        roomId={roomId}
                        players={players}
                        turn={turn}
                        dice={dice}
                        isRolling={isRolling}
                        diceTransforms={diceTransforms}
                        diceRotations={diceRotations}
                        showDice={showDice}
                        showTurnResult={showTurnResult}
                        rollTotal={rollTotal || 0}
                        isMoving={isMoving}
                        isJumping={isJumping}
                        landingTile={landingTile}
                        saveStatus={saveStatus}
                        logs={logs}
                        logsActive={logsActive}
                        showGameMenu={showGameMenu}
                        setShowGameMenu={setShowGameMenu}
                        boardTiles={boardTiles}
                        onRollDice={rollDice}
                        onResetGame={handleResetGame}
                        onExitGame={handleExitGame}
                        onSaveGame={handleManualSave}
                        toggleMusic={toggleMusic} // Pass toggleMusic
                        isMusicPlaying={isMusicPlaying} // Pass isMusicPlaying
                    />
                )}
            </div>
        </div >
    );
}
