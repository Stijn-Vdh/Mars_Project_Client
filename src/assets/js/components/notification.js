"use strict";

let notificationId = 0;
const notifications = {};

const CHNL_TO_SERVER = "events.to.server";
const EVENTBUS_PATH = "https://project-ii.ti.howest.be/mars-15/events";
const CHNL_TO_CLIENT_NOTIFICATION = "events.client.";
const domains = {
    pack: "PACKAGE_POD_RECEIVED",
    pod: "TRAVEL_POD_ARRIVAL",
    rec: "PACKAGE_POD_ARRIVAL",
    friend: "TRAVEL_TO_FRIEND",
    friend_req: 'FRIEND_REQUESTS'
};
let eb;

function initNotificationSocket() {
    eb = new EventBus(EVENTBUS_PATH);

    eb.onopen = function () {
        eb.registerHandler(CHNL_TO_CLIENT_NOTIFICATION + localStorage.getItem('token') + "." + domains.pack, packageReceived);
        eb.registerHandler(CHNL_TO_CLIENT_NOTIFICATION + localStorage.getItem('token') + "." + domains.pod, travelPodArrived);
        eb.registerHandler(CHNL_TO_CLIENT_NOTIFICATION + localStorage.getItem('token') + "." + domains.rec, packagePodArrived);
        eb.registerHandler(CHNL_TO_CLIENT_NOTIFICATION + localStorage.getItem('token') + "." + domains.friend, friendOnItsWay);
        eb.registerHandler(CHNL_TO_CLIENT_NOTIFICATION + localStorage.getItem('token') + "." + domains.friend_req, receivedFriendRequest);
    };
}

function packageReceived(error, message) {
    onMessage(`${message.body.sender} sent a package to you.`);
}

function receivedFriendRequest(error, message) {
    updateAccInfo()
        .finally(() => checkForFriendRequests(accInfo));
}

function travelPodArrived(error, message) {
    onMessage(`Your pod to ${message.body.id} has arrived.`);
    setTraveling();
}

function packagePodArrived(error, message) {
    onMessage(`Your package pod has arrived.`);
}

function friendOnItsWay(error, message) {
    onMessage(`${message.body.userTravelingToYou} is on it's way to you.`);
}

function onMessage(message) {
    if (document.hasFocus()) {
        notify(message)
    } else {
        new Notification(message);
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

    if (!notificationElement) return;

    notifications[`notification-${notificationId}`].accept = accept;
    notifications[`notification-${notificationId}`].deny = deny;

    promptAccept(notificationElement, accept);
    promptDeny(notificationElement, deny);
}

function promptAccept(el, accept) {
    el.querySelector('.accept').updateEventListener('click', (e) => {
        e.preventDefault();
        hideNotification(el.id.split('-')[1]);
        accept();
    });
}

function promptDeny(el, deny) {
    el.querySelector('.deny').updateEventListener('click', (e) => {
        e.preventDefault();
        hideNotification(el.id.split('-')[1]);
        deny();
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
    const notificationsElement = document.querySelector('#notifications');
    const icon = type === 'danger' ? 'alert': type === 'warn' ? 'help': 'checkmark';

    const buttons = `
    <button class="accept"><ion-icon name="checkmark-outline"></ion-icon></button>
    <button class="deny"><ion-icon name="close-outline"></ion-icon></button>
    `;
    let exists = false;

    notificationsElement.querySelectorAll('*[id^="notification-"] p').forEach(el => {
        if (el.innerHTML === message) exists = true;
    });

    if (exists) return false;

    notificationsElement.style.pointerEvents = 'all';
    notificationsElement.innerHTML += `
    <div id="notification-${thisId}" class="notification ${type}">
        ${type !== 'prompt' ? `<ion-icon name="${icon}-outline"></ion-icon>`: ''}
        <p>${message}</p>
        ${type === 'prompt' ? buttons: ''}
    </div>`;

    setTimeout(() => {
        document.querySelector(`#notification-${thisId}`).style.transform = 'translateX(0vw)';
    }, 100);

    Object.keys(notifications).forEach(k => {
        let notificationElement = document.querySelector(`#${k}`),
            notification = notifications[k];
        if (Object.keys(notification).includes('accept')) {
            promptAccept(notificationElement, notification.accept);
            promptDeny(notificationElement, notification.deny);
        }

        notificationElement.updateEventListener('click', removeNotification);
    });
    notifications[`notification-${thisId}`] = {};

    if (type !== 'prompt') {
        document.querySelector(`#notification-${thisId}`).updateEventListener('click', removeNotification);
        notifications[`notification-${thisId}`].timeOut = setTimeout(() => {
            hideNotification(thisId);
        }, 5000);
    } else {
        return thisId;
    }
}

function removeNotification(e) {
    if (e.target.closest('.accept') === null && e.target.closest('.deny') === null) {
        clearTimeout(notifications[e.currentTarget.id].timeOut);
        hideNotification(e.currentTarget.id.split('-')[1]);
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
    delete notifications[`notification-${id}`]
    document.querySelector(`#notification-${id}`).style.transform = 'translateX(-100vw)';
    setTimeout(() => {
        document.querySelector(`#notification-${id}`).remove();

        if (document.querySelector('#notifications').children.length === 0) {
            document.querySelector('#notifications').style.pointerEvents = 'none';
        }
    }, 300);
}