"use strict";

function podOrderInit() {
    document.querySelectorAll('#standard-pod, #luxury-pod').forEach(el => el.updateEventListener('click', switchPod));
    document.querySelector('#select-travel-location').updateEventListener('submit', orderPod);
}

function switchPod(e) {
    const selectedPod = e.currentTarget.id;

    document.querySelector('#selected-pod').value = selectedPod.split('-')[0];

    e.currentTarget.parentNode.querySelectorAll('div').forEach(el => {
        if (el.id === selectedPod) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    updatePrice();
}

function updatePrice() {
    console.log("test");
    const price = document.querySelector("#pod-pricing span");
    const standardPod = document.querySelector("#standard-pod.active");
    if (accInfo.subscription.unlimitedTravels && standardPod) {
        price.innerHTML = `M0`;
    } else if (standardPod) {
        price.innerHTML = `M1`;
    } else {
        price.innerHTML = `M3`;
    }
}