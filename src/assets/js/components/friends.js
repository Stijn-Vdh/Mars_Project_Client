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
    });

    document.querySelectorAll('#friendlist > ul *[data-order-friend-pod]').forEach(el => el.updateEventListener('click', customOrder))
}

function customOrder(e) {
    e.preventDefault();

    goTo('#pod-order-view', {
        id: e.currentTarget.getAttribute('data-order-friend-pod'),
        name: e.currentTarget.querySelector('p').innerHTML,
        friend: e.currentTarget.getAttribute('data-friend')
    });
}

function initFriendSettings() {
    const friendlist = document.querySelector('#friends-settings > ul');
    friendlist.innerHTML = '';
    accInfo.friends.forEach(friend => {
        friendlist.innerHTML += `<li>${friendSetting(friend)}</li>`;
    });

    friendlist.querySelectorAll('li button').forEach(el => el.updateEventListener('click', removeFriend));
}

function initAddFriend() {
    document.querySelectorAll('#copy-name, #own-name').forEach(el => el.updateEventListener('click', copyName));
    document.querySelector('#add-friend form').updateEventListener('submit', addFriend);
    document.querySelector('#own-name').value = accInfo.name;
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