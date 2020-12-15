"use strict";

let notificationId = 0;

const CHNL_TO_SERVER = "events.to.server";
const EVENTBUS_PATH = "https://project-ii.ti.howest.be/mars-15/events";
const CHNL_TO_CLIENT_NOTIFICATION = "events.client.";
const domains = {
    pack: "PACKAGE_POD_RECEIVED",
    pod: "TRAVEL_POD_ARRIVAL",
    rec: "PACKAGE_POD_ARRIVAL"
};
let eb;

function initNotificationSocket() {
    eb = new EventBus(EVENTBUS_PATH);

    eb.onopen = function () {
        eb.registerHandler(CHNL_TO_CLIENT_NOTIFICATION + localStorage.getItem('token') + "." + domains.pack, onMessage);
        eb.registerHandler(CHNL_TO_CLIENT_NOTIFICATION + localStorage.getItem('token') + "." + domains.pod, onMessage);
        eb.registerHandler(CHNL_TO_CLIENT_NOTIFICATION + localStorage.getItem('token') + "." + domains.rec, onMessage);
    };
}

function onMessage(error, message) {
    const msg = `Your pod to ${message.body.id} has arrived`;
    if (document.hasFocus()) {
        notify(msg)
    } else {
        new Notification(msg);
    }
}

function checkNotificationPermissions() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission !== "denied") Notification.requestPermission();
}

function sendToServer(message) {
    eb.send(CHNL_TO_SERVER, message);
}

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