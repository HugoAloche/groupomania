export async function sendLike (idPost, idUser, value) {
    fetch('http://localhost:3000/api/auth/sendLike' + idPost, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            idUser: idUser,
            value: value
        })
    })
    .then(res => {
        switch (res.status) {
            case 200:
                window.location.reload();
                break;
            default:
                break;
        }
    })
    .catch(err => {
        console.log(err);
    })
}

export async function listLikes() {
    return await fetch('http://localhost:3000/api/auth/getLikes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => {
        return res.json()
        .then(data => {
            return data.result
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
}