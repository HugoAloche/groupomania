

export async function updateComments (id, comment) {
    fetch('http://localhost:3000/api/auth/updateComment' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            comment: comment
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



export async function sendComment (comment, idpost) {
    fetch('http://localhost:3000/api/auth/createComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            comment: comment,
            idUser: parseInt(localStorage.getItem('id')),
            idPost: idpost
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

export async function deleteComment (id) {
    fetch('http://localhost:3000/api/auth/deleteComment' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
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



export async function listComments() {
    return await fetch('http://localhost:3000/api/auth/getComments', {
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