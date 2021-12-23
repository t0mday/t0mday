const js = document.getElementById("js");
const py = document.getElementById("py");
const php = document.getElementById("php");
const java = document.getElementById("java");
const codeWindow = document.getElementById("codeWindow");

js.addEventListener("click", writeCode);
py.addEventListener("click", writeCode);
php.addEventListener("click", writeCode);
java.addEventListener("click", writeCode);

let timer; 

function writeCode(event) {
    clearInterval(timer);
    const content = formatCode(selectCode(event.target));
    let i=0;
    timer = setInterval(() => {
        if(i >= content.length) {
            clearInterval(timer);
            return;
        }
        let codeItem = content.slice(0, i+1).join('');
        let openTags = codeItem.match(/<span[\w\W]+?>/g);
        let closedTags = codeItem.match(/<\/span>/g) || [];

        if(openTags.length > closedTags.length) {  
            codeItem += '</span>';
        }
        codeItem = '<p>' + codeItem + '</p>';
        $('#codeWindow p').replaceWith(codeItem);
        i++;
    }, 15);
}

function selectCode(lang) {
    switch(lang) {
        case js: return jsCode;
        case py: return pyCode;
        case php: return phpCode;
        case java: return javaCode;
    }  
}

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


function formatCode(code) {
    let formattedArray = [];
    const spanOpenRegex = /^<span[\w\W]+?>/;
    const spanCloseRegex = /^<\/span>/;
    let spanOpen = '';
    let spanClose = '';
    for(let i=0; i<code.length; i++) {
        spanOpen = code.slice(i).match(spanOpenRegex);
        spanClose = code.slice(i).match(spanCloseRegex);
        if(spanOpen) {
            formattedArray.push(spanOpen);
            i += spanOpen[0].length-1;
        } else if(spanClose) {
            formattedArray.push(spanClose);
            i += spanClose[0].length-1;
        } else if(code[i] === '\n') {
            formattedArray.push('<br>');
        } else if(code[i] === ' ') {
            formattedArray.push('&nbsp;') // this is preventing word-wrap. change to only when consecutive if a problem
        }else {
            formattedArray.push(code[i]);
        }
    }
    return formattedArray;
}