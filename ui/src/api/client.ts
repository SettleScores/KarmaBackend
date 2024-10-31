export const login = (username: string | null, password: string | null): Promise<string> => {
    return fetch('/api/logic', {
        method: 'POST',
        body: JSON.stringify({
            username,
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