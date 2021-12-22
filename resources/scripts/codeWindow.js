const js = document.getElementById("js");
const py = document.getElementById("py");
const php = document.getElementById("php");
const java = document.getElementById("java");
const code = document.getElementById("code")

js.addEventListener("mouseover", writeCode);
py.addEventListener("mouseover", writeCode);
php.addEventListener("mouseover", writeCode);
java.addEventListener("mouseover", writeCode);

let timeouts = []; // stores references to timeouts so they can be cleared.

function writeCode(event) {
    clearCode();
    typeContent(event.target);
}

function clearCode() {
    for(let t in timeouts) clearTimeout(t);
    codeWindow.innerHTML = "";
}
/* this version works, albeit for some reason the whitespace formatting isn't coming through 
function typeContent(eventTarget) {
    const content = formatWhitespace(selectSnippet(eventTarget));
    content.forEach((l, i) => {//content.split('').forEach((l, i) => {
        let timeout = setTimeout(() => codeWindow.innerHTML += l, i * 20);
        timeouts.push(timeout);
    });
}
*/
function typeContent(eventTarget) {
    const content = selectSnippet(eventTarget);
    content.split('').forEach((l, i) => {
        let timeout = setTimeout(() => {
            if(l === '\n') l = '<br>';
            else if(l === ' ') l = '&nbsp;';
            codeWindow.innerHTML += l;
        }, i * 10);
        timeouts.push(timeout);
    });
}

function selectSnippet(eventTarget) {
    switch(eventTarget) {
        case js: return 0;
        case py: return pyCode;
        case php: return 0;
        case java: return 0;
    }  
}

const pyCode = 
`# Python:
# Deep clone a list
def deep_clone(list_in):
    if(type(list_in) == list):
        return [deep_clone(layer) for layer in list_in]
    else:
        return list_in
`;

/* This seems to leave the function ok but not received ok. Perhaps something to 
do with the asynchronous setTimeout that receives it?
function formatWhitespace(code) {
    console.log(code);
    let formatted = code.split('');
    formatted.forEach(c => {
        if(c === '\n') c = "<br>";
        else if(c === ' ') c = "&nbsp;";
    });
    return formatted;
}
*/

const pyCode2 = `<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background-color: rgb(40, 42, 54); color: rgb(248, 248, 242);"><span class="hljs-comment" style="color: rgb(98, 114, 164);"># Deep clone a list</span>
<span class="hljs-function"><span class="hljs-keyword" style="color: rgb(255, 121, 198); font-weight: 700;">def</span> <span class="hljs-title" style="color: rgb(241, 250, 140); font-weight: 700;">deep_clone</span><span class="hljs-params">(list_in)</span>:</span>
    <span class="hljs-keyword" style="color: rgb(139, 233, 253); font-weight: 700;">if</span>(type(list_in) == list):
        <span class="hljs-keyword" style="color: rgb(139, 233, 253); font-weight: 700;">return</span> [deep_clone(layer) <span class="hljs-keyword" style="color: rgb(139, 233, 253); font-weight: 700;">for</span> layer <span class="hljs-keyword" style="color: rgb(139, 233, 253); font-weight: 700;">in</span> list_in]
    <span class="hljs-keyword" style="color: rgb(139, 233, 253); font-weight: 700;">else</span>:
        <span class="hljs-keyword" style="color: rgb(139, 233, 253); font-weight: 700;">return</span> list_in
</pre>`;

function formatStyles(code) {
    let formatted = code.replace(/<pre[\w\W]+?>/, '').replace('</pre>', '');
    let twatted = formatted.replace(/<span[\w\W]+?>/g, '¬').replace(/<\/span>/g, '¬');
    return twatted;
}
codeWindow.innerHTML = formatStyles(pyCode2);
console.log(formatStyles(pyCode2));