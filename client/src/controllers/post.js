export async function sendPost(title, content, file) {
    let data = new FormData()
    if (title && content) {
        if (file) {
            data.append('image', file)
            data.append('title', title)
            data.append('content', content)
            data.append('idUser', localStorage.getItem('id'))
        } else {
            data.append('title', title)
            data.append('content', content)
            data.append('idUser', localStorage.getItem('id'))
        }
        return await fetch('http://localhost:3000/api/auth/createPost', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: data
        })
        .then(res => {
            switch (res.status) {
                case 200:
                    return 200
                default:
                    return 400
            }
        })
        .catch(err => {
            console.log(err);
        })
    } else {
        return 400
    }
}

export async function getInformation() {
    return await fetch('http://localhost:3000/api/auth/getUserInfo' + localStorage.getItem('id'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            userId: parseInt(localStorage.getItem('id'))
        })
    })
    .then(res => {
        if (res.status === 401) {
            return 401
        } else {
           return res.json()
            .then(data => {
                return data[0]
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
    .catch(err => {
        console.log(err);
    })
}

export async function getPostFromUser (id) {
    return await fetch('http://localhost:3000/api/auth/getPostFromUser' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
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

export async function updatePost(id, title, content, file) {
    let data = new FormData()
    if (title && content) {
        if (file) {
            data.append('image', file)
            data.append('title', title)
            data.append('content', content)
        } else {
            data.append('title', title)
            data.append('content', content)
        }
        fetch('http://localhost:3000/api/auth/updatePost' + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: data
        })
        .then(res => {
            switch (res.status) {
                case 200:
                    window.location.reload();
                    break;
                default:
                    return 400
            }
        })
        .catch(err => {
            console.log(err);
        })
    } else {
        return 400
    }
}

export async function deletePost (idPost) {
    fetch('http://localhost:3000/api/auth/deletePost' + idPost, {
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