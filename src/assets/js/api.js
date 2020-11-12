function getMessage() {
    return apiCall("message");
}

function getEndpoints() {
    return [
        {
            "id": 1,
            "name": "Home",
            "available": true,
            "location": "here",
            "privateEndpoint": true
        },
        {
            "id": 2,
            "name": "Maldi",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 3,
            "name": "Debby",
            "available": true,
            "location": "somwhere else",
            "privateEndpoint": true
        },
        {
            "id": 4,
            "name": "Tasle",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 5,
            "name": "Maruyt",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 6,
            "name": "Malbert Hein",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 7,
            "name": "Work",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 8,
            "name": "Mars Square",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        }
    ]
}

function apiCall(uri) {
    const request = new Request(api + uri, {
        method: 'GET',
        credentials: 'include'
    });
    return fetch(request)
        .then(response => response.json());
}
