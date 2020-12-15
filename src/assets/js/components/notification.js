"use strict";

let notificationId = 0;

function notify(message) {
    sendNotification('success', message);
}

function mttsPrompt(message, accept, deny) {
    const notificationId = sendNotification('prompt', message),
        notificationElement = document.querySelector(`#notification-${notificationId}`);

    notificationElement.querySelector('.accept').updateEventListener('click', (e) => {
        e.preventDefault();
        accept();
        notificationElement.remove();
    });
    notificationElement.querySelector('.deny').updateEventListener('click', (e) => {
        e.preventDefault();
        deny();
        notificationElement.remove();
    });
}

function warn(message) {
    sendNotification('warn', message);
}

function error(message) {
    sendNotification('danger', message);
}

function sendNotification(type, message, isPrompt=false) {
    notificationId++;
    const thisId = notificationId;
    const icon = type === 'danger' ? 'alert': type === 'warn' ? 'help': 'checkmark';

    const buttons = `
    <button class="accept"><ion-icon name="checkmark-outline"></ion-icon></button>
    <button class="deny"><ion-icon name="close-outline"></ion-icon></button>
    `

    document.querySelector('#notifications').innerHTML += `
    <div id="notification-${thisId}" class="notification ${type}">
        ${type !== 'prompt' ? `<ion-icon name="${icon}-outline"></ion-icon>`: ''}
        <p>${message}</p>
        ${type === 'prompt' ? buttons: ''}
    </div>`;

    setTimeout(() => {
        document.querySelector(`#notification-${thisId}`).style.transform = 'translateX(0vw)';
    }, 100);

    if (type !== 'prompt') {
        setTimeout(() => {
            hideNotification(thisId);
        }, 5000)
    } else {
        return thisId;
    }
}

// function checkQueue() {

//     if (notificationQueue.length > 0 && !notificationShown) {
//         const notification = notificationQueue.shift();
//         document.querySelector('#main-notification p').innerHTML = notification[1];
//         document.querySelector('#main-notification').classList.add(notification[0]);
//         document.querySelector('#main-notification').classList.add('open');

//         notificationShown = true;
//         setTimeout(hideNotification, 5000);
//     }
// }

function hideNotification(id) {
    document.querySelector(`#notification-${id}`).style.transform = 'translateX(-100vw)';
    setTimeout(() => {
        document.querySelector(`#notification-${id}`).remove();
    }, 300);
}