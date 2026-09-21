import { useEffect, useState } from "react";
import {
    motion,
    AnimatePresence
} from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight
} from "lucide-react";

const creators = [
    {
        name: "Vipul Raj",
        role: "CO-FOUNDER & CREATOR",
        image: "/vipul.jpg",
        number: "01",
        social: {
            github: "#",
            linkedin: "#",
            instagram:
                "https://www.instagram.com/vipul.raaaj?stkn=MTQ3cmRyOHdkemJmbg=="
        }
    },
    {
        name: "Keshav Singh",
        role: "CO-FOUNDER & CREATOR",
        image: "/keshav.jpg",
        number: "02",
        social: {
            github: "#",
            linkedin: "#",
            instagram:
                "https://www.instagram.com/keshavvv15?stkn=dzJwemptYTZqb3Fn"
        }
    }
];

const CreatorSection = () => {
    const [activeCreator, setActiveCreator] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCreator(
                previous =>
                    (previous + 1) % creators.length
            );
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const currentCreator = creators[activeCreator];

    const previousCreator = () => {
        setActiveCreator(
            previous =>
                previous === 0
                    ? creators.length - 1
                    : previous - 1
        );
    };

    const nextCreator = () => {
        setActiveCreator(
            previous =>
                (previous + 1) % creators.length
        );
    };

    return (
        <section
            id="creator"
            className="creator-section"
        >
            <div className="creator-container">

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
                        duration: 0.8
                    }}
                    className="creator-header"
                >
                    <p className="section-eyebrow">
                        THE PEOPLE BEHIND PACKUP
                    </p>

                    <h2 className="creator-heading">
                        Built by
                        <span>
                            travellers.
                        </span>
                    </h2>
                </motion.div>

                <div className="creator-content">

                    {/* Creator slideshow */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -50
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
                            duration: 0.9
                        }}
                        className="creator-visual"
                    >

                        <div
                            className="creator-image-wrapper"
                            style={{
                                display: "block",
                                position: "relative"
                            }}
                        >

                            <AnimatePresence mode="wait">

                                <motion.img
                                    key={
                                        currentCreator.image
                                    }
                                    src={
                                        currentCreator.image
                                    }
                                    alt={
                                        currentCreator.name
                                    }
                                    initial={{
                                        opacity: 0,
                                        scale: 1.06
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 1.02
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        position:
                                            "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            </AnimatePresence>

                            <div
                                className="creator-image-overlay"
                                style={{
                                    zIndex: 2,
                                    pointerEvents:
                                        "none"
                                }}
                            />

                            {/* Creator name */}

                            <AnimatePresence mode="wait">

                                <motion.div
                                    key={
                                        currentCreator.name
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 15
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
                                        duration: 0.5
                                    }}
                                    style={{
                                        position:
                                            "absolute",
                                        left: "25px",
                                        right: "25px",
                                        bottom: "25px",
                                        zIndex: 5,
                                        padding:
                                            "18px 20px",
                                        border:
                                            "1px solid rgba(255,255,255,0.15)",
                                        borderRadius:
                                            "17px",
                                        background:
                                            "rgba(10,10,12,0.65)",
                                        backdropFilter:
                                            "blur(14px)"
                                    }}
                                >

                                    <span
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "5px",
                                            color:
                                                "#aaa4ff",
                                            fontSize:
                                                "9px",
                                            fontWeight:
                                                "700",
                                            letterSpacing:
                                                "3px"
                                        }}
                                    >
                                        {
                                            currentCreator.role
                                        }
                                    </span>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            color:
                                                "white",
                                            fontSize:
                                                "21px",
                                            fontWeight:
                                                "600"
                                        }}
                                    >
                                        {
                                            currentCreator.name
                                        }
                                    </strong>

                                </motion.div>

                            </AnimatePresence>

                            {/* Slide number */}

                            <div
                                style={{
                                    position:
                                        "absolute",
                                    top: "28px",
                                    right: "28px",
                                    zIndex: 5,
                                    color:
                                        "rgba(255,255,255,0.5)",
                                    fontSize:
                                        "11px",
                                    fontWeight:
                                        "700",
                                    letterSpacing:
                                        "3px"
                                }}
                            >
                                {
                                    currentCreator.number
                                }

                                <span
                                    style={{
                                        opacity: 0.35
                                    }}
                                >
                                    {" / "}
                                    02
                                </span>
                            </div>

                        </div>

                        {/* Slideshow controls */}

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                marginTop: "18px"
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "8px"
                                }}
                            >

                                {creators.map(
                                    (
                                        creator,
                                        index
                                    ) => (
                                        <button
                                            key={
                                                creator.name
                                            }
                                            onClick={() =>
                                                setActiveCreator(
                                                    index
                                                )
                                            }
                                            aria-label={
                                                `Show ${creator.name}`
                                            }
                                            style={{
                                                width:
                                                    index ===
                                                    activeCreator
                                                        ? "42px"
                                                        : "18px",
                                                height:
                                                    "3px",
                                                padding:
                                                    0,
                                                border:
                                                    0,
                                                borderRadius:
                                                    "10px",
                                                background:
                                                    index ===
                                                    activeCreator
                                                        ? "#c2bcff"
                                                        : "rgba(255,255,255,0.2)",
                                                cursor:
                                                    "pointer",
                                                transition:
                                                    "all 0.35s ease"
                                            }}
                                        />
                                    )
                                )}

                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap: "8px"
                                }}
                            >

                                <button
                                    onClick={
                                        previousCreator
                                    }
                                    aria-label="Previous creator"
                                    style={{
                                        width:
                                            "42px",
                                        height:
                                            "42px",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        border:
                                            "1px solid rgba(255,255,255,0.12)",
                                        borderRadius:
                                            "50%",
                                        background:
                                            "rgba(255,255,255,0.04)",
                                        color:
                                            "white",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    <ArrowLeft
                                        size={17}
                                    />
                                </button>

                                <button
                                    onClick={
                                        nextCreator
                                    }
                                    aria-label="Next creator"
                                    style={{
                                        width:
                                            "42px",
                                        height:
                                            "42px",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        border:
                                            "1px solid rgba(255,255,255,0.12)",
                                        borderRadius:
                                            "50%",
                                        background:
                                            "rgba(255,255,255,0.04)",
                                        color:
                                            "white",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    <ArrowRight
                                        size={17}
                                    />
                                </button>

                            </div>

                        </div>

                    </motion.div>

                    {/* Creator information */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 50
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
                            duration: 0.9,
                            delay: 0.1
                        }}
                        className="creator-copy"
                    >

                        <span className="creator-role">
                            FOUNDERS & CREATORS
                        </span>

                        <h3>

                            <span
                                style={{
                                    display:
                                        "block",
                                    color:
                                        "white",
                                    fontFamily:
                                        '"DM Sans", sans-serif',
                                    fontSize:
                                        "1em",
                                    fontWeight:
                                        "600",
                                    letterSpacing:
                                        "-3px"
                                }}
                            >
                                Vipul Raj
                            </span>

                            <span
                                style={{
                                    display:
                                        "block",
                                    marginTop:
                                        "8px",
                                    color:
                                        "#c2bcff",
                                    fontFamily:
                                        '"DM Sans", sans-serif',
                                    fontSize:
                                        "0.72em",
                                    fontWeight:
                                        "500",
                                    letterSpacing:
                                        "-2px"
                                }}
                            >
                                & Keshav Singh
                            </span>

                        </h3>

                        <p className="creator-lead">
                            PackUP was built by two
                            travellers who wanted to
                            make travelling with
                            friends feel easier,
                            more connected and more
                            memorable.
                        </p>

                        <p>
                            We noticed that group
                            trips often mean endless
                            chats, scattered plans,
                            confusing expenses and
                            too many different apps.
                        </p>

                        <p>
                            So we started building one
                            place where people can
                            create trips, bring their
                            friends together,
                            communicate, manage
                            expenses and enjoy the
                            journey from one platform.
                        </p>

                        <div className="creator-quote">

                            <span>
                                "
                            </span>

                            <p>
                                The best journeys are
                                the ones you remember
                                together.
                            </p>

                        </div>

                        {/* Social links */}

                        <div
                            className="creator-footer"
                            style={{
                                justifyContent:
                                    "flex-start"
                            }}
                        >

                            <div
                                className="creator-socials"
                            >

                                <a
                                    href={
                                        currentCreator
                                            .social
                                            .github
                                    }
                                    aria-label={`${currentCreator.name} GitHub`}
                                    style={{
                                        pointerEvents:
                                            "none",
                                        opacity: 0.3
                                    }}
                                >
                                    GH
                                </a>

                                <a
                                    href={
                                        currentCreator
                                            .social
                                            .linkedin
                                    }
                                    aria-label={`${currentCreator.name} LinkedIn`}
                                    style={{
                                        pointerEvents:
                                            "none",
                                        opacity: 0.3
                                    }}
                                >
                                    IN
                                </a>

                                <a
                                    href={
                                        currentCreator
                                            .social
                                            .instagram
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${currentCreator.name} Instagram`}
                                >
                                    IG
                                </a>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default CreatorSection;