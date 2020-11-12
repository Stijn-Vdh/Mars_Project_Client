"use strict";

function recentTrip(route) {
    const minutes = Math.floor(route.estmTime / 60),
    seconds = route.estmTime % 60;

    return `
    <li>
        <h2>${route.destination}</h2>
        <h3>Yesterday</h3>
        <div>
            <p class="from">${route.from}</p>
            <p class="to">${route.destination}</p>
            <p class="totalTravelTime">${minutes > 0 ? `${minutes}m `: ''}${seconds > 0 ? `${seconds}s`: ''}</p>
        </div>
    </li>
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