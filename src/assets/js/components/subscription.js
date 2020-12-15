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
                            changeSubscription(li.getAttribute('id'),li.getAttribute('data-name'));
                        }, () => {
                            goBack();
                        })
                    })
                });

            })
        });
}

function changeSubscription(id, subName){
    let subID = parseInt(id.substr(13));
    apiCall('subscription', 'POST', true, {subscriptionId:subID})
        .then(response=>{
            if (response.status === 401 || response.status === 403) {
                warn(response.message);
            } else {
                notify(response);
            }
            goTo('#process-payment');

            if (response.status === 401 || response.status === 403) {
                document.querySelector('#process-payment .checkmark').classList.add('active', 'error');
                document.querySelector('#payment-response').innerHTML = response.message;
                setTimeout(() => {
                    goBack();
                    document.querySelector('#process-payment .checkmark').classList.remove('active', 'error')
                    document.querySelector('#payment-response').innerHTML = '';
                }, 5500);
            } else {
                document.querySelector('#process-payment .checkmark').classList.add('active', 'success');
                document.querySelector('#payment-response').innerHTML = `Successfully bought subscription #${subName}.`;
                setTimeout(() => {
                    goTo('main');
                    document.querySelector('#process-payment .checkmark').classList.remove('active', 'success')
                    document.querySelector('#payment-response').innerHTML = '';
                }, 5500);
            }
        });
}