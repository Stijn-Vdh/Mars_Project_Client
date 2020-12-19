"use strict";
let points = Math.round(Math.random() * 30) + 100; // Implemented as POC

function initPoints() {
    document.querySelector('.points p span').innerHTML = points;
}

function updatePoints() {
    if (points >= 100) {
        document.querySelector('.points p').innerHTML = '<span></span>';
    } else if (points <= 10) {
        document.querySelector('.points p').innerHTML = '00<span></span>';
    } else {
        document.querySelector('.points p').innerHTML = '0<span></span>';
    }
    document.querySelector('.points p span').innerHTML = points;
    document.querySelector('#info-amount').innerHTML = points;
}

function addPoints(pointsToAdd) {
    points = Math.min(999, points + pointsToAdd);

    document.querySelector('#points-changed').innerHTML = `+${pointsToAdd}`;

    updatePoints();
    popupPoints();
}

function popupPoints() {
    document.querySelector('#points-popup').classList.remove('close');
    document.querySelector('#points-popup').classList.add('active');

    setTimeout(() => {
        document.querySelector('#points-popup').classList.add('close');
        document.querySelector('#points-popup').classList.remove('active');
        setTimeout(() => {
            document.querySelector('#points-popup').classList.remove('close');
        },900)
    }, 3000);
}