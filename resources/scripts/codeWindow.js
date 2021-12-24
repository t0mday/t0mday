/* This script creates event listeners for the programming language logos
on the Skills page and writes selected code samples to the code window 
underneath when a logo is clicked. 

Code sample is written to the code window incrementally, growing by one letter 
at a time and keywords are colour-coded by type, according to CSS stylesheet */

// code samples
const jsCode = 
`<span class="comment">// Javascript: </span>
`;
const pyCode = 
`<span class="comment"># Python: Deep clone n-dimensional list</span>
<span class="fd">def</span> <span class="fn">deep_clone</span>(list_in):
    <span class="keyword">if</span>(type(list_in) == list):
        <span class="keyword">return</span> [deep_clone(layer) <span class="keyword">for</span> layer <span class="keyword">in</span> list_in]
    <span class="keyword">else</span>:
        <span class="keyword">return</span> list_in
`;
const phpCode = 
`<span class="comment">// PHP: </span> 
`;
const javaCode =  
`<span class="comment">// Java: Convert char array to Character list</span>
public static List<Character> toList(char[] arr) {
    return String.valueOf(arr) <span class="comment">// convert to String</span>
        .chars() <span class="comment">// convert to chars intstream</span>
        .mapToObj(c -> (char) c) <span class="comment">// ->char->Character</span>
        .collect(Collectors.toList()); 
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
        // create section of code to be written (one letter or tag greater than previous)
        let codeItem = content.slice(0, i+1).join('');
        // check if opening tag has been closed, and close it if not
        let openTags = codeItem.match(/<span[\w\W]+?>/g);
        let closedTags = codeItem.match(/<\/span>/g) || [];
        if(openTags.length > closedTags.length) {  
            codeItem += '</span>';
        }

        codeItem = '<p>' + codeItem + '</p>'; // Enclose in <p> tags

        // write to codewindow, replacing existing content
        $('#codeWindow p').replaceWith(codeItem);
        i++;
    }, 15);
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
        let span = '';
        span = code.slice(i).match(spanRegex);
        
        // push whole tag or current character to output array
        if(span) {
            formattedArray.push(span);
            i += span[0].length-1; // increment loop control variable to skip rest of tag 
        } else if(code[i] === '\n') {
            formattedArray.push('<br>'); // to ensure correct line breaks in html
        } else if(code[i] === ' ') {
            formattedArray.push('&nbsp;') // to ensure correct code indentation in html
        }else {
            formattedArray.push(code[i]);
        }
    }
    return formattedArray;
}
