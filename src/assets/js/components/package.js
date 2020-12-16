"use strict";

function initPackage() {
    document.querySelector('#select-package-order ion-icon').addEventListener('click', swap);
}

function swap(){
    let from = document.querySelector('#p-from').value;
    let to = document.querySelector('#p-destination').value;

    document.querySelector('#p-from').value = to;
    document.querySelector('#p-destination').value = from;
}

