import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Map,
    Users,
    Sparkles
} from "lucide-react";

const experiences = [
    {
        number: "01",
        icon: Map,
        title: "Create",
        script: "your trip.",
        description:
            "Choose where you're going, when you're going and everything your journey needs.",
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85"
    },
    {
        number: "02",
        icon: Users,
        title: "Bring",
        script: "your people.",
        description:
            "Invite your friends, build your crew and make every decision together.",
        image:
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85"
    },
    {
        number: "03",
        icon: Sparkles,
        title: "Make",
        script: "memories.",
        description:
            "Stay connected, share moments and enjoy the journey without the usual hassle.",
        image:
            "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=1400&q=85"
    }
];

const ExperienceSection = () => {
    return (
        <section
            id="experience"
            className="experience-section"
        >
            <div className="experience-intro">

                <motion.p
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}
                    viewport={{
                        once: true,
                        amount: 0.4
                    }}
                    transition={{
                        duration: 0.7
                    }}
                    className="section-eyebrow"
                >
                    THE PACKUP EXPERIENCE
                </motion.p>

                <motion.h2
                    initial={{
                        opacity: 0,
                        y: 30
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}
                    viewport={{
                        once: true,
                        amount: 0.4
                    }}
                    transition={{
                        duration: 0.8
                    }}
                    className="experience-heading"
                >
                    Travel isn't just
                    <span className="experience-script">
                        where you go.
                    </span>
                </motion.h2>

                <motion.p
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}
                    viewport={{
                        once: true,
                        amount: 0.4
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.15
                    }}
                    className="experience-description"
                >
                    It's about the people you share
                    the road with, the stories you
                    create and the moments you take
                    home.
                </motion.p>

            </div>

            <div className="experience-grid">

                {experiences.map(
                    (experience, index) => {

                        const Icon =
                            experience.icon;

                        return (
                            <motion.article
                                key={
                                    experience.number
                                }
                                initial={{
                                    opacity: 0,
                                    y: 60
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true,
                                    amount: 0.15
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay:
                                        index * 0.12
                                }}
                                whileHover={{
                                    y: -10
                                }}
                                className="experience-card"
                            >

                                <img
                                    src={
                                        experience.image
                                    }
                                    alt={
                                        experience.title
                                    }
                                    className="experience-card-image"
                                />

                                <div className="experience-card-overlay" />

                                <div className="experience-card-content">

                                    <div className="experience-card-top">

                                        <span className="experience-number">
                                            {
                                                experience.number
                                            }
                                        </span>

                                        <div className="experience-icon">
                                            <Icon
                                                size={19}
                                            />
                                        </div>

                                    </div>

                                    <div>

                                        <h3 className="experience-card-title">
                                            {
                                                experience.title
                                            }

                                            <span>
                                                {
                                                    experience.script
                                                }
                                            </span>
                                        </h3>

                                        <p>
                                            {
                                                experience.description
                                            }
                                        </p>

                                    </div>

                                    <div className="experience-card-arrow">
                                        <ArrowUpRight
                                            size={22}
                                        />
                                    </div>

                                </div>

                            </motion.article>
                        );
                    }
                )}

            </div>
        </section>
    );
};

export default ExperienceSection;