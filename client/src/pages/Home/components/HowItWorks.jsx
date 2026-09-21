import { motion } from "framer-motion";
import {
    PlusCircle,
    UserPlus,
    CheckCircle,
    MessageCircle,
    Wallet,
    Compass
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: PlusCircle,
        title: "Create",
        script: "your trip.",
        description:
            "Choose your destination, dates, budget and the kind of adventure you want to experience.",
        label: "PLAN"
    },
    {
        number: "02",
        icon: UserPlus,
        title: "Invite",
        script: "your crew.",
        description:
            "Share your unique Trip Code with your friends and let them request to join your journey.",
        label: "CONNECT"
    },
    {
        number: "03",
        icon: CheckCircle,
        title: "Build",
        script: "your group.",
        description:
            "Approve the people you want on your trip and create your travel crew together.",
        label: "TOGETHER"
    },
    {
        number: "04",
        icon: MessageCircle,
        title: "Plan",
        script: "together.",
        description:
            "Chat with your group, coordinate plans and keep everyone connected in one place.",
        label: "COLLABORATE"
    },
    {
        number: "05",
        icon: Wallet,
        title: "Split",
        script: "the expenses.",
        description:
            "Record shared expenses, see everyone's balance and keep track of settlements.",
        label: "SIMPLE"
    },
    {
        number: "06",
        icon: Compass,
        title: "Enjoy",
        script: "the journey.",
        description:
            "Everything is ready. Pack your bags, meet your people and make the trip memorable.",
        label: "GO"
    }
];

const HowItWorks = () => {
    return (
        <section
            id="how-it-works"
            className="how-section"
        >
            <div className="how-container">

                <div className="how-intro">

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
                        HOW PACKUP WORKS
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
                        className="how-heading"
                    >
                        From an idea

                        <span>
                            to a journey.
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
                        className="how-description"
                    >
                        PackUP brings everything your
                        group needs into one simple
                        travel experience.
                    </motion.p>

                </div>

                <div className="how-timeline">

                    <div className="how-line">
                        <motion.div
                            className="how-line-progress"
                            initial={{
                                scaleY: 0
                            }}
                            whileInView={{
                                scaleY: 1
                            }}
                            viewport={{
                                once: true,
                                amount: 0.1
                            }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut"
                            }}
                        />
                    </div>

                    {steps.map(
                        (step, index) => {

                            const Icon =
                                step.icon;

                            const isEven =
                                index % 2 === 0;

                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{
                                        opacity: 0,
                                        y: 50
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    viewport={{
                                        once: true,
                                        amount: 0.25
                                    }}
                                    transition={{
                                        duration: 0.7,
                                        delay:
                                            index * 0.08
                                    }}
                                    className={`how-step ${
                                        isEven
                                            ? "step-left"
                                            : "step-right"
                                    }`}
                                >

                                    <div className="how-step-content">

                                        <span className="how-step-label">
                                            {step.label}
                                        </span>

                                        <div className="how-step-number">
                                            {step.number}
                                        </div>

                                        <h3>
                                            {step.title}

                                            <span>
                                                {
                                                    step.script
                                                }
                                            </span>
                                        </h3>

                                        <p>
                                            {
                                                step.description
                                            }
                                        </p>

                                    </div>

                                    <div className="how-step-node">

                                        <Icon
                                            size={20}
                                        />

                                    </div>

                                </motion.div>
                            );
                        }
                    )}

                </div>

            </div>
        </section>
    );
};

export default HowItWorks;