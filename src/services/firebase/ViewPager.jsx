import React, { useState, useRef } from "react";
// import "./styles.css";

const ViewPager = () => {
    const [currentSlide, setCurrentSlide] = useState(0); // To track the current slide index
    const [startX, setStartX] = useState(0); // To store the starting X position for touch events
    const viewpagerRef = useRef(null); // To reference the viewpager container

    const slides = [
        "Slide 1",
        "Slide 2",
        "Slide 3",
        "Slide 4"
    ];

    // Function to move to a specific slide
    const moveSlide = (step) => {
        const totalSlides = slides.length;
        let newSlide = currentSlide + step;

        // Loop to the first or last slide
        if (newSlide < 0) {
            newSlide = totalSlides - 1;
        } else if (newSlide >= totalSlides) {
            newSlide = 0;
        }

        setCurrentSlide(newSlide);
    };

    // Handle touch start event
    const handleTouchStart = (e) => {
        const touchStartX = e.touches[0].clientX;
        setStartX(touchStartX); // Record the initial touch position
    };

    // Handle touch move event
    const handleTouchMove = (e) => {
        const touchEndX = e.touches[0].clientX;
        const deltaX = startX - touchEndX;

        // If the swipe is significant enough, move the slide
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                moveSlide(1); // Swipe left, move to the next slide
            } else {
                moveSlide(-1); // Swipe right, move to the previous slide
            }
            setStartX(0); // Reset the start position after moving
        }
    };

    // Handle touch end event
    const handleTouchEnd = () => {
        setStartX(0); // Reset the start position when the touch ends
    };

    return (
        <div
            className="viewpager-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="viewpager"
                ref={viewpagerRef}
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`, // Slide movement
                }}
            >
                {slides.map((slide, index) => (
                    <div className="viewpager-slide" key={index}>
                        {slide}
                    </div>
                ))}
            </div>

            <div className="viewpager-nav">
                <button className="prev" onClick={() => moveSlide(-1)}>
                    &#10094;
                </button>
                <button className="next" onClick={() => moveSlide(1)}>
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default ViewPager;
