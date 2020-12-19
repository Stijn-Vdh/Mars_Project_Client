"use strict";

let pointsTimeout = null;

function initSettings() {
    loadDataIntoSettings(accInfo);
    document.querySelector('#points-button').updateEventListener('click', togglePoints);
}

function togglePoints(e) {
    const el = e.currentTarget.parentNode.querySelector('p');
    
    el.classList.toggle('active');
    if (pointsTimeout === null) {
        pointsTimeout = setTimeout(() => {
            el.classList.remove('active');
            pointsTimeout = null;
        }, 3000);
    } else {
        clearTimeout(pointsTimeout);
    }
    
}

function loadDataIntoSettings(user) {
    const settings = document.querySelector('#settings');

    settings.querySelector('header h2').innerHTML = user.displayName;
    settings.querySelector('header .user-icon-wrapper').innerHTML = `
        ${generateUserIcon(user)}
        <h3>
            ${user.subscription.name}
        </h3>
    `;
}