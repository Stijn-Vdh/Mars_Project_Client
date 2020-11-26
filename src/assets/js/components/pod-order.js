"use strict";

function podOrderInit() {
    document.querySelectorAll('#normal-pod, #luxury-pod').forEach(el => el.addEventListener('click', switchPod));
}

function switchPod(e) {
    const selectedPod = e.currentTarget.id;

    document.querySelector('#selected-pod').value = selectedPod;

    e.currentTarget.parentNode.querySelectorAll('div').forEach(el => {
        if (el.id === selectedPod) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    })
} 