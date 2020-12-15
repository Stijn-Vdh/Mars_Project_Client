"use strict";

function initSubscription() {
    const subscriptionListElement = document.querySelector('#subscription-settings ul');
    subscriptionListElement.innerHTML = '';

    apiCall('subscription', 'GET')
        .then((subscriptions) => {
            getUserInfo().then((userInfo) => {
                subscriptions.forEach((subscription) => {
                    subscriptionListElement.innerHTML += `<li id='subscription-${subscription.id}' data-name='${subscription.name}' ${subscription.id === userInfo.subscription.id ? 'class="active"' : ''}>${subscription.name}     <p>M ${subscription.price}</p></li>`;
                });

                subscriptionListElement.querySelectorAll('li').forEach(li => {
                    li.addEventListener('click', () => {
                        mttsPrompt(`Are you sure you want to change subscription to ${li.getAttribute('data-name')}`, () => {
                            notify('Changed');
                            changeSubscription(li.getAttribute('id'));
                            goBack();
                        }, () => {
                            goBack();
                        })
                    })
                });

            })
        });
}

function changeSubscription(id){
    let subID = parseInt(id.substr(13));
    apiCall('subscription', 'POST', true, {subscriptionId:subID})
        .then(response=>{
            if (response.status === 401 || response.status === 403) {
                warn(response.message);
            } else {
                notify(response);
            }
        });
}