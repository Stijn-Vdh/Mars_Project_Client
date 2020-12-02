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
    // Temporary hack to allow local testing of the web client and server.
    // document.cookie = 'Authorization=Basic cHJvamVjdG1lZGV3ZXJrZXI6dmVya2VlcmQ=';
    // config = await loadConfig();
    // api = `${config.host ? config.host + '/': ''}${config.group ? config.group + '/' : ''}api/`;
    endpoints = getEndpoints();
    initQuickAccess();
    initSearchbar();
    initLogin();
    // initSettings();
    
    endpoints = getEndpoints();
    loadRecentTrips();
    friendsInit();
    userInit();

    podOrderInit();

    if (localStorage.getItem('token') === null) {
        goTo('#authentication');
    }

    navigator.serviceWorker.register('/mars-15/service-worker.js', {
        scope: '/mars-15/'
    });
    // navigator.serviceWorker.register('/service-worker.js', {
    //     scope: '/'
    // });
}

function addPages() {
    addPage('main', []);
    addPage('#settings', ['#open-settings']);
    addPage('#quick-access');
    addPage('#account-settings', ['li[data-open-setting="account-settings"]']);
    addPage('#report', ['li[data-open-setting="report"]']);
    addPage('#pod-order-view', ['*[data-order-pod]'], true);
    addPage('#process-payment', ['*[data-order-pod]']);
    addPage('#authentication', []);
    addPage('#signin', ['#open-signin']);
    addPage('#signup', ['#open-signup']);
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

function dragStart(e) {
    if (!dragInfo.started) {
        dragInfo.startPos = document.querySelector('#quick-access').offsetTop;
        document.querySelector('#quick-access').style.top = `${dragInfo.startPos}px`
    }
    dragInfo.started = true;
    dragInfo.prevPos = dragInfo.startPos;
}

function dragMove(e) {
    e.preventDefault();
    dragInfo.initialized = true;
    let curPos = e.clientY || e.touches[0].clientY;
    document.querySelector('#quick-access').style.transform = `translateY(${-(dragInfo.startPos - curPos)}px)`;
    dragInfo.prevPos = dragInfo.prevPos - (dragInfo.prevPos - curPos);
}

function dragEnd(e) {
    document.querySelector('#quick-access').style.transition = 'transform 0.3s ease-in-out';
    if (dragInfo.prevPos < dragInfo.startPos * .7 || !dragInfo.initialized) {
        document.querySelector('#quick-access').style.transform = `translateY(${0 - dragInfo.startPos}px)`;
    } else {
        document.querySelector('#quick-access').style.transform = `translateY(0)`;
    }
    dragInfo.initialized = false;
    setTimeout(() => {
        document.querySelector('#quick-access').style.transition = '';
    }, 400)
}

function loadRecentTrips() {
    const dummyData= [{
        routID: 1,
        from: "Home",
        destination: "Work",
        estmTime: 60,
    },{
        routID: 1,
        from: "Home",
        destination: "Store 6",
        estmTime: 30,
    },{
        routID: 1,
        from: "Home",
        destination: "Debby",
        estmTime: 75,
    }], 
    tripContainer = document.querySelector('#recent-trips > ul');

    tripContainer.innerHTML = "";
    dummyData.forEach(route => {
        tripContainer.innerHTML += recentTrip(route);
    })
}