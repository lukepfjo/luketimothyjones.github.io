function add_editor() {
    let container = document.querySelector('.content'),
        bind      = 0;
        
    document.querySelectorAll('.markdown-pair').forEach((elem) => {
        bind = Math.max(Number(elem.getAttribute('data-bind')), bind);
    });
    
    let new_elements = make_editor(String(bind + 1));
    let editor       = new_elements.querySelector('.editor'),
        tabs         = new_elements.querySelectorAll('.tab');
    
    container.appendChild(new_elements);
    handler = new KeybindHandler(editor, window.markdown_worker);
    window.keybind_handlers.push(handler);
    
    tabs[0].addEventListener('click', open_tab);     // Editor
    tabs[1].addEventListener('click', open_tab);     // Display
    tabs[2].addEventListener('click', createPicker); // Open
}

function switch_theme() {
    let s_elem = document.querySelector('#custom-theme');
    s_elem.disabled = !s_elem.disabled;
}

// ----
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('#add-editor').addEventListener('click', add_editor);
    document.querySelector('#switch-theme').addEventListener('click', switch_theme);
});
