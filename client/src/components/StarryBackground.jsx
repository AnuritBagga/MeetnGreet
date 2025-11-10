import React, { useEffect, useRef } from 'react';

const StarryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let stars = [];
        let shootingStars = [];
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            const starCount = Math.floor((canvas.width * canvas.height) / 2000);

            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.03 + 0.01,
                    color: Math.random() > 0.7 ? '#00d9ff' : '#ffffff'
                });
            }
        };

        const createShootingStar = () => {
            if (Math.random() < 0.002) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.5,
                    length: Math.random() * 100 + 60,
                    speed: Math.random() * 15 + 10,
                    opacity: 1,
                    angle: Math.random() * 30 + 30
                });
            }
        };

        const createParticle = () => {
            if (Math.random() < 0.01) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -(Math.random() * 3 + 2),
                    radius: Math.random() * 3 + 1,
                    opacity: 1,
                    color: Math.random() > 0.5 ? '#00d9ff' : '#6366f1'
                });
            }
        };

        const animate = () => {
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.5, '#0a0a0f');
            gradient.addColorStop(1, '#13131a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and animate stars
            stars.forEach(star => {
                star.opacity += star.twinkleSpeed;
                if (star.opacity > 1 || star.opacity < 0.3) {
                    star.twinkleSpeed *= -1;
                }

                // Add glow effect for brighter stars
                if (star.opacity > 0.7) {
                    const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
                    const [r, g, b] = star.color === '#00d9ff' ? [0, 217, 255] : [255, 255, 255];
                    glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${star.opacity})`);
                    glow.addColorStop(1, 'transparent');
                    ctx.fillStyle = glow;
                    ctx.fillRect(star.x - star.radius * 3, star.y - star.radius * 3, star.radius * 6, star.radius * 6);
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                const [r, g, b] = star.color === '#00d9ff' ? [0, 217, 255] : [255, 255, 255];
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.abs(star.opacity)})`;
                ctx.fill();

            });

            // Draw shooting stars
            createShootingStar();
            shootingStars = shootingStars.filter(star => star.opacity > 0);

            shootingStars.forEach(star => {
                const dx = star.speed * Math.cos(star.angle * Math.PI / 180);
                const dy = star.speed * Math.sin(star.angle * Math.PI / 180);

                star.x += dx;
                star.y += dy;
                star.opacity -= 0.015;

                const gradient = ctx.createLinearGradient(
                    star.x, star.y,
                    star.x - star.length * Math.cos(star.angle * Math.PI / 180),
                    star.y - star.length * Math.sin(star.angle * Math.PI / 180)
                );
                gradient.addColorStop(0, `rgba(0, 217, 255, ${star.opacity})`);
                gradient.addColorStop(0.3, `rgba(99, 102, 241, ${star.opacity * 0.8})`);
                gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(
                    star.x - star.length * Math.cos(star.angle * Math.PI / 180),
                    star.y - star.length * Math.sin(star.angle * Math.PI / 180)
                );
                ctx.stroke();

                // Add glow trail
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#00d9ff';
                ctx.stroke();
                ctx.shadowBlur = 0;
            });

            // Draw floating particles
            createParticle();
            particles = particles.filter(p => p.opacity > 0 && p.y > 0);

            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.05; // gravity
                particle.opacity -= 0.01;

                const glow = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.radius * 2
                );
                const [r, g, b] = particle.color === '#00d9ff' ? [0, 217, 255] : [99, 102, 241];
                glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity})`);

                glow.addColorStop(1, 'transparent');

                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);

        // Mouse interaction
        const handleMouseMove = (e) => {
            for (let i = 0; i < 3; i++) {
                particles.push({
                    x: e.clientX + (Math.random() - 0.5) * 20,
                    y: e.clientY + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    radius: Math.random() * 2 + 1,
                    opacity: 0.8,
                    color: Math.random() > 0.5 ? '#00d9ff' : '#6366f1'
                });
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="starry-background" />;
};

export default StarryBackground;