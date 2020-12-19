"use strict";

function userInit() {
    document.querySelectorAll('#account-settings li a').forEach(el => el.updateEventListener('click', toggleEdit));
    document.querySelector('#update-account').updateEventListener('click', updateSettings);
    loadDataInSettings();
}

function updateSettings() {
    if (document.querySelector('#new-pwd').value !== '') {
        updatePassword(document.querySelector('#current-pwd').value, document.querySelector('#new-pwd').value);
    }
    document.querySelector('#new-pwd').value = "";
    document.querySelector('#current-pwd').value = "";

    const newName = document.querySelector('#new-name').value;
    if (newName !== '' && newName !== accInfo.displayName) {
        updateName(newName).then(userInit);
    }

    if (accInfo.shareLocation !== document.querySelector('#shareLocation-setting-change input').checked){
        updateSharingLocation(accInfo.shareLocation).then(userInit);
    }

}

function generateUserIcon(user) {
    const name = typeof user === "string" ? user : user.displayName;
    return `
    <div class="user-icon">
        <h2>${name.split(' ')[0].slice(0, 1)}${name.split(' ').length > 1 ? name.split(' ')[1].slice(0, 1)[0] : ''}</h2>
    </div>`;
}

function toggleEdit(e) {
    e.preventDefault();
    const clickedEl = e.currentTarget;

    switch (clickedEl.id) {
        case "edit-name":
            if (clickedEl.innerHTML === "Cancel") {
                clickedEl.innerHTML = "Edit";
                clickedEl.parentNode.querySelector('input').value = accInfo.displayName;
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
    document.querySelector('#name-settings p').innerHTML = accInfo.displayName;
    document.querySelector('#new-name').value = accInfo.displayName;
    document.querySelector('#subscription-setting-change p').innerHTML = accInfo.subscription.name;

    document.querySelector('#name-settings input').classList.add('hidden');
    document.querySelector('#name-settings p').classList.remove('hidden');
    document.querySelector('#edit-name').innerHTML = "Edit";
    document.querySelector('#password-settings div').classList.add('hidden');
    document.querySelector('#password-settings a').innerHTML = "Change password";
    document.querySelector('#userName-setting p').innerHTML = accInfo.name;
    document.querySelector('#address-setting p').innerHTML = accInfo.homeAddress + "    " + accInfo.homeEndpoint;
    document.querySelector('#shareLocation-setting-change input').checked = accInfo.shareLocation;
}