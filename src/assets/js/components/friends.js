"use strict";

let friends = [];

function friendsInit() {
    loadFriends();
}

function loadFriends() {
    friends = getFriends();

    document.querySelector('#friendlist > ul').innerHTML = `
    <li>
        <button class="add">
            <ion-icon name="add-outline"></ion-icon>
        </button>
    </li>
    `;

    friends.forEach(friend => {
        document.querySelector('#friendlist > ul').innerHTML += friendListItem(friend);
    })
}