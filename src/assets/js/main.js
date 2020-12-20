"use strict";

let endpoints;
let wasOffline = false;

document.addEventListener("DOMContentLoaded", init);

function init() {
    Element.prototype.updateEventListener = function (event, cb) {
        this.removeEventListener(event, cb);
        this.addEventListener(event, cb);
    }

    if (!navigator.onLine) {
        return checkOnline();
    }

    checkOnline();

    setViewPortStatic();
    addPages();
    initNavigation();
    initAuthentication();
    podOrderInit();

    navigator.serviceWorker.register('/mars-15/service-worker.js', {
        scope: '/mars-15/'
    });

    initLogin()
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

    updatePoints();
}

function checkOnline() {
    if (!wasOffline && navigator.onLine) {
        setTimeout(() => {
            checkOnline();
        }, 3000);
    } else if (navigator.onLine) {
        notify('Back online!')
        setTimeout(() => {
            location.reload();
        },1000);
    } else {
        error("You are currently offline. You need to be online to continue using the app.");
        wasOffline = true;
        setTimeout(() => {
            checkOnline();
        }, 3000);
    }
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
    addPage('#package-order-view', ['#send-package'], {onOpen: () => {
        document.querySelector('#p-location').value = currentLocationEndpointId;
        document.querySelector('#p-from').value = travelEndpoints.find(ep => ep.id === currentLocationEndpointId).name;
    }});
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
        if (from.hasAttribute('data-friend')) {
            document.querySelector('#select-travel-location').setAttribute('data-friend', from.getAttribute('data-friend'));
        }

        loc.value = from.getAttribute('data-order-pod');
        text.value = from.querySelector('h2') ? from.querySelector('h2').innerHTML : from.innerHTML;
    } else {
        
        if (payload.friend) {
            document.querySelector('#select-travel-location').setAttribute('data-friend', payload.friend);
        }

        loc.value = payload.id;
        text.value = payload.name;
    }
    checkFavoured();

    document.querySelector('#discount').setAttribute('max', Math.min(Math.floor(points / 100) * 100, 200));
}

// put here all the functions that only can be executed once after the user has logged in!
function initLogin() {
    return updateAccInfo().then(() => {
        initNotificationSocket();
        cacheSubscriptions();
        cacheTravelEndpoints()
            .then(initMap)
            .then(initSearchbar)
            .then(initQuickAccess);
        cachePackageEndpoints()
            .then(initPackage);
        goTo('main');
    });
}
