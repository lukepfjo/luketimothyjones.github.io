function _contains(haystack, needle) {
    // indexOf that can handle universal newlines
    return (needle in ['\n', '\r\n']) ? (/\r?\n/).exec(haystack) !== null : haystack.indexOf(needle) !== -1;
}

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
        
        let bind_id  = elem.parentElement.parentElement.getAttribute('data-bind'),
            markdown = elem.value;
        
        if (this._timeout !== -1) {
            clearTimeout(this._timeout);
        }
        
        this._timeout = setTimeout((bind_id, markdown) => {
            window.markdown_worker.postMessage([bind_id, markdown]);
        }, 200, bind_id, markdown);
    }
    
    // --
    tab(evt) {
        let elem = this._elem,
            prev_cursor = elem.selectionStart + 0,
            new_cursor_offset = 0;

        if (evt.getModifierState('Shift')) {
            let before    = elem.value.substr(0, prev_cursor);
            let tab_start = rfind('    ', before, '\n');

            if (tab_start !== -1) {
                elem.selectionStart = tab_start;
                elem.selectionEnd   = tab_start + 4;

                document.execCommand('delete');
                new_cursor_offset = -4;
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
function handle_file_drop(event) {
    event.preventDefault();
    
    let editor = event.target,
        markdown_pair = editor.parentElement.parentElement;
    
    if (event.dataTransfer.items) {
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === 'file') {
                let file = event.dataTransfer.items[i].getAsFile();

                file.text()
                    .then((data) => {
                        editor.value = data;
                        markdown_pair.querySelector('.file-name').innerText = file.name;
                        window.markdown_worker.postMessage([markdown_pair.getAttribute('data-bind'), data]);
                    }
                );
            }
        }

    } else {
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
            let file = event.dataTransfer.files[i];

            file.text()
                .then((data) => {
                    editor.value = data;
                    markdown_pair.querySelector('.file-name').innerHTML = file.name;
                    window.markdown_worker.postMessage([markdown_pair.getAttribute('data-bind'), data]);
                }
            );
        }
    }
}

function add_editor() {
    let container = document.querySelector('.content'),
        bind      = 0;

    document.querySelectorAll('.markdown-pair').forEach((elem) => {
        bind = Math.max(Number(elem.getAttribute('data-bind')), bind);
    });

    const new_elements = make_editor(String(bind + 1)),
          editor       = new_elements.querySelector('.editor'),
          open_tab     = new_elements.querySelectorAll('.tab');

    container.appendChild(new_elements);
    open_tab.addEventListener('click', createPicker);
    handler = new KeybindHandler(editor, window.markdown_worker);
    window.keybind_handlers.push(handler);
}

function switch_theme() {
    let s_elem = document.querySelector('#custom-theme');
    s_elem.disabled = !s_elem.disabled;
}

// ----
document.addEventListener('DOMContentLoaded', function() {
    window.markdown_worker = new Worker('static/js/worker.js');
    
    window.markdown_worker.onmessage = function(ev) {
        let bind_id = ev.data[0],
            html    = ev.data[1],
            md_div  = document.querySelector('div[data-bind="' + bind_id + '"] .display');

        md_div.innerHTML = html;
        PR.prettyPrint();
    };

    // Make sure handlers are never garbage collected
    window.keybind_handlers = [];

    document.querySelectorAll('textarea.editor').forEach((iter_elem) => {
        handler = new KeybindHandler(iter_elem);
        window.keybind_handlers.push(handler);
        iter_elem.addEventListener('drop', handle_file_drop);
    });

    document.querySelector('#add-editor').addEventListener('click', add_editor);
    document.querySelector('#switch-theme').addEventListener('click', switch_theme);
});
