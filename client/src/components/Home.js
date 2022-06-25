import '../main.scss';
import companyBg from '../img/entreprise.jpg'
import logo from '../img/logo-groupomania.png'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
  const navigation = useNavigate();
        
  const [pseudo, setPeusdo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
        
  const [isSignup, updateForm] = useState(true)
  const signupContent = () => {
    if (isSignup) {
      return <div><label htmlFor='pseudo'>Nom d'utilisateur <sup>*</sup></label> <input type='text' id='pseudo' name='pseudo' placeholder="Nom d'utilisateur" required onChange={(event) => {setPeusdo(event.target.value)}} /></div>
    }
  }
  const [errorForm, setError] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorMdp, setErrorMdp] = useState(false)

  const signup = (event) => {
    event.preventDefault();
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
          login()
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

  const loginHandler = (event) => {
    event.preventDefault();
    login()
  }

  const login = () => {
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
            navigation('/company', { replace: true })
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

  return (
    <main>
    <div className='wrapper'>
      <div className='w-3'>
        <img srcSet={logo} alt='logo' />
        <form>
        {signupContent()}
          <label htmlFor='email'>E-mail <sup>*</sup></label>
          <input type='email' id='email' name='email' placeholder='test@email.com' required onChange={(event) => {setEmail(event.target.value)}} />
          <label htmlFor='password'>Mot de passe <sup>*</sup></label>
          <input type='password' id='password' name='password' placeholder='mon mot de passe' required onChange={(event) => {setPassword(event.target.value)}} />
          {isSignup ? <button onClick={signup}>S'inscrire</button> : <button onClick={loginHandler}>Se connecter</button>}
        </form>
        {errorForm ? <p className='error'>Veuillez remplir tous les champs</p> : null}
        {errorEmail ? <p className='error'>E-mail déjà utillisée</p> : null}
        {errorMdp ? <p className='error'>Mauvais mot de passe</p> : null}
        {isSignup ? <p>Déjà un compte ? <span className='changeForm' onClick={() => updateForm(false)}>Se connecté</span></p> : <p>Pas encore de compte ? <span className='changeForm' onClick={() => updateForm(true)}>S'inscrire</span></p>}
      </div>
      <div className='w-7'>
        <img srcSet={companyBg} alt='entreprise' />
      </div>
    </div>
    </main>
  );
}

export default Home;
