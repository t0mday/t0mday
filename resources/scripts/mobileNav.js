/* This script toggles the .show class within the nav classList when a user
clicks the mobNavButton. This allows the CSS rules for the .show class to be 
applied or not, dependent on toggle state. */

document.addEventListener('DOMContentLoaded', changeNav);

function changeNav() {
    const mobNavButton = document.querySelector('.mobNavButton');
    const nav = document.querySelector('nav');
    const links = document.querySelectorAll('.nav-links li');

    // Toggles .show class on nav
    const toggleShow = () => nav.classList.toggle('show');

    // Removes .show class if it exists
    const hide = () => nav.classList.remove('show');

    // Allows clicking on the mobNavButton to toggle .show class
    mobNavButton.addEventListener('click', toggleShow);

    // Allows clicking on any nav link to remove .show class
    // This prevents a resized window from potentially showing the menu before it is required
    links.forEach(link => link.addEventListener('click', hide));
}


