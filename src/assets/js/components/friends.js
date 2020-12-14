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

function initFriendSettings() {

}

function initAddFriend() {
    document.querySelectorAll('#copy-name, #own-name').forEach(el => el.updateEventListener('click', copyName));
}

function copyName(e) {
    e.preventDefault();

    document.querySelector('#own-name').select();
    document.execCommand('copy');
    document.querySelector('#own-name').blur();

    notify('Copied your name to clipboard.');
}