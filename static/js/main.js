'use strict';

/* Block until Inter is loaded in */
(function() {
    const font = new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v3/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZ9hiA.woff2)');
    font.load();
    document.fonts.add(font);
}());

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#footer-year').innerText = new Date().getFullYear();
   
    // Handle email link / display
    let get_in_touch_btn = document.querySelector('#get-in-touch button'),
        mail_addr        = atob('bHVrZUBtYWtlY29kZS5ydW4=');

    get_in_touch_btn.addEventListener('click', () => {
        window.open('mailto:' + mail_addr + '?subject=Connecting from your website', '_top');
    });
    
    function show_mail() {
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
                    mail_elem.setAttribute('data-err-msg', "Sorry, you'll need to copy it manually in this browser.");
                });
            });
        }
    }

    get_in_touch_btn.addEventListener('mouseenter', show_mail);
    get_in_touch_btn.addEventListener('focus', show_mail);

    // Handle animation of #position-roller on homepage
    (function() {
        const scroll_delay = 1600,
              scroll_positions = [0, 38, 76, 114, 152];

        let scroll_box = document.querySelector('#position-roller'),
            target_pos = 1;

        // Older browsers don't support elem.scroll() (namely Safari)
        // Smoothscroll handles it, but the function still needs to exist.
        if (typeof scroll_box.scroll === 'undefined') {
            scroll_box.scroll = function (_) { };
        }

        function do_scroll() {
            scroll_box.scroll({top: scroll_positions[target_pos], behavior: 'smooth'});
            target_pos = target_pos >= 4 ? 0 : target_pos + 1;
            setTimeout(do_scroll, scroll_delay);
        }

        setTimeout(do_scroll, scroll_delay);
    }());
});
