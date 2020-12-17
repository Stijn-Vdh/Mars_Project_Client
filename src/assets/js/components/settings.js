"use strict";

function initSettings() {
    loadDataIntoSettings(accInfo);
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