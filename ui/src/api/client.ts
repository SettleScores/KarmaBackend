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

//TODO fix Authorization
//TODO fix return type
//TODO return correct data
export const getUsers = (accessToken: string): Promise<any[]> => {
    return fetch('/api/logic', {
        headers: {
            'authorization': accessToken
        }
    })
        .then(res => res.json())
        .then(res => res.users)

}