"use strict";

function initSearchbar() {
    document.querySelectorAll(".searchbar").forEach(el => loadSearchbar(el, travelEndpoints));
    document.querySelectorAll(".searchbar > input, .package-endpoint-selection > input").forEach(el => el.updateEventListener('focusin', toggleFocus));
    document.querySelectorAll(".searchbar > input, .package-endpoint-selection > input").forEach(el => el.updateEventListener('focusout', toggleFocus));
    document.querySelectorAll(".searchbar > input").forEach(el => el.updateEventListener('input',  (e) => loadSearchbar(e, travelEndpoints)));
    document.querySelector(".package-endpoint-selection > input").updateEventListener('input',  (e) => loadSearchbar(e, packageEndpoints));
}

function toggleFocus(e) {
    let wait = 0;
    if (e.target.parentNode.classList.contains("active")) {
        setTimeout(() => {
            e.target.parentNode.querySelector('ul').style.maxHeight = '0';
        }, 100);
        wait = 300;
    }
    setTimeout(() => {
        e.target.parentNode.classList.toggle('active');
        e.target.parentNode.querySelector('ul').style.maxHeight = '';
    }, wait);
}

function loadSearchbar(e, endpoints=travelEndpoints) {
    let sb, filter = "", favorites = [], friends = [];
    let endpointsToShow = [...endpoints];

    if (accInfo !== undefined && accInfo !== null) {
        favorites = accInfo.favouriteEndpoints.map(ep => ep.id);
        friends = accInfo.friends.map(friend => {return {id: friend.homeEndpoint, name: friend.displayName, username: friend.username}});
        endpointsToShow = [...endpointsToShow, ...friends];
    }

    if (e.currentTarget !== undefined) {
        sb = e.currentTarget.parentNode, filter = e.currentTarget.value;
    } else {
        sb = e;
    }

    if (filter !== "") {
        endpointsToShow = endpointsToShow.filter(endpoint => endpoint.name.toLowerCase().includes(filter.toLowerCase()) && endpoint.id !== -1);
    } else {
        endpointsToShow = endpointsToShow.filter(endpoint => endpoint.id !== -1);
    }


    endpointsToShow.sort((a, b) => {
        if (favorites.includes(a.id)) {
            if (favorites.includes(b.id)) {
                return alphabeticSort(a, b);
            }
            return -1;
        } else if (favorites.includes(b.id)) {
            return 1;
        } else if (Object.keys(a).includes('username')) {
            if (Object.keys(b).includes('username')) {
                return alphabeticSort(a, b);
            }
            return -1;
        } else if (Object.keys(b).includes('username')) {
            return 1;
        } else {
            return alphabeticSort(a, b);
        }
    });

    endpointsToShow = endpointsToShow.slice(0, 6);

    sb.querySelector('ul').innerHTML = "";
    endpointsToShow.forEach(endpoint => {
        sb.querySelector('ul').innerHTML += `<li ${neededDataObject(endpoint, e)}${Object.keys(endpoint).includes('username') ? `data-friend="${endpoint.username}"` : ''} id="sb-endpoint-${endpoint.id}"><h2>${endpoint.name}</h2>${favorites.includes(endpoint.id) ? '<ion-icon name="star"></ion-icon>': Object.keys(endpoint).includes('username') ? '<ion-icon name="person"></ion-icon>': ''}</li>`;
    });
}

function neededDataObject(endpoint, e) {
    if (e.classList !== undefined) {
        if (e.classList.contains('package-endpoint-selection')) {
            return `data-select-package-endpoint="${endpoint.id}"`;
        } else {
            return `data-order-pod="${endpoint.id}"`;
        }
    } else {
        if (e.currentTarget.parentNode.classList.contains('package-endpoint-selection')) {
            return `data-select-package-endpoint="${endpoint.id}"`;
        } else {
            return `data-order-pod="${endpoint.id}"`;
        }
    }
}

function alphabeticSort(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
}