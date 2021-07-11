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
    let get_in_touch_btn = document.querySelector('#get-in-touch button'),
        mail_addr        = atob('bHVrZS50aW1vdGh5LmpvbmVzQGdtYWlsLmNvbQ==');

    get_in_touch_btn.addEventListener('click', () => {
        window.open('mailto:' + mail_addr + '?subject=Connecting from your website', '_top');
    });

    get_in_touch_btn.addEventListener('mouseenter', () => {
        if (!document.querySelector('#get-in-touch span')) {
            let mail_elem = document.createElement('span'),
                copy_elem = document.createElement('img');

            copy_elem.src = '/static/img/copy.svg';
            mail_elem.innerText = mail_addr;
            mail_elem.appendChild(copy_elem);
            document.querySelector('#get-in-touch').appendChild(mail_elem);

            copy_elem.addEventListener('click', () => {
                let source_elem = document.querySelector('#get-in-touch span');
                navigator.clipboard.writeText(mail_addr).then(() => {
                    copy_elem.src = '/static/img/check-mark.svg';
                }, () => {
                    // Copy failed -- fail silently?
                });
            });
        }
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
