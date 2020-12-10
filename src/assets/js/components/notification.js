"use strict";

let notificationId = 0;

function notify(message) {
    sendNotification('success', message);
}

function warn(message) {
    sendNotification('warn', message);
}

function error(message) {
    sendNotification('danger', message);
}

function sendNotification(type, message) {
    notificationId++;
    const thisId = notificationId;
    const icon = type === 'danger' ? 'alert': type === 'warn' ? 'help': 'checkmark';

    document.querySelector('#notifications').innerHTML += `
    <div id="notification-${thisId}" class="notification ${type}">
        <ion-icon name="${icon}-outline"></ion-icon>
        <p>${message}</p>
    </div>`;

    setTimeout(() => {
        document.querySelector(`#notification-${thisId}`).style.transform = 'translateX(0vw)';
    }, 100);

    setTimeout(() => {
        hideNotification(thisId);
    }, 5000)
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