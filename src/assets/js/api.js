function getMessage() {
    return apiCall("message");
}

function getEndpoints() {
    return [
        {
            "id": "1",
             "name": "Home",
            "available": true,
            "location": "here",
            "privateEndpoint": true
        },
        {
            "id": "2",
             "name": "Home",
            "available": true,
            "location": "here",
            "privateEndpoint": true
        },
        {
            "id": "3",
             "name": "Home",
            "available": true,
            "location": "here",
            "privateEndpoint": true
        },
        {
            "id": "4",
             "name": "Home",
            "available": true,
            "location": "here",
            "privateEndpoint": true
        },
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
