import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    ChevronDown,
    Menu,
    X
} from "lucide-react";

import "./Home.css";

import ExperienceSection from "./components/ExperienceSection";
import HowItWorks from "./components/HowItWorks";
import FeaturesSection from "./components/FeaturesSection";
import AboutSection from "./components/AboutSection";
import CreatorSection from "./components/CreatorSection";
import Footer from "./components/Footer";

const slides = [
    {
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2200&q=90",
        location: "Mountain Escape",
        title: "Find your next",
        script: "adventure."
    },
    {
        image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2200&q=90",
        location: "Into The Wild",
        title: "Go somewhere",
        script: "beautiful."
    },
    {
        image:
            "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=2200&q=90",
        location: "Road Trip",
        title: "Take the long way",
        script: "together."
    },
    {
        image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90",
        location: "Golden Hour",
        title: "Make every journey",
        script: "memorable."
    }
];

const Home = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [progressKey, setProgressKey] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide(
                previous =>
                    (previous + 1) % slides.length
            );

            setProgressKey(
                previous => previous + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        handleScroll();

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    const goToSlide = (index) => {
        setActiveSlide(index);

        setProgressKey(
            previous => previous + 1
        );
    };

    const scrollToSection = (sectionId) => {
        setMenuOpen(false);

        const section =
            document.getElementById(sectionId);

        if (!section) {
            return;
        }

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    const currentSlide = slides[activeSlide];

    return (
        <>
            <main className="home-page">

                {/* ========================================
                    BACKGROUND SLIDESHOW
                ======================================== */}

                <div className="home-background">

                    <AnimatePresence mode="sync">

                        <motion.div
                            key={currentSlide.image}
                            className="home-background-image"
                            style={{
                                backgroundImage:
                                    `url(${currentSlide.image})`
                            }}
                            initial={{
                                opacity: 0,
                                scale: 1.08
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1
                            }}
                            exit={{
                                opacity: 0,
                                scale: 1.03
                            }}
                            transition={{
                                opacity: {
                                    duration: 1.2,
                                    ease: "easeInOut"
                                },
                                scale: {
                                    duration: 5.8,
                                    ease: "linear"
                                }
                            }}
                        />

                    </AnimatePresence>

                    <div className="home-overlay" />

                    <div className="home-vignette" />

                    <div className="hero-image-grain" />

                </div>

                {/* ========================================
                    NAVIGATION
                ======================================== */}

                <header
                    className={
                        isScrolled
                            ? "home-navbar scrolled"
                            : "home-navbar"
                    }
                >

                    <Link
                        to="/"
                        className="home-logo"
                    >
                        <span className="home-logo-mark">
                            P
                        </span>

                        <div>
                            <span className="home-logo-text">
                                PackUP
                            </span>

                            <span className="home-logo-subtitle">
                                Travel Together
                            </span>
                        </div>
                    </Link>

                    <nav className="home-nav-links">

                        <button
                            type="button"
                            onClick={() =>
                                scrollToSection(
                                    "experience"
                                )
                            }
                        >
                            Experience
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                scrollToSection(
                                    "how-it-works"
                                )
                            }
                        >
                            How it works
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                scrollToSection(
                                    "features"
                                )
                            }
                        >
                            Features
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                scrollToSection(
                                    "about"
                                )
                            }
                        >
                            About
                        </button>

                    </nav>

                    <div className="home-nav-actions">

                        <Link
                            to="/login"
                            className="home-signin"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/register"
                            className="home-get-started"
                        >
                            Get Started

                            <ArrowRight
                                size={16}
                            />

                        </Link>

                    </div>

                    <button
                        className="home-mobile-button"
                        onClick={() =>
                            setMenuOpen(
                                previous =>
                                    !previous
                            )
                        }
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>

                </header>

                {/* ========================================
                    MOBILE MENU
                ======================================== */}

                <AnimatePresence>

                    {menuOpen && (

                        <motion.div
                            className="home-mobile-menu"
                            initial={{
                                opacity: 0,
                                y: -20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                y: -20
                            }}
                            transition={{
                                duration: 0.25
                            }}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection(
                                        "experience"
                                    )
                                }
                            >
                                Experience
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection(
                                        "how-it-works"
                                    )
                                }
                            >
                                How it works
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection(
                                        "features"
                                    )
                                }
                            >
                                Features
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection(
                                        "about"
                                    )
                                }
                            >
                                About
                            </button>

                            <Link
                                to="/login"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                            >
                                Sign In
                            </Link>

                            <Link
                                to="/register"
                                className="mobile-menu-cta"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                            >
                                Get Started

                                <ArrowRight
                                    size={16}
                                />

                            </Link>

                        </motion.div>

                    )}

                </AnimatePresence>

                {/* ========================================
                    HERO
                ======================================== */}

                <section className="home-hero">

                    <div className="home-hero-content">

                        {/* Location */}

                        <AnimatePresence
                            mode="wait"
                        >

                            <motion.div
                                key={`location-${activeSlide}`}
                                initial={{
                                    opacity: 0,
                                    y: 18
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10
                                }}
                                transition={{
                                    duration: 0.45
                                }}
                                className="home-location"
                            >

                                <span className="location-dot" />

                                {currentSlide.location}

                            </motion.div>

                        </AnimatePresence>

                        {/* Main heading */}

                        <AnimatePresence
                            mode="wait"
                        >

                            <motion.h1
                                key={`heading-${activeSlide}`}
                                initial={{
                                    opacity: 0,
                                    y: 35
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -25
                                }}
                                transition={{
                                    duration: 0.7,
                                    ease: [
                                        0.22,
                                        1,
                                        0.36,
                                        1
                                    ]
                                }}
                                className="home-hero-title"
                            >

                                {currentSlide.title}

                                <span className="script-heading">
                                    {currentSlide.script}
                                </span>

                            </motion.h1>

                        </AnimatePresence>

                        {/* Description */}

                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.7,
                                delay: 0.35
                            }}
                            className="home-hero-description"
                        >
                            Plan trips, bring your people together,
                            chat in real time and split expenses
                            without the hassle.
                        </motion.p>

                        {/* CTA */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.7,
                                delay: 0.5
                            }}
                            className="home-hero-actions"
                        >

                            <Link
                                to="/register"
                                className="hero-primary-button"
                            >
                                <span>
                                    Start Your Journey
                                </span>

                                <ArrowRight
                                    size={18}
                                />

                            </Link>

                            <button
                                type="button"
                                className="hero-secondary-button"
                                onClick={() =>
                                    scrollToSection(
                                        "experience"
                                    )
                                }
                            >
                                Explore PackUP
                            </button>

                        </motion.div>

                    </div>

                    {/* ========================================
                        SLIDE CONTROLS
                    ======================================== */}

                    <div className="hero-slide-controls">

                        <div className="hero-slide-counter">

                            <span className="hero-slide-current">
                                {String(
                                    activeSlide + 1
                                ).padStart(2, "0")}
                            </span>

                            <span className="hero-slide-divider">
                                /
                            </span>

                            <span>
                                {String(
                                    slides.length
                                ).padStart(2, "0")}
                            </span>

                        </div>

                        <div className="slide-indicators">

                            {slides.map(
                                (slide, index) => (

                                    <button
                                        key={
                                            slide.location
                                        }
                                        onClick={() =>
                                            goToSlide(
                                                index
                                            )
                                        }
                                        className={
                                            index ===
                                            activeSlide
                                                ? "slide-indicator active"
                                                : "slide-indicator"
                                        }
                                        aria-label={
                                            `Go to slide ${index + 1}`
                                        }
                                    >

                                        <span
                                            key={
                                                index ===
                                                activeSlide
                                                    ? `progress-${progressKey}`
                                                    : `static-${index}`
                                            }
                                        />

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                    {/* ========================================
                        SCROLL INDICATOR
                    ======================================== */}

                    <motion.button
                        type="button"
                        className="scroll-indicator"
                        onClick={() =>
                            scrollToSection(
                                "experience"
                            )
                        }
                        animate={{
                            y: [0, 8, 0]
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >

                        <span>
                            Scroll to explore
                        </span>

                        <ChevronDown
                            size={18}
                        />

                    </motion.button>

                </section>

                {/* ========================================
                    HERO STATS
                ======================================== */}

                <div className="home-hero-stats">

                    <div>
                        <strong>
                            01
                        </strong>

                        <span>
                            Create a trip
                        </span>
                    </div>

                    <div>
                        <strong>
                            02
                        </strong>

                        <span>
                            Bring your people
                        </span>
                    </div>

                    <div>
                        <strong>
                            03
                        </strong>

                        <span>
                            Travel together
                        </span>
                    </div>

                </div>

            </main>

            {/* Experience */}

            <ExperienceSection />

            {/* How PackUP Works */}

            <HowItWorks />

            {/* Features */}

            <FeaturesSection />

            {/* About PackUP */}

            <AboutSection />

            {/* Creator */}

            <CreatorSection />

            {/* Footer */}

            <Footer />

        </>
    );
};

export default Home;