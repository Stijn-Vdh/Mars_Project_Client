"use strict";

const notificationQueue = [];
let notificationShown = false;

function notify(message) {
    sendNotification('success', message);
}

function warn(message) {
    sendNotification('warning', message);
}

function error(message) {
    sendNotification('error', message);
}

function sendNotification(type, message) {
    notificationQueue.push([type, message]);
    checkQueue();
}

function checkQueue() {
    if (notificationQueue.length > 0 && !notificationShown) {
        const notification = notificationQueue.shift();
        document.querySelector('#notification p').innerHTML = notification[1];
        document.querySelector('#notification').classList.add(notification[0]);
        document.querySelector('#notification').classList.add('open');

        notificationShown = true;
        setTimeout(hideNotification, 5000);
    }
}

function hideNotification() {
    document.querySelector('#notification').classList.remove('open')
    notificationShown = false;
    setTimeout(() => {
        document.querySelector('#notification').className = '';
        setTimeout(checkQueue, 1000);
    }, 300);
}