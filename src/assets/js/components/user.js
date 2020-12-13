"use strict";

let userInfo = {};

function initAccountSettings() {
    getUserInfo()
        .then(response => {
            userInit(response);
        });
}

function userInit(user) {
    document.querySelectorAll('#account-settings li a').forEach(el => el.updateEventListener('click', toggleEdit));
    document.querySelector('#update-account').updateEventListener('click', updateSettings);
    userInfo.name = user.displayName;
    userInfo.subscription = user.subscription.name;

    loadDataInSettings();
}

function updateSettings() {
    if (document.querySelector('#new-name').value !== userInfo.name) {
        updateName(document.querySelector('#new-name').value);
    }
    if (document.querySelector('#new-pwd').value !== '') {
        updatePassword(document.querySelector('#current-pwd').value, document.querySelector('#new-pwd').value);
    }

    document.querySelector('#new-pwd').value = "";
    document.querySelector('#current-pwd').value = "";

    initAccountSettings();
}

function generateUserIcon(user) {
    return `
    <div class="user-icon">
        <h2>${user.displayName.split(' ')[0].slice(0, 1)}${user.displayName.split(' ').length > 1 ? user.displayName.split(' ')[1].slice(0, 1)[0]: ''}</h2>
    </div>`;
}

function toggleEdit(e) {
    e.preventDefault();
    const clickedEl = e.currentTarget;
    
    switch (clickedEl.id) {
        case "edit-name":
            if (clickedEl.innerHTML === "Cancel") {
                clickedEl.innerHTML = "Edit";
                clickedEl.parentNode.querySelector('input').value = userInfo.name;
                clickedEl.parentNode.querySelector('input').classList.add('hidden');
                clickedEl.parentNode.querySelector('p').classList.remove('hidden');
            } else {
                clickedEl.innerHTML = "Cancel";
                clickedEl.parentNode.querySelector('input').classList.remove('hidden');
                clickedEl.parentNode.querySelector('input').focus();
                clickedEl.parentNode.querySelector('input').select();
                clickedEl.parentNode.querySelector('p').classList.add('hidden');
            }
            break;
        case "edit-password":
            if (clickedEl.innerHTML === "Cancel") {
                clickedEl.innerHTML = "Change password";
                clickedEl.parentNode.querySelector('#new-pwd').value = "";
                clickedEl.parentNode.querySelector('#current-pwd').value = "";
                clickedEl.parentNode.classList.add('hidden');
            } else {
                clickedEl.innerHTML = "Cancel";
                clickedEl.parentNode.classList.remove('hidden');
            }
            break;
        default:
            break;
    }
}

function loadDataInSettings() {
    document.querySelector('#name-settings p').innerHTML = userInfo.name;
    document.querySelector('#new-name').value = userInfo.name;
    document.querySelector('#subscription-settings p').innerHTML = userInfo.subscription;
    // document.querySelector('#business-settings input').checked = userInfo.isBusiness;

    document.querySelector('#name-settings input').classList.add('hidden');
    document.querySelector('#name-settings p').classList.remove('hidden');
    document.querySelector('#edit-name').innerHTML = "Edit";
    document.querySelector('#password-settings div').classList.add('hidden');
    document.querySelector('#password-settings a').innerHTML = "Change password";
}