import { useState } from "react";
import { motion } from "framer-motion";
import {
    MessageCircle,
    Wallet,
    Users,
    Bell,
    Map,
    ShieldCheck,
    ArrowUpRight
} from "lucide-react";

const features = [
    {
        id: "chat",
        number: "01",
        icon: MessageCircle,
        title: "Stay",
        script: "connected.",
        description:
            "Keep the whole group connected with real-time trip chat. Share plans, updates and important details without switching between apps.",
        label: "REAL-TIME CHAT"
    },
    {
        id: "expenses",
        number: "02",
        icon: Wallet,
        title: "Split",
        script: "expenses.",
        description:
            "Track shared expenses, see who owes what and keep settlements organized throughout the trip.",
        label: "SMART EXPENSES"
    },
    {
        id: "groups",
        number: "03",
        icon: Users,
        title: "Build",
        script: "your crew.",
        description:
            "Create private trips, invite people with a Trip Code and stay in control of who joins your journey.",
        label: "GROUP TRAVEL"
    },
    {
        id: "notifications",
        number: "04",
        icon: Bell,
        title: "Never miss",
        script: "a thing.",
        description:
            "Get notified when someone requests to join, accepts an invitation, updates a trip or sends something important.",
        label: "NOTIFICATIONS"
    },
    {
        id: "planning",
        number: "05",
        icon: Map,
        title: "Plan",
        script: "your way.",
        description:
            "Keep your trip information together so your group always knows where you're going and what you're planning.",
        label: "TRIP PLANNING"
    },
    {
        id: "security",
        number: "06",
        icon: ShieldCheck,
        title: "Travel",
        script: "securely.",
        description:
            "Protected authentication and controlled trip membership keep your private group experience private.",
        label: "SECURE GROUPS"
    }
];

const FeaturesSection = () => {
    const [activeFeature, setActiveFeature] =
        useState(features[0]);

    const ActiveIcon = activeFeature.icon;

    return (
        <section
            id="features"
            className="features-section"
        >
            <div className="features-container">

                <div className="features-header">

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
                        EVERYTHING IN ONE PLACE
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
                        className="features-heading"
                    >
                        Your trip.
                        <span>
                            One place.
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
                        className="features-description"
                    >
                        Everything your group needs
                        to plan, communicate and
                        travel together.
                    </motion.p>

                </div>

                <div className="features-showcase">

                    <div className="features-list">

                        {features.map(
                            feature => {

                                const Icon =
                                    feature.icon;

                                const isActive =
                                    activeFeature.id ===
                                    feature.id;

                                return (
                                    <motion.button
                                        key={feature.id}
                                        onClick={() =>
                                            setActiveFeature(
                                                feature
                                            )
                                        }
                                        whileHover={{
                                            x: 8
                                        }}
                                        className={`feature-item ${
                                            isActive
                                                ? "active"
                                                : ""
                                        }`}
                                    >

                                        <div className="feature-item-icon">
                                            <Icon
                                                size={20}
                                            />
                                        </div>

                                        <div className="feature-item-text">

                                            <span>
                                                {
                                                    feature.number
                                                }
                                            </span>

                                            <strong>
                                                {
                                                    feature.label
                                                }
                                            </strong>

                                        </div>

                                        <ArrowUpRight
                                            size={18}
                                            className="feature-item-arrow"
                                        />

                                    </motion.button>
                                );
                            }
                        )}

                    </div>

                    <motion.div
                        key={activeFeature.id}
                        initial={{
                            opacity: 0,
                            scale: 0.96
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        transition={{
                            duration: 0.5
                        }}
                        className="feature-preview"
                    >

                        <div className="feature-preview-glow" />

                        <div className="feature-preview-top">

                            <div className="feature-preview-icon">
                                <ActiveIcon
                                    size={25}
                                />
                            </div>

                            <span>
                                {activeFeature.number}
                            </span>

                        </div>

                        <div className="feature-preview-content">

                            <p>
                                {activeFeature.label}
                            </p>

                            <h3>
                                {activeFeature.title}

                                <span>
                                    {
                                        activeFeature.script
                                    }
                                </span>
                            </h3>

                            <div className="feature-preview-line" />

                            <p className="feature-preview-description">
                                {
                                    activeFeature.description
                                }
                            </p>

                        </div>

                        <div className="feature-preview-orbit orbit-one" />
                        <div className="feature-preview-orbit orbit-two" />

                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;