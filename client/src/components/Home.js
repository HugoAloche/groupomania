import '../main.scss';
import companyBg from '../img/entreprise.jpg'
import logo from '../img/logo-groupomania.png'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { login, signup } from "../controllers/user";

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

  const goToHub = () => {
    navigation('/hub', { replace: true })
  }

  const loginHandler = (event) => {
    event.preventDefault();
    login(email, password, navigation, setErrorMdp, setError)
  }

  const signupHandler = (event) => {
    event.preventDefault();
    signup(pseudo, email, password, setErrorEmail, setError, navigation, setErrorMdp)
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
          {isSignup ? <button onClick={signupHandler}>S'inscrire</button> : <button onClick={loginHandler}>Se connecter</button>}
        </form>
        {errorForm ? <p className='error'>Veuillez remplir tous les champs</p> : null}
        {errorEmail ? <p className='error'>E-mail déjà utillisée</p> : null}
        {errorMdp ? <p className='error'>Mauvais mot de passe</p> : null}
        {isSignup ? <p>Déjà un compte ? <span className='changeForm' onClick={() => updateForm(false)}>Se connecté</span></p> : <p>Pas encore de compte ? <span className='changeForm' onClick={() => updateForm(true)}>S'inscrire</span></p>}
        <p onClick={goToHub}> <br /><br /> <span>Continuer sans me connecté</span></p>
      </div>
      <div className='w-7'>
        <img srcSet={companyBg} alt='entreprise' />
      </div>
    </div>
    </main>
  );
}

export default Home;
