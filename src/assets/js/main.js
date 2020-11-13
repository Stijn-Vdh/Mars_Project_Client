"use strict";

let config;
let api;
let endpoints;
const h1Element = document.querySelector("h1");

document.addEventListener("DOMContentLoaded", init);

async function init() {
    // Temporary hack to allow local testing of the web client and server.
    // document.cookie = 'Authorization=Basic cHJvamVjdG1lZGV3ZXJrZXI6dmVya2VlcmQ=';
    // config = await loadConfig();
    // api = `${config.host ? config.host + '/': ''}${config.group ? config.group + '/' : ''}api/`;

    document.querySelector('#quick-access').addEventListener('click', openQuickAccess);
    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('focusin', toggleFocus));
    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('focusout', toggleFocus));
    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('input', (e) => loadSearchbar(e.currentTarget.parentNode, e.currentTarget.value)));
    endpoints = getEndpoints();
    loadRecentTrips();
    document.querySelectorAll(".searchbar").forEach(el => loadSearchbar(el));
    friendsInit();
    userInit();

    navigator.serviceWorker.register('/mars-15/service-worker.js', {
        scope: '/mars-15'
    });
}

async function loadConfig() {
    const response = await fetch("config.json");
    return response.json();
}

function openQuickAccess(e) {
    e.preventDefault();

    document.querySelector('#quick-access').classList.add('active');
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