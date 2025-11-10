import React, { useEffect, useRef } from 'react';

const StarryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let stars = [];
        let shootingStars = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            const starCount = Math.floor((canvas.width * canvas.height) / 3000);

            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.02
                });
            }
        };

        const createShootingStar = () => {
            if (Math.random() < 0.003) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.5,
                    length: Math.random() * 80 + 40,
                    speed: Math.random() * 10 + 5,
                    opacity: 1
                });
            }
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw and animate stars
            stars.forEach(star => {
                star.opacity += star.twinkleSpeed;
                if (star.opacity > 1 || star.opacity < 0) {
                    star.twinkleSpeed *= -1;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 217, 255, ${Math.abs(star.opacity)})`;
                ctx.fill();
            });

            // Draw shooting stars
            createShootingStar();
            shootingStars = shootingStars.filter(star => star.opacity > 0);

            shootingStars.forEach(star => {
                star.x += star.speed;
                star.y += star.speed * 0.5;
                star.opacity -= 0.02;

                const gradient = ctx.createLinearGradient(
                    star.x, star.y,
                    star.x - star.length, star.y - star.length * 0.5
                );
                gradient.addColorStop(0, `rgba(0, 217, 255, ${star.opacity})`);
                gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(star.x - star.length, star.y - star.length * 0.5);
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="starry-background" />;
};

export default StarryBackground;