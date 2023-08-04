import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import imagesLoaded from 'imagesloaded';

const dummyArray = [
    {
        src: "https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "ABCDEFG QWER 1",
        location: "etyueiww",
        description: "This is the demo description"
    },
    {
        src: "https://images.pexels.com/photos/1647972/pexels-photo-1647972.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "ABCD QWER 2",
        location: "etyueiww",
        description: "This is the demo description"
    },
    {
        src: "https://images.pexels.com/photos/4261096/pexels-photo-4261096.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "ABCD QWER 3",
        location: "etyueiww",
        description: "This is the demo description"
    },
    {
        src: "https://images.pexels.com/photos/5038431/pexels-photo-5038431.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "ABCD QWER 4",
        location: "etyueiww",
        description: "This is the demo description"
    },
    {
        src: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "ABCD QWER 5",
        location: "etyueiww",
        description: "This is the demo description"
    },
    {
        src: "https://images.pexels.com/photos/1752372/pexels-photo-1752372.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "ABCD QWER 6",
        location: "etyueiww",
        description: "This is the demo description"
    },
    {
        src: "https://images.pexels.com/photos/8542673/pexels-photo-8542673.jpeg?auto=compress&cs=tinysrgb&w=600",
        name: "ABCD QWER 7",
        location: "etyueiww",
        description: "This is the demo description"
    }
];

