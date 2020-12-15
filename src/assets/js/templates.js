"use strict";

function recentTrip(route) {
    const minutes = Math.floor(route.estmTime / 60),
    seconds = route.estmTime % 60;

    return `
    <li data-order-pod="${route.destination.id}">
        <h2>${route.destination.name}</h2>
        <h3>Yesterday</h3>
        <div>
            <p class="from">${route.from.name}</p>
            <p class="to">${route.destination.name}</p>
            <p class="totalTravelTime">${minutes > 0 ? `${minutes}m `: ''}${seconds > 0 ? `${seconds}s`: ''}</p>
        </div>
    </li>
    `
}

function friendSetting(friend) {
    return `
    <ul>
        <li><div class="user-icon" data-user="${friend}"></div></li>
        <li>${friend}</li>
        <li><button data-remove-friend="${friend}"><ion-icon name="person-remove-outline"></ion-icon></button></li>
    </ul>
    `
}

function friendListItem(friend) {
    return `
    <li>
        <figure>
            <img src="${friend.icon}" alt="User Image">
            <figcaption>${friend.name}</figcaption>
        </figure>
    </li>
    `;
}