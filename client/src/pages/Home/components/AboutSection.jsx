import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Heart,
    Route,
    UsersRound
} from "lucide-react";

const principles = [
    {
        icon: UsersRound,
        number: "01",
        title: "People first",
        description:
            "Trips become meaningful when the right people are part of them."
    },
    {
        icon: Route,
        number: "02",
        title: "Simple planning",
        description:
            "Your group should spend less time managing a trip and more time enjoying it."
    },
    {
        icon: Heart,
        number: "03",
        title: "Memories matter",
        description:
            "PackUP is built around the moments and stories that stay with you."
    }
];

const AboutSection = () => {
    return (
        <section
            id="about"
            className="about-section"
        >
            <div className="about-container">

                <div className="about-top">

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -40
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0
                        }}
                        viewport={{
                            once: true,
                            amount: 0.25
                        }}
                        transition={{
                            duration: 0.8
                        }}
                        className="about-copy"
                    >

                        <p className="section-eyebrow">
                            ABOUT PACKUP
                        </p>

                        <h2 className="about-heading">
                            Travel was never
                            <span>
                                meant to be complicated.
                            </span>
                        </h2>

                        <p className="about-text">
                            PackUP was created around
                            one simple idea: travelling
                            with friends should feel
                            exciting, not exhausting.
                        </p>

                        <p className="about-text">
                            Planning conversations,
                            joining trips, group decisions,
                            shared expenses and everything
                            in between can quickly become
                            scattered across different apps.
                        </p>

                        <p className="about-text">
                            PackUP brings those pieces
                            together so your group can
                            focus on the part that actually
                            matters.
                        </p>

                        <div className="about-signature">
                            <span>
                                Travel together.
                            </span>

                            <strong>
                                PackUP
                            </strong>
                        </div>

                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 40,
                            scale: 0.95
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                            scale: 1
                        }}
                        viewport={{
                            once: true,
                            amount: 0.25
                        }}
                        transition={{
                            duration: 1
                        }}
                        className="about-visual"
                    >

                        <img
                            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1600&q=90"
                            alt="Friends travelling together"
                        />

                        <div className="about-visual-overlay" />

                        <div className="about-visual-card">

                            <span>
                                THE IDEA
                            </span>

                            <p>
                                One place for
                                <strong>
                                    {" "}every journey.
                                </strong>
                            </p>

                            <ArrowUpRight
                                size={20}
                            />

                        </div>

                        <div className="about-visual-number">
                            01
                        </div>

                    </motion.div>

                </div>

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}
                    viewport={{
                        once: true,
                        amount: 0.2
                    }}
                    transition={{
                        duration: 0.8
                    }}
                    className="about-principles"
                >

                    {principles.map(
                        (principle, index) => {

                            const Icon =
                                principle.icon;

                            return (
                                <motion.div
                                    key={
                                        principle.number
                                    }
                                    whileHover={{
                                        y: -8
                                    }}
                                    transition={{
                                        duration: 0.3
                                    }}
                                    className="about-principle"
                                >

                                    <div className="about-principle-top">

                                        <div className="about-principle-icon">
                                            <Icon
                                                size={20}
                                            />
                                        </div>

                                        <span>
                                            {
                                                principle.number
                                            }
                                        </span>

                                    </div>

                                    <h3>
                                        {
                                            principle.title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            principle.description
                                        }
                                    </p>

                                </motion.div>
                            );
                        }
                    )}

                </motion.div>

            </div>
        </section>
    );
};

export default AboutSection;