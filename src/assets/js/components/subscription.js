"use strict";

function initSubscription() {
    const subscriptionListElement = document.querySelector('#subscription-settings ul');
    subscriptionListElement.innerHTML = '';

    apiCall('subscription', 'GET')
        .then((subscriptions) => {
            getUserInfo().then((userInfo) => {
                subscriptions.forEach((subscription) => {
                    subscriptionListElement.innerHTML += `<li ${subscription.id === userInfo.subscription.id ? 'class="active"' : ''}>${subscription.name}</li>`;
                    subscriptionListElement.querySelector('li:last-child').updateEventListener('click', () => {
                        mttsPrompt(`Are you sure you want to change subscription to ${subscription.name}`, () => {
                            notify('Changed');
                        }, () => {
                            goBack();
                        })
                    })
                });
            })
        });
}