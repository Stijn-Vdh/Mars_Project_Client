"use strict";


function recentTrip(route) {
    const minutes = Math.floor(route.estmTime / 60),
    seconds = route.estmTime % 60;
    let ordered_on = new Date(route.dateTime);
    let timeAgo = Math.round((new Date().getTime() - ordered_on.getTime()) / 1000);
    const minute = 60, hour = minute * 60, day = hour * 24, month = day * 30, year = 31556926;
    timeAgo = timeAgo < 30 ? 'Just now': timeAgo < minute ? `${timeAgo} seconds ago` : timeAgo < hour ? `${Math.round(timeAgo / minute)} minutes ago` : timeAgo < day ? `${Math.round(timeAgo / hour)} hours ago`: timeAgo < month ? `${Math.round(timeAgo / day)} days ago`: timeAgo < year ? `${Math.round(timeAgo / month)} months ago`: `${Math.round(timeAgo / year)} years ago`

    

    return `
    <li data-order-pod="${route.destination.id}">
        <h2>${route.destination.name}</h2>
        <h3>${timeAgo}</h3>
        <div>
            <p class="from">${route.from.name}</p>
            <p class="to">${route.destination.name}</p>
            <p class="totalTravelTime">${minutes > 0 ? `${minutes}m `: ''}${seconds > 0 ? `${seconds}s`: ''}</p>
        </div>
    </li>
    `
}

function favouriteTrip(route){
    return `
    <li data-order-pod="${route.id}">
        <h2>${route.name}</h2>
        <div>
            <p class="from">id : ${route.id}</p>
        </div>
    </li>
    `
}

function friendSetting(friend) {
    return `
    <ul>
        <li>${generateUserIcon(friend.displayName)}</li>
        <li>${friend.displayName}</li>
        <li><button data-remove-friend="${friend.username}"><ion-icon name="person-remove-outline"></ion-icon></button></li>
    </ul>
    `
}

function friendListItem(friend) {
    return `
    <li ${friend.homeEndpoint !== -1 ? `data-order-friend-pod="${friend.homeEndpoint}"`: ''} data-friend="${friend.username}">
        ${generateUserIcon(friend.displayName)}
        <p>${friend.displayName}</p>
    </li>
    `;
}