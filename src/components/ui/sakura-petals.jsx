/* eslint-disable react-hooks/purity */
import { useMemo } from 'react';

export const SakuraPetals = () => {
    const petals = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}vw`,
            fallDuration: `${Math.random() * 10 + 12}s`, // 12s to 22s 
            fallDelay: `-${Math.random() * 20}s`,
            driftDuration: `${Math.random() * 4 + 4}s`, // 4s to 8s
            driftDelay: `-${Math.random() * 8}s`,
            spinDuration: `${Math.random() * 6 + 6}s`, // 6s to 12s
            width: `${Math.random() * 6 + 4}px`, // 4px to 10px
            height: `${Math.random() * 12 + 8}px`, // 8px to 20px
            opacity: Math.random() * 0.4 + 0.1,
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            <style>{`
                @keyframes fall-css {
                    0% { transform: translateY(-10vh); }
                    100% { transform: translateY(110vh); }
                }
                @keyframes drift-css {
                    0%, 100% { transform: translateX(-40px); }
                    50% { transform: translateX(40px); }
                }
                @keyframes spin-css {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {petals.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: p.left,
                        top: 0,
                        opacity: p.opacity,
                        animation: `fall-css ${p.fallDuration} linear ${p.fallDelay} infinite`
                    }}
                >
            <div style={{ animation: `drift-css ${p.driftDuration} ease-in-out ${p.driftDelay} infinite` }}>
            <div
                style={{
                    width: p.width,
                    height: p.height,
                    backgroundColor: 'rgb(255, 183, 197)',
                    borderRadius: '50%',
                    animation: `spin-css ${p.spinDuration} linear infinite`
                            }}
                        />
        </div>
                </div >
            ))}
        </div >
    );
};

