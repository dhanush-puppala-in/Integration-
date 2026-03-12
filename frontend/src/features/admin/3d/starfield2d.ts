export function initStarfield2D(
    canvas: HTMLCanvasElement,
    getEnergy: () => number = () => 0.6,
    getDim: () => boolean = () => false
): () => void {
    if (!canvas) return () => { };

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => { };

    let animationId: number;

    /* =========================
       CONFIG
    ========================= */
    const DPR = window.devicePixelRatio || 1;
    const STAR_LAYERS = [
        { count: 140, speed: 0.15, size: [0.4, 1.0], alpha: [0.15, 0.35] }, // far
        { count: 120, speed: 0.35, size: [0.6, 1.4], alpha: [0.25, 0.6] },  // mid
        { count: 80, speed: 0.7, size: [1.0, 2.0], alpha: [0.5, 0.9] },   // near
    ];

    /* =========================
       STAR CREATION
    ========================= */
    interface Star {
        x: number;
        y: number;
        radius: number;
        speed: number;
        baseAlpha: number;
        drift: number;
        twinkle: number;
    }

    const createStars = (): Star[] => {
        const width = canvas.width / DPR;
        const height = canvas.height / DPR;

        return STAR_LAYERS.flatMap(layer =>
            Array.from({ length: layer.count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: rand(layer.size as [number, number]),
                speed: rand([layer.speed * 0.7, layer.speed * 1.3]),
                baseAlpha: rand(layer.alpha as [number, number]),
                drift: Math.random() * Math.PI * 2,
                twinkle: Math.random() * Math.PI * 2,
            }))
        );
    };

    const rand = ([min, max]: [number, number]): number => Math.random() * (max - min) + min;

    let stars = createStars();
    let time = 0;

    /* =========================
       ANIMATION LOOP
    ========================= */
    const animate = () => {
        animationId = requestAnimationFrame(animate);

        const width = canvas.width / DPR;
        const height = canvas.height / DPR;

        time += 0.01;

        const energy = getEnergy(); // 0 → 1
        const dimmed = getDim();

        /* Background */
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, width, height);

        for (const star of stars) {
            star.y += star.speed * (0.6 + energy * 1.2);
            star.x += Math.sin(time + star.drift) * 0.05;

            if (star.y > height) {
                star.y = -2;
                star.x = Math.random() * width;
            }

            const twinkle = 0.6 + Math.sin(time * 2 + star.twinkle) * 0.4;
            const alpha = star.baseAlpha * twinkle * (dimmed ? 0.25 : 1);

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fill();
        }
    };

    animate();

    /* =========================
       RESIZE HANDLING
    ========================= */
    const handleResize = () => {
        stars = createStars();
    };

    window.addEventListener("resize", handleResize);

    /* =========================
       CLEANUP
    ========================= */
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", handleResize);
    };
}