/* This script writes selected text elements to the DOM with a typewriter effect a character at a time, adding styles on the fly. This code is a light version of codeWindow.js, which would be more suitable instead if there are multiple events, requiring separate setInterval calls, which need to be prevented from interfering with each other. codeWindow.js also allows classnames to be in the span tags but is disallowed here.

Only span elements are appended to the DOM. Everything else is appended as text nodes only

Requires target element to be set to opacity: 0 in stylesheet. */


// adds event listener to execute after the page is fully loaded 
window.addEventListener("load", writeText);
// source element
const source = document.querySelector('.me p').innerHTML;

/* Writes selected text to the DOM, getting larger by one character (or html tag) at a time, every 30ms, until complete or interrupted */
function writeText() {
    // input array of formatted text to be written
    const content = formatText(source); 

    let i=0; // interval 'loop' control variable
    
    // set a repeating 30ms interval timer
    const timer = setInterval(() => {
        if(i >= content.length) {
            clearInterval(timer); // clear interval timer when writing complete
            return;
        }

        // element to hold text to be added to the DOM
        const p = document.createElement('p');

        // create an array of characters to be written (one letter or tag greater than previous)
        let snippet = content.slice(0, i+1);
        // tracks the current parent to append successive nodes to
        let parent = p;

        // loops through the snippet array, adding span elements or text nodes to p.
        snippet.forEach((c, j) => {
            if(c.match(/^<span>$/)) { // array item is opening span tag, appends span with its class to p and sets span as the parent to append following text nodes to
                parent = addElement(p, 'span');
            } else if(c.match(/^<\/span>$/)) { // array item is closing span tag, parent is set back to p
                parent = p;
            } else { // everything else treated as plain text
                addText(parent, c);
            }
        });

        // replaces existing target element with new one
        document.querySelector('.me p').replaceWith(p);

        // make text visible 
        document.querySelector('.me p').style.opacity = '1';

        i++;
    }, 30);
}

// creates and appends DOM element to parent. Returns reference to created element
function addElement(parent, element) {
    let el = document.createElement(element);
    parent.appendChild(el);
    return el;
}

// creates and appends text node to parent
function addText(parent, text) {
    const txt = document.createTextNode(text);
    parent.appendChild(txt);
}

/* formats an element text content, returning a formatted array of single characters or 
whole html tags */
function formatText(text) {
    if(typeof text !== 'string') {
        return [];
    }
    let formattedArray = []; // output array
    
    // matches either opening or closing <span> tags at start of search string
    const spanRegex = /^<span>|^<\/span>/;  
    
    // loop through input text string as slices, pushing characters or html span tags to output array
    for(let i=0; i<text.length; i++) {
        // holds complete span tag if it is first part of current slice, or null otherwise
        const spanTag = text.slice(i).match(spanRegex);
        
        // push whole tag or current single character to output array
        if(spanTag) {
            formattedArray.push(spanTag.join(''));
            i += spanTag[0].length-1; // increment loop control variable to skip rest of tag 
        } else {
            formattedArray.push(text[i]);
        }
    }
    return formattedArray;
}
