const EDITOR_TEMPLATE = ({bind}) => `
    <div class="markdown-pair" data-bind="${bind}">
        <div class="editor-controls">
            <button class="tab enabled" data-target="editor">Editor</button>
            <button class="tab" data-target="display">Display</button>
            <button class="tab open-file" data-target="open">Open</button>
        </div>
        
        <textarea class="editor enabled" contenteditable="true"></textarea>
        <div class="display"></div>
    </div>
`;

function render_template(template, values, all_nodes=false, sep='\n') {
    let val_array = Array.isArray(values) ? values : [values],
        telem     = document.createElement('template');
    telem.innerHTML = val_array.map(template).join(sep);
    
    return all_nodes ? telem.content.childNodes : telem.content;
}

function make_editor(bind) {
    return render_template(EDITOR_TEMPLATE, {'bind': bind});
}

// ----
function open_tab(ev) {
    let tab         = ev.target,
        tab_target  = tab.getAttribute('data-target'),
        md_div      = tab.parentElement.parentElement,
        editor      = md_div.querySelector('.editor'),
        display     = md_div.querySelector('.display');
    
    let other_tab = tab_target == 'editor' ? md_div.querySelector('button[data-target="display"]') : md_div.querySelector('button[data-target="editor"]');
    
    [tab, other_tab, editor, display].forEach((elem) => {
        elem.classList.remove('enabled');
    });
    
    tab.classList.add('enabled');
    let new_window = tab_target == 'editor' ? editor : display;
    new_window.classList.add('enabled');
}

// ----
document.addEventListener("DOMContentLoaded", () => {
    // Covers all editors; future-proofing
    document.querySelectorAll('.tab:not(.open-file)').forEach((iter_elem) => {
        iter_elem.addEventListener('click', open_tab);
    });
    
    document.querySelectorAll('.tab.open-file').forEach((iter_elem) => {
        iter_elem.addEventListener('click', () => {
            createPicker(iter_elem.parentElement.parentElement.getAttribute('data-bind'));
        });
    });
});