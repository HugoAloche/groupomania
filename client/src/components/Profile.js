import '../main.scss';
import logout from '../img/icons/logout.svg'
import forum from '../img/icons/forum.svg'
import close_green from '../img/icons/close_green.svg'
import close_red from '../img/icons/close_red.svg'
import {useState } from 'react'
import { useNavigate } from "react-router-dom";
import {sendPost, getInformation} from '../controllers/post'

function Profile() {
    const [pseudo, setPseudo] = useState('')
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [file, setPicture] = useState(null);
    const [imgData, setImgData] = useState('https://via.placeholder.com/600');
    const [errorForm, setErrorForm] = useState(false)
    const [validForm, setValidForm] = useState(false)

    const navigation = useNavigate();

    const goToHub = () => {
        navigation('/hub', { replace: true })
    }

    const disconnect = () => {
        localStorage.clear()
        navigation('/', { replace: true })
    }

    getInformation()
    .then(data => {
        if (data === 401) {
            navigation('/', { replace: true })
        }
        setEmail(data.email)
        setPseudo(data.pseudo)
    })
    .catch(err => {
        console.log(err);
    })

    const onChangeImage = (event) => {
        if (event.target.files[0]) {
            setPicture(event.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setImgData(reader.result);
            });
            reader.readAsDataURL(event.target.files[0]);
          }
    }

    const handleSubmitCreateForm = (event) => {
        event.preventDefault();
        const result = sendPost(title, content, file);
        result.then(data => {
            switch (data) {
                case 200:
                    setValidForm(true)
                    break;
                default:
                    setErrorForm(true)
                    break;
            }
        })
    }

  return (
    <main>
    <header>
        <ul>
            <li onClick={goToHub}><img srcSet={forum} alt='icône forum'/></li>
        </ul>
        <ul>
            <li onClick={disconnect}><img srcSet={logout} alt="Logo de déconnexion" /></li>
        </ul>
    </header>
    <section className='profile'>
        <div className='profile_card'>
            <img srcSet='https://i.pravatar.cc/150?img=2' alt='avatar' />
            <p><b>{pseudo}</b></p>
            <p>{email}</p>
            <ul>
                <li>Créer un post</li>
            </ul>
        </div>
        <div className='profile_information'>
        <div className='activity_content'>
                <form onSubmit={handleSubmitCreateForm}>
                    <label htmlFor='title'>Titre de votre article <sup>*</sup></label>
                    <input type='text' placeholder='Titre...' id='title' maxLength={255} required onChange={(event) => {setTitle(event.target.value)}}></input>
                    <label htmlFor='content'>Contenu de l'article <sup>*</sup></label>
                    <textarea type='text' placeholder='Contenu...' id='content' maxLength={255} required onChange={(event) => {setContent(event.target.value)}}></textarea>
                    <label htmlFor='image'>Ajouter une image</label>
                    <input type='file' id='image' onChange={onChangeImage}></input>
                    <button className='fit'>Créer</button>
                </form>
                <p className='title'>Prévisualisation</p>
                {errorForm ? <p className='error' onClick={() => setErrorForm(false)}>Veuillez remplir tout les champs ! <img srcSet={close_red} alt='Icône de fermeture du ticket' /></p> : null}
                {validForm ? <p className='valid' onClick={() => setValidForm(false)}>Votre post à bien été créer ! <img srcSet={close_green} alt='Icône de fermeture du ticket' /></p> : null}
                <ul className='post_content'>
                    <div>
                            <li><img srcSet='https://i.pravatar.cc/150?img=2' alt='avatar' /></li>
                            <div>
                                <li className='pseudo'><b>@{pseudo}</b></li>
                            </div>
                    </div>
                    <hr />
                    <div className='between'>
                        <div>
                            <li><b>{title}</b></li>
                            <li>{content}</li>
                        </div>
                        <img srcSet={imgData} alt='fake' />
                    </div>
                </ul>
            </div>
        </div>
    </section>
    </main>
  );
}

export default Profile;
