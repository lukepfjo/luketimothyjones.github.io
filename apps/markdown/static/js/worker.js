importScripts('showdown.js');
importScripts('filter-xss.js');

var md_converter = new showdown.Converter();
md_converter.setFlavor('github');
md_converter.setOption('tables', true);
md_converter.setOption('backslashEscapesHTMLTags', true);
md_converter.setOption('emoji', true);

const prettify_regex = /(<pre[^>]*>)?[\n\s]?<code([^>]*)>/gi;
function prettify(source) {
    return source.replace(prettify_regex,
        function (_, pre, codeClass) {
            if (pre) {
                return '<pre class="prettyprint linenums"><code' + codeClass + '>';
            } else {
                return ' <code class="prettyprint">';
            }
        }
    );
};

const event_listener_regex = /on\w+=".*"/;
onmessage = function(ev) {
    let bind_id = ev.data[0],
        mdown   = ev.data[1];

    let html = md_converter.makeHtml(mdown);
    html = filterXSS(html, {
        onIgnoreTag: (tag, html, options) => {
            // Parameters are the same with onTag
            // If a string is returned, the tag would be replaced with the string
            // If return nothing, the default measure would be taken (specifies using
            // escape, as described below)

            // Markdown uses checkboxes in its formatting
            if (tag === 'input' && html.indexOf('type="checkbox"') !== -1) {
                // Only permit if it does not have an event listener attached
                if (!event_listener_regex.test(html.toLowerCase())) {
                    return html;
                }
            }
        }
    });

    postMessage([bind_id, prettify(html)]);
    return;
};
