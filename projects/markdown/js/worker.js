importScripts('showdown.js');

var md_converter = new showdown.Converter();

md_converter.setFlavor('github');
md_converter.setOption('tables', true);
md_converter.setOption('backslashEscapesHTMLTags', true);
md_converter.setOption('emoji', true);

function prettify(source) {
    return source.replace(/(<pre[^>]*>)?[\n\s]?<code([^>]*)>/gi,
        function (match, pre, codeClass) {
            if (pre) {
                return '<pre class="prettyprint linenums"><code' + codeClass + '>';
        
            } else {
                return ' <code class="prettyprint">';
            }
        }
    );
};

onmessage = function(ev) {
    let bind_id = ev.data[0],
        mdown   = ev.data[1];
    
    let html = md_converter.makeHtml(mdown);
    postMessage([bind_id, prettify(html)]);
    return;
};
