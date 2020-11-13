"use strict";

let config;
let api;
let endpoints;
let dragStarted = false;
let dragInitialized = false;
let dragInfo = {
    started: false,
    initialized: false,
    startPos: null,
    prevPos: null
};
const h1Element = document.querySelector("h1");

document.addEventListener("DOMContentLoaded", init);

async function init() {
    setViewPortStatic();
    // Temporary hack to allow local testing of the web client and server.
    // document.cookie = 'Authorization=Basic cHJvamVjdG1lZGV3ZXJrZXI6dmVya2VlcmQ=';
    // config = await loadConfig();
    // api = `${config.host ? config.host + '/': ''}${config.group ? config.group + '/' : ''}api/`;
    document.querySelectorAll('.close-modal').forEach(el => el.addEventListener('click', closeModal));

    document.querySelector('#quick-access > header').addEventListener('touchstart', dragStart);
    document.querySelector('#quick-access > header').addEventListener('touchmove', dragMove, {passive: true});
    document.querySelector('#quick-access > header').addEventListener('touchend', dragEnd);

    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('focusin', toggleFocus));
    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('focusout', toggleFocus));
    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('input', (e) => loadSearchbar(e.currentTarget.parentNode, e.currentTarget.value)));
    endpoints = getEndpoints();
    loadRecentTrips();
    document.querySelectorAll(".searchbar").forEach(el => loadSearchbar(el));
    friendsInit();
    userInit();

    navigator.serviceWorker.register('/mars-15/service-worker.js', {
        scope: '/mars-15/'
    });
    // navigator.serviceWorker.register('/service-worker.js', {
    //     scope: '/'
    // });
}

function closeModal(e) {
    e.preventDefault();

    e.currentTarget.parentNode.classList.remove('active');
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
    dragInfo.initialized = true;
    let curPos = e.clientY || e.touches[0].clientY;
    document.querySelector('#quick-access').style.top = `${dragInfo.prevPos - (dragInfo.prevPos - curPos)}px`;
    dragInfo.prevPos = document.querySelector('#quick-access').offsetTop;
}

function dragEnd(e) {
    document.querySelector('#quick-access').style.transition = 'top 0.3s ease-in-out';
    if (dragInfo.prevPos < dragInfo.startPos * .7 || !dragInfo.initialized) {
        document.querySelector('#quick-access').style.top = '0px';
    } else {
        document.querySelector('#quick-access').style.top = `${dragInfo.startPos}px`;
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

function toggleFocus(e) {
    let wait = 0;
    if (e.target.parentNode.classList.contains("active")) {
        e.target.parentNode.querySelector('ul').style.height = '0';
        wait = 300;
    }
    setTimeout(() => {
        e.target.parentNode.classList.toggle('active');
        e.target.parentNode.querySelector('ul').style.height = '';
    }, wait)
}

function loadSearchbar(sb, filter = "") {
    let endpointsToShow = [...endpoints];

    console.log(filter);

    if (filter !== "") {
        endpointsToShow = endpointsToShow.filter(endpoint => endpoint.available && endpoint.name.toLowerCase().includes(filter.toLowerCase()));
    }
    endpointsToShow = endpointsToShow.slice(0, 6);

    sb.querySelector('ul').innerHTML = "";
    endpointsToShow.forEach(endpoint => {
        sb.querySelector('ul').innerHTML += `<li id="sb-endpoint-${endpoint.id}">${endpoint.name}</li>`;
    })
}