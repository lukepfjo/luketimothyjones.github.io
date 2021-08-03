'use strict';

/* Block until Inter is loaded in */
(function() {
    const font = new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v3/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZ9hiA.woff2)');
    font.load();
    document.fonts.add(font);
}());

function set_url_bar_height() {
    const measure_elem = document.querySelector('#url-bar-measure');
    if (measure_elem === null) return;

    const url_bar_height = measure_elem.clientHeight - window.innerHeight;

    document.documentElement.style.setProperty('--url-bar-height', url_bar_height + 'px');
}

document.addEventListener('DOMContentLoaded', set_url_bar_height);
