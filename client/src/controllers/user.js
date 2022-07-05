export function login(email, password, navigation, setErrorMdp, setError) {
    if (email && password) {
      fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
      })
    })
    .then(res => {
      switch (res.status) {
        case 200:
          res.json()
          .then(data => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('id', data.userId)
            navigation('/hub', { replace: true })
          })
          .catch(err => {console.error(err);})
          break;
        case 401:
          setErrorMdp(true)
          break;
        default:
          break;
      }
    })
    .catch(err => {
      console.error(err);
    })
  } else {
    setError(true)
  }
}

export function signup(pseudo, email, password, setErrorEmail, setError, navigation, setErrorMdp) {
    if (pseudo && email && password) {
      fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pseudo: pseudo,
          email: email,
          password: password
      })
    })
    .then(res => {
      switch (res.status) {
        case 201:
          login(email, password, navigation, setErrorMdp, setError)
          break;
        case 401:
          setErrorEmail(true)
          break;
        default:
          break;
      }
    })
    .catch(err => {
      console.error(err);
    })
  } else {
    setError(true)
  }
}