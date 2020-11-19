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
            +
        </button>
    </li>
    `;

    friends.forEach(friend => {
        document.querySelector('#friendlist > ul').innerHTML += friendListItem(friend);
    })
}