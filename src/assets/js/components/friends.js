"use strict";

let friends = [];

function loadFriends(userInfo) {
    document.querySelector('#friendlist > ul').innerHTML = `
    <li>
        <button class="add add-friend">
            <ion-icon name="add-outline"></ion-icon>
        </button>
    </li>
    `;

    userInfo.friends.forEach(friend => {
        document.querySelector('#friendlist > ul').innerHTML += friendListItem(friend);
    })
}

function initFriendSettings() {
    const friendlist = document.querySelector('#friends-settings > ul');
    friendlist.innerHTML = '';
    accInfo.friends.forEach(friend => {
        friendlist.innerHTML += `<li>${friendSetting(friend)}</li>`;
        friendlist.querySelector('li:last-child button').addEventListener('click', removeFriend);
    });
}

function initAddFriend() {
    document.querySelectorAll('#copy-name, #own-name').forEach(el => el.updateEventListener('click', copyName));
    document.querySelector('#add-friend form').updateEventListener('submit', addFriend);
}

function copyName(e) {
    e.preventDefault();

    document.querySelector('#own-name').select();
    document.execCommand('copy');
    document.querySelector('#own-name').blur();

    notify('Copied your name to clipboard.');
}

function checkForFriendRequests(user) {
    if (user.potentialFriends.length > 0) {
        user.potentialFriends.forEach(friend => {
            mttsPrompt(`${friend} wants to be your friend.`, () => addFriend(friend), () => removeFriend(friend));
        })
    }
}