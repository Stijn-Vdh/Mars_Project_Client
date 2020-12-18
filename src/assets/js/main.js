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
            loadRecentTrips(history, "recent");
        });
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
    addPage('#package-order-view', ['#send-package']);
}

function setViewPortStatic() {
    const viewheight = window.screen.height,
        viewwidth = window.screen.width,
        viewport = document.querySelector("meta[name=viewport]");

    viewport.setAttribute("content", `height=${viewheight}, width=${viewwidth}, initial-scale=1.0`);
}

function loadRecentTrips(trips, type) {
    let tripContainer = document.querySelector('#trips > ul');
    tripContainer.innerHTML = "";

    if (type === "recent") {
        if (trips.length > 5) {
            trips = trips.slice(-5);
        }
        trips.reverse().forEach(route => {
            tripContainer.innerHTML += recentTrip(route);
        })
    } else {
        trips.reverse().forEach(route => {
            tripContainer.innerHTML += favouriteTrip(route);
        })
    }
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
    checkFavoured();
}

// put here all the functions that only can be executed once after the user has logged in!
function initLogin() {
    return updateAccInfo().finally(() => {
        initNotificationSocket();
        cacheSubscriptions();
        cacheTravelEndpoints()
            .finally(initMap);
        cachePackageEndpoints()
            .finally(initPackage);
        goTo('main');
    });
}
