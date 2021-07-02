function _contains(haystack, needle) {
    // indexOf that can handle universal newlines
    return (needle in ['\n', '\r\n']) ? (/\r?\n/).exec(haystack) !== null : haystack.indexOf(needle) !== -1;
}

// ----
function rfind(needle, haystack, boundary='') {
    let curpos = haystack.length - 1,
        sofar   = '',
        result  = -1;

    while (curpos > -1 && !(boundary !== '' && _contains(sofar, boundary))) {
        // Remove overflow from sofar
        if (sofar.length === needle.length) {
            sofar = sofar.slice(0, -1);
        }
        sofar = haystack[curpos] + sofar;

        // These are the droids we are looking for
        if (_contains(sofar, needle)) {
            result = curpos;
            break;
        }
        
        curpos -= 1;
    }
    
    // End of string or hit boundary
    return result;
}

// ----
class KeybindHandler {
    
    constructor(elem) {
        this._elem = elem;
        this._timeout = -1;
        this._init_keybinds();
        this._init_display();
    }
    
    // -
    _init_keybinds() {
        this._bind_keydown();
        this._bind_keyup();
    }
    
    // -
    _init_display() {
        this._set_timeout(this._elem);
    }
    
    // --
    _bind_keydown() {
        this._elem.addEventListener('keydown', (evt) => {
            switch (evt.key) {
                case 'Tab':
                    this.tab(evt);
                    evt.preventDefault(); 
            }
        });
    }
    
    // --
    _bind_keyup() {
        this._elem.addEventListener('keyup', (evt) => {
            this._set_timeout(this._elem);
        });
    }
    
    // --
    _set_timeout(elem) {
        // Wait for user to stop typing to turn markdown into HTML
        
        let bind_id  = elem.parentElement.getAttribute('data-bind'),
            markdown = elem.value;
        
        if (this._timeout !== -1) {
            clearTimeout(this._timeout);
        }
        
        this._timeout = setTimeout(
            (bind_id, markdown) => {
                window.markdown_worker.postMessage([bind_id, markdown]);
            },
            200, bind_id, elem.value
        );
    }
    
    // --
    tab(evt) {
        let elem = this._elem,
            prev_cursor       = elem.selectionStart + 0,
            new_cursor_offset = 0;
        
        if (evt.getModifierState('Shift')) {
            let before    = elem.value.substr(0, prev_cursor);
            let tab_start = rfind('    ', before, '\n');
            
            if (tab_start !== -1) {
                elem.selectionStart = tab_start;
                elem.selectionEnd   = tab_start + 4;
                
                document.execCommand('delete');
            }

        } else {
            document.execCommand('insertText', false, '    ');
            new_cursor_offset = 4;
        }
        
        elem.selectionStart = prev_cursor + new_cursor_offset;
        elem.selectionEnd   = prev_cursor + new_cursor_offset;
    }
    
    s(evt) {
        if (evt.getModifierState('Control')) {
            // TODO: save data here
        }
    }
};

// ----
function replaceAll(str, search, replacement, i=true) {
    let res = str.replace(new RegExp(search, 'g' + (i ? 'i' : '')), replacement);
    return res ? res : str;
};

// ----
function purify_html(html) {
    let out = html,
        getter = new RegExp('<(?![! \/]*(p|pre|ol|li|code|span|a|h[0-9]|b)).*\/?>', 'gi');

    out = replaceAll(out, '\\[1]', '<pre class="safe">&bsol;</pre>');
    
    while ((matches = getter.exec(out)) !== null) {
        fixed = replaceAll(matches[0], '<', '&lt;'); //
        fixed = replaceAll(fixed, '>', '&gt;'); //
        out = out.replace(matches[0], fixed);
    }
    
    // out = replaceAll(out, '&lt;/p&gt;</p>', '</p>');
    
    // Replace &lt;/p&gt;</p> with </p> at end of each p tag
    return out;
}

// ----
document.addEventListener("DOMContentLoaded", function() {
    window.markdown_worker = new Worker('js/worker.js?v=nocache');
    
    window.markdown_worker.onmessage = function(ev) {
        let bind_id = ev.data[0],
            html    = ev.data[1],
            md_div  = document.querySelector('div[data-bind="' + bind_id + '"] .display');
        
        md_div.innerHTML = filterXSS(html);
        PR.prettyPrint();
    };
    
    // ----
    // Make sure handlers are never garbage collected
    window.keybind_handlers = [];
    
    document.querySelectorAll('textarea.editor').forEach((iter_elem) => {
       handler = new KeybindHandler(iter_elem);
       window.keybind_handlers.push(handler);
    });
});
