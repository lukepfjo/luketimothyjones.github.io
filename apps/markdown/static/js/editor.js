const EDITOR_TEMPLATE = ({bind}) => `
    <div class="markdown-pair" data-bind="${bind}">
        <div class="editor-controls">
            <span class="file-name"></span>
            <button class="tab open-file" data-target="open">Open</button>
        </div>
        
        <div class="split-screen-container">
            <textarea class="editor" contenteditable="true" placeholder="Type some Markdown or drop a file here"></textarea>
            <div class="display"></div>
        </div>
    </div>
`;

function render_template(template, values, all_nodes=false, sep='\n') {
    const val_array = Array.isArray(values) ? values : [values],
          telem     = document.createElement('template');
    telem.innerHTML = val_array.map(template).join(sep);

    return all_nodes ? telem.content.childNodes : telem.content;
}

function make_editor(bind) {
    return render_template(EDITOR_TEMPLATE, {'bind': bind});
}

// ----
function get_editor(bind) {
    return document.querySelector('.markdown-pair[data-bind="' + bind + '"]');
}

function switch_editor(ev) {
    const tab           = ev.target,
          tab_target    = tab.getAttribute('data-bind'),
          target_editor = get_editor(tab_target),
          open_tab      = document.querySelector('#file-tabs .file-tab.selected'),
          open_editor   = document.querySelector('.markdown-pair.enabled');

    if (open_tab !== null) open_tab.classList.remove('selected');
    if (open_editor !== null) open_editor.classList.remove('enabled');
    tab.classList.add('enabled');
    target_editor.classList.add('enabled');
}

function save_contents(bind) {
    const editor = get_editor(bind),
          editor_content = editor.querySelector('.editor').value,
          filename = editor.querySelector('.file-name').innerText || 'file.txt',
          a = document.createElement('a');

    a.href= URL.createObjectURL(new Blob([editor_content], {type: 'text/plain'}));
    a.download = filename;
    a.click();

	URL.revokeObjectURL(a.href);
}

// ----
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('#file-tabs .file-tab').forEach((iter_elem) => {
        iter_elem.addEventListener('click', switch_editor);
    });

    document.querySelectorAll('.tab.open-file').forEach((iter_elem) => {
        iter_elem.addEventListener('click', () => {
            createPicker(iter_elem.parentElement.parentElement.getAttribute('data-bind'));
        });
    });

    document.querySelectorAll('.tab.save-file').forEach((iter_elem) => {
        iter_elem.addEventListener('click', () => {
            save_contents(iter_elem.parentElement.parentElement.getAttribute('data-bind'));
        });
    });
});
