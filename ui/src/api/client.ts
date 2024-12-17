export const login = (username: string | null, password: string | null): Promise<string> => {
    return fetch('http://localhost:3000/api/karma/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usernameOrEmail: username,
            password
        })
    })
        .then(res => res.json())
        .then(res => res.accessToken)
}

/// TODO Add Authorization after first tests: headers: {'authorization': 'Bearer ' + accessToken 
export const sendPush = (username: string | null) => {
    return fetch('http://localhost:3000/api/karma/pushpush', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usernameOrEmail: username, /// TODO Here will be some criteria for push from Adminka
        })

    })
}

/// TODO Add Authorization after first tests: headers: {'authorization': 'Bearer ' + accessToken }      
export const sendPushForAll = (title: string | null, body: string | null) => {
    return fetch('http://localhost:3000/api/karma/pushpushall', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            body: body,
        })
    })
}

//TODO fix Authorization /// Seems to be fixed
//TODO fix return type
//TODO return correct data
export const getUsers = (accessToken: string): Promise<any[]> => {
    return fetch('/api/logic', {
        headers: {
            'authorization': 'Bearer ' + accessToken
        }
    })
        .then(res => res.json())
        .then(res => res.users)

}