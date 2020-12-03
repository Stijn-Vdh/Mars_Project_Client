"use strict";

let config;
let endpoints;
let dragStarted = false;
let dragInitialized = false;
let dragInfo = {
    started: false,
    initialized: false,
    startPos: null,
    prevPos: null
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
    setViewPortStatic();
    addPages();
    initNavigation();
    initAuthentication();
    // Temporary hack to allow local testing of the web client and server.
    // document.cookie = 'Authorization=Basic cHJvamVjdG1lZGV3ZXJrZXI6dmVya2VlcmQ=';
    // config = await loadConfig();
    // api = `${config.host ? config.host + '/': ''}${config.group ? config.group + '/' : ''}api/`;
    // initSettings();

    podOrderInit();

    navigator.serviceWorker.register('/mars-15/service-worker.js', {
        scope: '/mars-15/'
    });
    // navigator.serviceWorker.register('/service-worker.js', {
    //     scope: '/'
    // });
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
    
    friendsInit();
    userInit();
}

function addPages() {
    addPage('main', [], {
        onOpen: initMain
    });
    addPage('#settings', ['#open-settings']);
    addPage('#quick-access');
    addPage('#account-settings', ['li[data-open-setting="account-settings"]']);
    addPage('#report', ['li[data-open-setting="report"]']);
    addPage('#pod-order-view', ['*[data-order-pod]'], {dynamicData: true});
    addPage('#process-payment', ['*[data-order-pod]']);
    addPage('#authentication', []);
    addPage('#signin', ['#open-signin']);
    addPage('#signup', ['#open-signup'], {onOpen: () => {
        getEndpoints()
            .then(ep => {
                endpoints = ep;
                loadHomeEndpointList();
            })
    }});
}

function closeModal(e) {
    e.preventDefault();

    e.currentTarget.parentNode.parentNode.classList.remove('active');
}

function setViewPortStatic() {
    const viewheight = window.screen.height,
    viewwidth = window.screen.width,
    viewport = document.querySelector("meta[name=viewport]");

    viewport.setAttribute("content", `height=${viewheight}px, width=${viewwidth}px, initial-scale=1.0`);
}

async function loadConfig() {
    const response = await fetch("config.json");
    return response.json();
}

function loadRecentTrips(history) {
    let tripContainer = document.querySelector('#recent-trips > ul');

    tripContainer.innerHTML = "";
    history.forEach(route => {
        tripContainer.innerHTML += recentTrip(route);
    })
}