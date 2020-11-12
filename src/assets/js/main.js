let config;
let api;
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
    loadRecentTrips();
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