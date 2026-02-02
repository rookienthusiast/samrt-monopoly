
import React from 'react';

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

export default Dice3D;
