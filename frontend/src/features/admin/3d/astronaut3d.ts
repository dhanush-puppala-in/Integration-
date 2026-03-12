import * as THREE from "three";

export function initAstronautScene(
    canvas: HTMLCanvasElement,
    getEnergy: () => number = () => 0.6
): () => void {
    if (!canvas) return () => { };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const handleResize = () => {
        const { clientWidth, clientHeight } = canvas;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    scene.background = new THREE.Color("#020617");

    /* ===== LIGHTS ===== */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const point = new THREE.PointLight(0xffffff, 1.2);
    point.position.set(3, 4, 5);
    scene.add(point);

    /* ===== STARS ===== */
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 400;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 30;
        positions[i + 1] = (Math.random() - 0.5) * 30;
        positions[i + 2] = (Math.random() - 0.5) * 30;
    }

    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    /* ===== ANIMATE ===== */
    let frameId: number;

    const animate = () => {
        const energy = getEnergy(); // 0 → 1
        const speedFactor = 0.5 + energy * 1.8;

        stars.rotation.y += 0.0008 * speedFactor;
        stars.rotation.x += 0.0003 * speedFactor;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
    };

    animate();

    /* ===== CLEANUP ===== */
    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        starGeometry.dispose();
        starMaterial.dispose();
    };
}