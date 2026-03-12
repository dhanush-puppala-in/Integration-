

import { motion } from "framer-motion";
import AstronautScene3D from "../components/animation/AstronautScene3D";
const pageMotion = {
    initial: { opacity: 0, filter: "blur(12px)", y: 20 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    transition: { duration: 1.1, ease: "easeOut", delay: 0.05 },
} as const;


const astronautContainerMotion = {
    initial: { opacity: 0, scale: 0.9, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: {
        duration: 1.2,
        ease: [0.34, 1.4, 0.64, 1],
        delay: 0.4,
    },
} as const;

const AdminHome: React.FC = () => {
    return (
             <motion.div
            {...pageMotion}
            className="
                min-h-screen 
                w-screen
                bg-[#0A0F1F] 
                text-white 
                overflow-hidden
                flex flex-col
            "
        >

            {/* MAIN ASTRONAUT SECTION */}
            <motion.div
                {...astronautContainerMotion}
                className="
                    flex-1
                    w-full
                    relative
                    overflow-hidden
                "
            >
                <div className="absolute inset-0 w-full h-full overflow-y-hidden">
                    <AstronautScene3D />
                </div>
            </motion.div>
        </motion.div>
    );
}


export default AdminHome;
