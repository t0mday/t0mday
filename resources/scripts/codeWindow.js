/* This script creates event listeners for the programming language logos
on the Skills page and writes selected code samples to the code window 
underneath when a logo is clicked. 

Code sample is written to the code window incrementally, growing by one letter 
at a time and keywords are colour-coded by type, according to CSS stylesheet 

Only controlled elements are appended to the DOM (span and br). Everything else is appended as text nodes */

// code samples
const jsCode = 
`<span class="comment">// Javascript: Rotate a 'square' 2-D array of any size</span>
<span class="keyword">function</span> <span class="fnName">arrayRotateClock90</span>(arr) {
    <span class="comment">// map each cell's value to row opposite to starting column, and to column equal to starting row</span>
    <span class="keyword">return</span> arr.<span class="fnName">map</span>((row, i) <span class="keyword">=></span> 
        row.<span class="fnName">map</span>((cell, j) <span class="keyword">=></span> arr[arr.length-1-j][i]));
}`;
const pyCode = 
`<span class="comment"># Python: Deep clone n-dimensional list</span>
<span class="keyword">def</span> <span class="fnName">deep_clone</span>(list_in: list) -> list:
    <span class="keyword">if</span>(<span class="fnName">type</span>(list_in) == list):
        <span class="comment"># recursively map layers</span>
        <span class="keyword">return</span> [<span class="fnName">deep_clone</span>(layer) <span class="keyword">for</span> layer <span class="keyword">in</span> list_in]
    <span class="keyword">else</span>:
        <span class="keyword">return</span> list_in
`;
const phpCode = 
`<span class="comment">// PHP: Check if a number is prime</span> 
<span class="keyword">function</span> <span class="fnName">is_prime</span>(int $num): bool {
    <span class="keyword">if</span>($num < 2) <span class="keyword">return false</span>;
    <span class="comment">// check all possible smaller-of-two divisors</span>
    <span class="keyword">for</span>($i=2; $i<=<span class="fnName">sqrt</span>($num); $i++) {
        <span class="keyword">if</span>($num % $i == 0) <span class="keyword">return false</span>;
    }
    <span class="keyword">return true</span>;
}`;
const javaCode =  
`<span class="comment">// Java: Convert char array to Character list</span>
<span class="keyword">public static</span> <span class="type">List</span><Character> <span class="fnName">toList</span>(<span class="type">char</span>[] arr) {
    <span class="keyword">return</span> String.<span class="fnName">valueOf</span>(arr) <span class="comment">// convert to String</span>
        .<span class="fnName">chars</span>() <span class="comment">// convert to chars intstream</span>
        .<span class="fnName">mapToObj</span>(c -> (<span class="type">char</span>) c) <span class="comment">// ->char->Character</span>
        .<span class="fnName">collect</span>(Collectors.<span class="fnName">toList</span>()); 
}`;

// references to programming language logos in DOM
const js = document.getElementById("js");
const py = document.getElementById("py");
const php = document.getElementById("php");
const java = document.getElementById("java");
const codeWindow = document.getElementById("codeWindow");

// adds event listeners to programming language logos 
js.addEventListener("click", writeCode);
py.addEventListener("click", writeCode);
php.addEventListener("click", writeCode);
java.addEventListener("click", writeCode);

let timer; // reference to active setInterval

/* Writes selected code sample to the code window, getting larger by one 
character (or html tag) at a time, every 15ms, until complete or interrupted */
function writeCode(event) {
    // clears previous timer early if a new call is made before last one finished
    clearInterval(timer); 
    // input array of formatted code to be written
    const content = formatCode(selectCode(event.target)); 
    let i=0; // interval 'loop' control variable
    
    // set a repeating 15ms interval timer
    timer = setInterval(() => {
        if(i >= content.length) {
            clearInterval(timer); // clear interval timer when writing complete
            return;
        }

        // element to hold code to be added to the DOM
        const p = document.createElement('p');

        // create an array of code to be written (one letter or tag greater than previous)
        let codeItem = content.slice(0, i+1);
        // tracks the current parent to append successive nodes to
        let parent = p;

        // loops through the codeItem array, adding elements or text nodes to p.
        codeItem.forEach((c, j) => {
            // gets class name in opening span tag or null if anything else
            const newClass = extractClass(c);

            if(newClass) { // array item is opening span tag, appends span with its class to p and sets span as the parent to append following text nodes to
                parent = addElement(p, 'span', newClass);
            } else if(c.match(/^<\/span>/)) { // array item is closing span tag, parent is set back to p
                parent = p;
            } else if(c === '\n') { // new line converted to <br> element
                addElement(parent, 'br');
            } else if(c === ' ' && (codeItem[j+1] === ' ' || codeItem[j-1] === '\u00a0')) { // more than one space in a row, converts to non-breaking spaces
                addText(parent, '\u00a0')
            } else { // everything else treated as plain text
                addText(parent, c);
            }
        });

        // replaces existing codeWindow p element with new one
        document.querySelector('#codeWindow p').replaceWith(p);

        i++;
    }, 15);
}

// extracts the class name from span element opening tag. Returns null if not an opening span tag or no classname present
function extractClass(tag) {
    const openTag = tag.match(/^<span class="([\w\W]+?)">$/);
    return openTag ? openTag[1] : null;
}

// creates and appends DOM element to parent and adds optional classname to the element. Returns reference to created element
function addElement(parent, element, className) {
    let el = document.createElement(element);
    el.classList.add(className);
    parent.appendChild(el);
    return el;
}


// creates and appends text node to parent
function addText(parent, text) {
    const txt = document.createTextNode(text);
    parent.appendChild(txt);
}


// identifies code sample appropriate to the logo clicked
function selectCode(lang) {
    switch(lang) {
        case js: return jsCode;
        case py: return pyCode;
        case php: return phpCode;
        case java: return javaCode;
    }  
}


/* formats an html-ready code sample, returning a formatted array of single characters or 
whole html tags */
function formatCode(code) {
    let formattedArray = []; // output array
    
    // matches either opening or closing <span> tags at start of search string
    const spanRegex = /^<span[\w\W]*?>|^<\/span>/;  
    
    // loop through input code string as slices, pushing characters or html span tags to output array
    for(let i=0; i<code.length; i++) {
        // holds complete span tag if it is first part of current slice, or null otherwise
        let spanTag = code.slice(i).match(spanRegex);
        
        // push whole tag or current character to output array
        if(spanTag) {
            formattedArray.push(spanTag.join(''));
            i += spanTag[0].length-1; // increment loop control variable to skip rest of tag 
        } else {
            formattedArray.push(code[i]);
        }
    }
    return formattedArray;
}
