/* Block until Roboto is loaded in */
function load_roboto() {
    const font = new FontFace('Roboto Condensed', 'url(https://fonts.gstatic.com/s/robotocondensed/v19/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQ.woff2)');
    font.load();
    document.fonts.add(font);
} load_roboto();

document.addEventListener('DOMContentLoaded', function() {
   document.querySelector('#footer-year').innerText = new Date().getFullYear();
   
   let get_in_touch_btn = document.querySelector('#get-in-touch button');
   get_in_touch_btn.addEventListener('click', () => {
       window.open('mailto:luke.pflibsen.jones@gmail.com', '_top');
   });
   get_in_touch_btn.addEventListener('mouseenter', () => {
       get_in_touch_btn.classList.toggle('email-visible');
   });
});
