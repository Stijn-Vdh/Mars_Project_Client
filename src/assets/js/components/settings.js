"use strict";

function initSettings() {
    getUserInfo()
        .then(response => {
            console.log(response);
            sessionStorage.setItem('user', JSON.stringify(response));

            loadDataIntoSettings(response);
        });
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