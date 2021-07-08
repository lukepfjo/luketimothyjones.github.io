'use strict';

/* Block until Roboto is loaded in */
function load_roboto() {
    const font = new FontFace('Roboto Condensed', 'url(https://fonts.gstatic.com/s/robotocondensed/v19/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQ.woff2)');
    font.load();
    document.fonts.add(font);
} load_roboto();


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#footer-year').innerText = new Date().getFullYear();
   
    // Handle email link / display
    let get_in_touch_btn = document.querySelector('#get-in-touch button');
    get_in_touch_btn.addEventListener('click', () => {
        window.open('mailto:luke.pflibsen.jones@gmail.com', '_top');
    });
    get_in_touch_btn.addEventListener('mouseenter', () => {
        get_in_touch_btn.classList.toggle('email-visible');
    });

    // Handle animation of #position-roller on homepage
    (function() {
        const scroll_delay = 1600,
              scroll_positions = [0, 20, 60, 100, 140];

        let scroll_box = document.querySelector('#position-roller'),
            target_pos = 1;

        function do_scroll() {
            scroll_box.scroll({top: scroll_positions[target_pos], behavior: 'smooth'});
            target_pos = target_pos > 3 ? 0 : target_pos + 1;
            setTimeout(do_scroll, scroll_delay);
        }

        setTimeout(do_scroll, scroll_delay);
    }());
});
