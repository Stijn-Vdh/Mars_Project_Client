"use strict";

function initSubscription() {
    const subscriptionListElement = document.querySelector('#subscription-settings ul');
    subscriptionListElement.innerHTML = '';


    subscriptions.forEach((subscription) => {
        subscriptionListElement.innerHTML += `<li id='subscription-${subscription.id}' data-name='${subscription.name}' ${subscription.id === accInfo.subscription.id ? 'class="active"' : ''}>${subscription.name} <p>M ${subscription.price} / Month</p></li>`;
    });

    subscriptionListElement.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            mttsPrompt(`Are you sure you want to change subscription to ${li.getAttribute('data-name')}`, () => {
                changeSubscription(li.getAttribute('id'), li.getAttribute('data-name'));
            }, () => {
                goBack();
            });
        });
    });

}

function changeSubscription(id, subName) {
    let subID = parseInt(id.substr(13));
    setSubscription(subID)
        .then(() => {
            if (subID !== 0) {
                goTo('#process-payment');
                document.querySelector('#process-payment .checkmark').classList.add('active', 'success');
                document.querySelector('#payment-response').innerHTML = `Successfully bought subscription ${subName}.`;
                setTimeout(() => {
                    goTo('main');
                    document.querySelector('#process-payment .checkmark').classList.remove('active', 'success')
                    document.querySelector('#payment-response').innerHTML = '';
                }, 2000);
            } else {
                goTo('main');
                notify("Successfully stopped your subscription.");
            }
        });
}