const Carousel = () => {
    const [currentIndex, setcurrentIndex] = useState(0);
    const [buttons, setbuttons] = useState<any>();
    const [cardsContainerEl, setcardsContainerEl] = useState<any>();
    const [appBgContainerEl, setappBgContainerEl] = useState<any>();
    const [cardInfosContainerEl, setcardInfosContainerEl] = useState<any>();

    // START ====> Required Methods to apply js events, all the methods declared below are the helper methods
    const init = (cardsContainerEl: any, cardInfosContainerEl: any, buttons: any) => {
        let tl = gsap.timeline();
        tl.to(cardsContainerEl.children, {
            delay: 0.15,
            duration: 0.5,
            stagger: {
                ease: "power4.inOut",
                from: "start",
                amount: 0.1,
            },
            "--card-translateY-offset": "0%",
        })
            .to(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
                delay: 0.5,
                duration: 0.4,
                stagger: 0.1,
                opacity: 1,
                translateY: 0,
            })
            .to(
                [buttons.prev, buttons.next],
                {
                    duration: 0.4,
                    opacity: 1,
                    pointerEvents: "all",
                },
                "-=0.4"
            );
    }
    const waitForImages = (cardsContainerEl: any, cardInfosContainerEl: any, buttons: any) => {
        // @ts-ignore
        const images = [...document.querySelectorAll("img")];
        const totalImages = images.length;
        let loadedImages = 0;
        const loaderEl = document.querySelector(".loader span");
        gsap.set(cardsContainerEl.children, {
            "--card-translateY-offset": "100vh",
        });
        gsap.set(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
            translateY: "40px",
            opacity: 0,
        });
        gsap.set([buttons.prev, buttons.next], {
            pointerEvents: "none",
            opacity: "0",
        });
        images.forEach((image) => {
            imagesLoaded(image, (instance: any) => {
                if (instance.isComplete) {
                    loadedImages++;
                    let loadProgress = loadedImages / totalImages;
                    gsap.to(loaderEl, {
                        duration: 1,
                        scaleX: loadProgress,
                        backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
                    });
                    if (totalImages == loadedImages) {
                        gsap.timeline()
                            .to(".loading__wrapper", {
                                duration: 0.8,
                                opacity: 0,
                                pointerEvents: "none",
                            })
                            .call(() => init(cardsContainerEl, cardInfosContainerEl, buttons));
                    }
                }
            });
        });
    };
    const updateCard = (e: any, cardInfosContainerEl: any) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const centerPosition = {
            x: box.left + box.width / 2,
            y: box.top + box.height / 2,
        };
        let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
        gsap.set(card, {
            "--current-card-rotation-offset": `${angle}deg`,
        });
        const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
        gsap.set(currentInfoEl, {
            rotateY: `${angle}deg`,
        });
    }
    const resetCardTransforms = (e: any, cardInfosContainerEl: any) => {
        const card = e.currentTarget;
        const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
        gsap.set(card, {
            "--current-card-rotation-offset": 0,
        });
        gsap.set(currentInfoEl, {
            rotateY: 0,
        });
    }
    const initCardEvents = (cardsContainerEl: any, cardInfosContainerEl: any,) => {
        const currentCardEl = cardsContainerEl.querySelector(".current--card");
        currentCardEl.addEventListener("pointermove", ((event: any) => updateCard(event, cardInfosContainerEl)));
        currentCardEl.addEventListener("pointerout", (e: any) => resetCardTransforms(e, cardInfosContainerEl));
    }
    const removeCardEvents = (card: any, cardInfosContainerEl: any) => {
        card.removeEventListener("pointermove", ((event: any) => updateCard(event, cardInfosContainerEl)));
    }
    const swapInfosClass = (currentInfoEl: any, previousInfoEl: any, nextInfoEl: any, direction: any) => {
        // currentInfoEl.classList.remove("current--info");
        // previousInfoEl.classList.remove("previous--info");
        // nextInfoEl.classList.remove("next--info");
        // if (direction === "right") {
        //     currentInfoEl.classList.add("previous--info");
        //     nextInfoEl.classList.add("current--info");
        //     previousInfoEl.classList.add("next--info");
        // } else if (direction === "left") {
        //     currentInfoEl.classList.add("next--info");
        //     nextInfoEl.classList.add("previous--info");
        //     previousInfoEl.classList.add("current--info");
        // }
    }
    const changeInfo = (direction: any, cardInfosContainerEl: any, buttons: any, cardsContainerEl: any) => {
        // let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
        // let previousInfoEl = cardInfosContainerEl.querySelector(".previous--info");
        // let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");
        // gsap.timeline()
        //     .to([buttons.prev, buttons.next], {
        //         duration: 0.2,
        //         opacity: 0.5,
        //         pointerEvents: "none",
        //     })
        //     .to(
        //         currentInfoEl.querySelectorAll(".text"),
        //         {
        //             duration: 0.4,
        //             stagger: 0.1,
        //             translateY: "-120px",
        //             opacity: 0,
        //         },
        //         "-="
        //     )
        //     .call(() => {
        //         swapInfosClass(currentInfoEl, previousInfoEl, nextInfoEl, direction);
        //     })
        //     .call(() => initCardEvents(cardsContainerEl, cardInfosContainerEl))
        //     .fromTo(
        //         direction === "right"
        //             ? nextInfoEl.querySelectorAll(".text")
        //             : previousInfoEl.querySelectorAll(".text"),
        //         {
        //             opacity: 0,
        //             translateY: "40px",
        //         },
        //         {
        //             duration: 0.4,
        //             stagger: 0.1,
        //             translateY: "0px",
        //             opacity: 1,
        //         }
        //     )
        //     .to([buttons.prev, buttons.next], {
        //         duration: 0.2,
        //         opacity: 1,
        //         pointerEvents: "all",
        //     });
    }
    const swapCardsClass = (
        currentCardEl: any,
        previousCardEl: any,
        nextCardEl: any,
        currentBgImageEl: any,
        previousBgImageEl: any,
        nextBgImageEl: any,
        direction: any
    ) => {
        currentCardEl.style.zIndex = -2;
    };


    const swapCards = (direction: any, cardsContainerEl: any, appBgContainerEl: any, cardInfosContainerEl: any, buttons: any) => {
        const currentCardEl = cardsContainerEl.querySelector(".current--card");
        const previousCardEl = cardsContainerEl.querySelector(".previous--card");
        const nextCardEl = cardsContainerEl.querySelector(".next--card");

        const currentBgImageEl = appBgContainerEl.querySelector(".current--image");
        const previousBgImageEl = appBgContainerEl.querySelector(".previous--image");
        const nextBgImageEl = appBgContainerEl.querySelector(".next--image");

        changeInfo(direction, cardInfosContainerEl, buttons, cardsContainerEl);
        swapCardsClass(currentCardEl, previousCardEl, nextCardEl, currentBgImageEl, previousBgImageEl, nextBgImageEl, direction);
        removeCardEvents(currentCardEl, cardInfosContainerEl);
    }
    // END ====> Required Methods to apply js events, all the methods declared below are the helper methods

    // START ====> Enabling JS events using UseEffect, the very first step
    useEffect(() => {
        console.clear();
        const buttons2: any = {
            prev: document.querySelector(".btn--left"),
            next: document.querySelector(".btn--right"),
        };
        const cardsContainerE2: any = document.querySelector(".cards__wrapper");
        const cardInfosContainerE2: any = document.querySelector(".info__wrapper");

        setbuttons({
            prev: document.querySelector(".btn--left"),
            next: document.querySelector(".btn--right"),
        });
        setcardsContainerEl(document.querySelector(".cards__wrapper"));
        setappBgContainerEl(document.querySelector(".app__bg"));
        setcardInfosContainerEl(document.querySelector(".info__wrapper"));

        initCardEvents(cardsContainerE2, cardInfosContainerE2);
        waitForImages(cardsContainerE2, cardInfosContainerE2, buttons2);
    }, []);
    // END ====> Enabling JS events using UseEffect, the very first step

    return <>
        <div className="app">

            {/* START ====> Images Slider code */}
            <div className="cardList">

                {/* START ====> Code for Previous button */}
                <button
                    className="cardList__btn btn btn--left"
                    onClick={() => {
                        setcurrentIndex((prevIndex) => (prevIndex - 1 + dummyArray.length) % dummyArray.length);
                        swapCards("left", cardsContainerEl, appBgContainerEl, cardInfosContainerEl, buttons);
                    }}
                >
                    <div className="icon">
                        <svg>
                            <use xlinkHref="#arrow-left"></use>
                        </svg>
                    </div>
                </button>
                {/* END ====> Code for Previous button */}

                {/* START ====> Code for Images Cards */}
                {/* IF need to add image then add it here in same syntax */}
                <div className="cards__wrapper">
                    <div className="card current--card">
                        <div className="card__image">
                            <Image width={100} height={100} src={dummyArray[currentIndex].src} alt="" />
                        </div>
                    </div>
                    <div className="card next--card">
                        <div className="card__image">
                            <Image width={100} height={100} src={dummyArray[(currentIndex + 1) % dummyArray.length].src} alt="" />
                        </div>
                    </div>
                    <div className="card previous--card">
                        <div className="card__image">
                            <Image width={100} height={100} src={dummyArray[(currentIndex + dummyArray.length - 1) % dummyArray.length].src} alt="" />
                        </div>
                    </div>
                    {/* TO ADD A NEW IMAGE COPY ABOVE 5 LINES AND PASTE HERE AND CHANGE URL */}
                </div>
                {/* END ====> Code for Images Cards */}

                {/* START ====> Code for Next button  */}
                <button
                    className="cardList__btn btn btn--right"
                    onClick={() => {
                        setcurrentIndex((prevIndex) => (prevIndex + 1) % dummyArray.length);
                        swapCards("right", cardsContainerEl, appBgContainerEl, cardInfosContainerEl, buttons);
                    }}
                >
                    <div className="icon">
                        <svg>
                            <use xlinkHref="#arrow-right"></use>
                        </svg>
                    </div>
                </button>
                {/* END ====> Code for Next button  */}

            </div>
            {/* END ====> Images Slider code */}

            {/* START ====> Images Slider content code */}
            {/* IF need to add image content then add it in same syntax */}
            <div className="infoList">
                <div className="info__wrapper">
                    <div className="info current--info">
                        <h1 className="text name">{dummyArray[currentIndex].name}</h1>
                        <h4 className="text location">{dummyArray[currentIndex].location}</h4>
                        <p className="text description">{dummyArray[currentIndex].description}</p>
                    </div>
                    <div className="info next--info">
                        <h1 className="text name">{dummyArray[(currentIndex + 1) % dummyArray.length].name}</h1>
                        <h4 className="text location">{dummyArray[(currentIndex + 1) % dummyArray.length].location}</h4>
                        <p className="text description">{dummyArray[(currentIndex + 1) % dummyArray.length].description}</p>
                    </div>
                    <div className="info previous--info">
                        <h1 className="text name">{dummyArray[(currentIndex + dummyArray.length - 1) % dummyArray.length].name}</h1>
                        <h4 className="text location">{dummyArray[(currentIndex + dummyArray.length - 1) % dummyArray.length].location}</h4>
                        <p className="text description">{dummyArray[(currentIndex + dummyArray.length - 1) % dummyArray.length].description}</p>
                    </div>
                    {/* TO ADD A NEW IMAGE CONTENT COPY ABOVE 5 LINES AND PASTE HERE */}

                </div>
            </div>
            {/* END ====> Images Slider code */}

            {/* START ====> Enabling same bg for all slides */}
            <div className="app__bg">
                <div className="app__bg__image current--image">
                    <Image width={100} height={100} src={dummyArray[currentIndex].src} alt="" />
                </div>
                <div className="app__bg__image next--image">
                    <Image width={100} height={100} src={dummyArray[(currentIndex + 1) % dummyArray.length].src} alt="" />
                </div>
                <div className="app__bg__image previous--image">
                    <Image width={100} height={100} src={dummyArray[(currentIndex + dummyArray.length - 1) % dummyArray.length].src} alt="" />
                </div>
                {/* TO ADD A NEW IMAGE CONTENT COPY ABOVE 3 LINES AND PASTE HERE AND CHANGE URL */}

            </div>
            {/* END ====> Enabling same bg for all slides */}

        </div >

        {/* START ====> Code for the visibility of next and previous icons */}
        <svg className="icons" style={{ display: "none" }}>
            <symbol id="arrow-left" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                <polyline points='328 112 184 256 328 400'
                    style={{ fill: "none", stroke: "#fff", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: '48px' }} />
            </symbol>
            <symbol id="arrow-right" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                <polyline points='184 112 328 256 184 400'
                    style={{ fill: "none", stroke: "#fff", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: '48px' }} />
            </symbol>
        </svg>
        {/* END ====> Code for the visibility of next and previous icons */}

    </>
}

export default Carousel;
