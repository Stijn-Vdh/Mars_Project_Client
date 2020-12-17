"use strict";

let config;
let endpoints;

document.addEventListener("DOMContentLoaded", init);

function init() {
    Element.prototype.updateEventListener = function (event, cb) {
        this.removeEventListener(event, cb);
        this.addEventListener(event, cb);
    }
    setViewPortStatic();
    addPages();
    initNavigation();
    initAuthentication();
    podOrderInit();

    navigator.serviceWorker.register('/mars-15/service-worker.js', {
        scope: '/mars-15/'
    });
}

function initMain() {
    getEndpoints()
        .then(ep => {
            endpoints = ep;
            initSearchbar();
            initQuickAccess();
        });
    getTravelHistory()
        .then(history => {
            loadRecentTrips(history);
        });
    updateAccInfo();
    initMap();
}

function addPages() {
    addPage('main', [], {
        onOpen: initMain
    });
    addPage('#settings', ['#open-settings'], {onOpen: initSettings});
    addPage('#quick-access', [], {onOpen: openQuickAccess, onLeave: closeQuickAccess});
    addPage('#account-settings', ['li[data-open-setting="account-settings"]'], {onOpen: userInit});
    addPage('#friends-settings', ['li[data-open-setting="friends-settings"]'], {onOpen: initFriendSettings});
    addPage('#add-friend', ['.add-friend'], {onOpen: initAddFriend, dynamicData: true});
    addPage('#report', ['li[data-open-setting="report"]'], {onOpen: initReport});
    addPage('#pod-order-view', ['*[data-order-pod]'], {dynamicData: true, onOpen: payloadConsumer});
    addPage('#process-payment', ['*[data-order-pod]']);
    addPage('#authentication', []);
    addPage('#signin', ['#open-signin']);
    addPage('#signup', ['#open-signup'], {
        onOpen: () => {
            getEndpoints()
                .then(ep => {
                    endpoints = ep;
                    loadHomeEndpointList();
                })
        }
    });
    addPage('#subscription-settings', ['li[data-open-setting="subscription-settings"', '#edit-subscription', '#edit-subscription-quick'], {onOpen: initSubscription});
    addPage('#package-order-view', ['#send-package'], {onOpen: initPackage});
}

function setViewPortStatic() {
    const viewheight = window.screen.height,
        viewwidth = window.screen.width,
        viewport = document.querySelector("meta[name=viewport]");

    viewport.setAttribute("content", `height=${viewheight}, width=${viewwidth}, initial-scale=1.0`);
}

function loadRecentTrips(history) {
    let tripContainer = document.querySelector('#recent-trips > ul');
    tripContainer.innerHTML = "";

    if (history.length > 5){
        history = history.slice(-5);
    }

    history.reverse().forEach(route => {
        tripContainer.innerHTML += recentTrip(route);
    })
}

function loadDataInQuickAccess(userInfo) {
    document.querySelector('#quick-access header h3').innerHTML = userInfo.name;
    document.querySelector('#quick-access article#subscription-quick p').innerHTML = userInfo.subscription.name;
}

function payloadConsumer(payload) {
    const loc = document.querySelector('#select-location');
    const text = document.querySelector('#select-location-text');
    const from = payload.from;

    if (from) {
        loc.value = from.getAttribute('data-order-pod');
        text.value = from.querySelector('h2') ? from.querySelector('h2').innerHTML : from.innerHTML;
    } else {
        loc.value = payload.id;
        text.value = payload.name;
    }
}