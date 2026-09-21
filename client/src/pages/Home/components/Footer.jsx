import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="home-footer">

            <div className="footer-container">

                <div className="footer-main">

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{
                            once: true,
                            amount: 0.3
                        }}
                        transition={{
                            duration: 0.7
                        }}
                        className="footer-brand"
                    >

                        <Link
                            to="/"
                            className="footer-logo"
                        >
                            <span className="footer-logo-mark">
                                P
                            </span>

                            <span className="footer-logo-text">
                                PackUP
                            </span>
                        </Link>

                        <p className="footer-tagline">
                            Travel together.
                        </p>

                        <p className="footer-description">
                            One place to create trips,
                            bring your people together
                            and make every journey
                            memorable.
                        </p>

                    </motion.div>

                    <div className="footer-links">

                        <div className="footer-column">

                            <span className="footer-column-title">
                                EXPLORE
                            </span>

                            <a href="#experience">
                                Experience
                            </a>

                            <a href="#how-it-works">
                                How it works
                            </a>

                            <a href="#features">
                                Features
                            </a>

                            <a href="#about">
                                About
                            </a>

                        </div>

                        <div className="footer-column">

                            <span className="footer-column-title">
                                ACCOUNT
                            </span>

                            <Link to="/login">
                                Sign In
                            </Link>

                            <Link to="/register">
                                Get Started
                            </Link>

                        </div>

                        <div className="footer-column">

                            <span className="footer-column-title">
                                CREATORS
                            </span>

                            <a href="#creator">
                                Vipul Raj
                            </a>

                            <a href="#creator">
                                Keshav Singh
                            </a>

                        </div>

                    </div>

                </div>

                <motion.div
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
                        amount: 0.3
                    }}
                    transition={{
                        duration: 0.9
                    }}
                    className="footer-statement"
                >

                    <p>
                        See you
                    </p>

                    <span>
                        somewhere.
                    </span>

                </motion.div>

                <div className="footer-bottom">

                    <span>
                        © 2026 PackUP. All rights reserved.
                    </span>

                    <div className="footer-creator-socials">

                        <span>
                            Find us
                        </span>

                        <a
                            href="https://www.instagram.com/vipul.raaaj?stkn=MTQ3cmRyOHdkemJmbg=="
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Vipul Raj Instagram"
                        >
                            <span>
                                IG
                            </span>

                            <span>
                                Vipul
                            </span>
                        </a>

                        <a
                            href="https://www.instagram.com/keshavvv15?stkn=dzJwemptYTZqb3Fn"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Keshav Singh Instagram"
                        >
                            <span>
                                IG
                            </span>

                            <span>
                                Keshav
                            </span>
                        </a>

                    </div>

                    <a
                        href="#"
                        className="footer-back-top"
                        onClick={(event) => {
                            event.preventDefault();

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                        }}
                    >
                        Back to top

                        <ArrowUpRight
                            size={16}
                        />
                    </a>

                </div>

            </div>

        </footer>
    );
};

export default Footer;