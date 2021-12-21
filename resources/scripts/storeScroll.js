/* This script adds a passive event listener for scroll events, to store scroll position data 
required by the fadeInNavBackground animation in style.css */

/* Debounce function to group flurries of scrolling events into single events for processing, 
to prevent excessive calls. */
/* The debounce function takes a function to be debounced, returning an 
anonymous function that can receive a variable number of arguments (the event object generated 
    by the event listener). */
function debounce(fn) {
    // Holds the requestAnimationFrame reference, so it can be cancelled
    let frame;
    return (...args) => {
        // If the frame variable has been defined, clear it now
        if(frame) {
            cancelAnimationFrame(frame);
        }
        // Queue fn call for the next frame 
        frame = requestAnimationFrame(() => {
            // Call function and pass any parameters received
            fn(...args);
        });
    }
}

/* Returns a value corresponding to the current scroll position in a data attribute on 
the html element. It is represented in the DOM by <html data-scroll="returned_value"> 
and can be used in the stylesheet */
const storeScroll = () => document.documentElement.dataset.scroll = window.scrollY;

/* Prevents excessive performance degradation by using a passive event listener 
in combination with the debounced storeScroll function. The passive option stops the browser 
from constantly checking if preventDefault has been called. */
document.addEventListener("scroll", debounce(storeScroll), { passive: true });

// Store the scroll position for the first time when page loads
storeScroll();