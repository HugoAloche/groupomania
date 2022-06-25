import '../main.scss';
import logout from '../img/icons/logout.svg'
import forum from '../img/icons/forum.svg'
import edit from '../img/icons/edit.svg'
import update from '../img/icons/update.svg'
import del from '../img/icons/delete.svg'
import close_green from '../img/icons/close_green.svg'
import close_red from '../img/icons/close_red.svg'
import {useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {sendPost, getInformation, getPostFromUser, updatePost ,deletePost} from '../controllers/post'

function Profile() {
    const [lstPosts, setPosts] = useState([])
    const [pseudo, setPseudo] = useState('')
    const [email, setEmail] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    const [updateContent, setUpdateContent] = useState(false)
    const [createPost, setCreatePost] = useState(true)
    const [isCreatePostActive, setIsCreatePostActive] = useState('active')
    const [myPost, setMyPost] = useState(false)
    const [isMyPost, setIsMyPost] = useState('')
    const [postLiked, setPostLiked] = useState(false)
    const [isPostLiked, setIsPostLiked] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [file, setPicture] = useState(null);
    const [imgData, setImgData] = useState('https://via.placeholder.com/600');
    const [errorForm, setErrorForm] = useState(false)
    const [validForm, setValidForm] = useState(false)

    const navigation = useNavigate();

    const goToHub = () => {
        navigation('/company', { replace: true })
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

    useEffect(() => {
        getPostFromUser(localStorage.getItem('id')).then(res => {
            setPosts(res)
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

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

    const handleSubmitUpdateForm = (event) => {
        event.preventDefault();
    }

    const hisPost = (idUser, idPost) => {
        if (idUser === parseInt(localStorage.getItem('id'))) {
            return <div className='editSection'>
                <img onClick={() => setShowOptions(!showOptions)} className='editLogo' srcSet={edit} alt="logo d'édition" />
                {showOptions ? <ul>
                    <li onClick={() => setUpdateContent(!updateContent)}><img srcSet={update} alt="logo de mise à jour" /></li>
                    <li onClick={() => deletePost(idPost)}><img srcSet={del} alt="lgoo de suppresion" /></li>
                </ul> : null}
            </div>
        }
    }

    const showUpdateContent = (id) => {
        if (updateContent) {
            return <div className='not'>
                <form onSubmit={handleSubmitUpdateForm}>
                    <label htmlFor='title'>Titre de votre article <sup>*</sup></label>
                    <input type='text' placeholder='Titre...' id='title' maxLength={255} value={title} required onChange={(event) => {setTitle(event.target.value)}}></input>
                    <label htmlFor='content'>Contenu de l'article <sup>*</sup></label>
                    <textarea type='text' placeholder='Contenu...' id='content' maxLength={255} value={content} required onChange={(event) => {setContent(event.target.value)}}></textarea>
                    <label htmlFor='image'>Ajouter une image</label>
                    <input type='file' id='image' onChange={onChangeImage}></input>
                    <button className='fit' onClick={() => updatePost(id, title, content, file)}>Mettre à jour</button>
                </form>
                {errorForm ? <p className='error'>Veuillez remplir tout les champs !</p> : null}
            </div>
        }
    }

    const profileContent = () => {
        if (createPost) {
            return <div className='activity_content'>
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
        } else if (myPost) {
            return <div className='activity_content'>
                {lstPosts.map((post, index) => (
                <ul key={index} className='post_content'>
                    <div>
                        <li><img srcSet='https://i.pravatar.cc/95?img=2' alt='avatar' /></li>
                        <div>
                            <li className='pseudo' key={post.author}>@{post.author}</li>
                            <li key={post.date_creation}>{post.date_creation}</li>
                        </div>
                        {hisPost(post.idusers, post.idposts)}
                    </div>
                    <hr />
                    <div className='between'>
                        <div>
                            <li key={post.title}><b>{updateContent ? title : post.title}</b></li>
                            <li key={post.content}>{updateContent ? content : post.content}</li>
                        </div>
                        {post.url ? <img srcSet={!updateContent ? post.url : null} alt='' /> : null}
                        {updateContent ? <img srcSet={imgData} alt='je sais pas '/> : null}
                    </div>
                    {showUpdateContent(post.idposts)}
                </ul>
                ))}
            </div>
        } else if (postLiked) {
            return <p>Posts que j'ai aimé</p>
        }
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
                <li onClick={() => {setPostLiked(true); setIsPostLiked('active'); setCreatePost(false); setIsCreatePostActive(''); setMyPost(false); setIsMyPost('');}} className={isPostLiked}>Post aimé</li>
                <li onClick={() => {setPostLiked(false); setIsPostLiked(''); setCreatePost(false); setIsCreatePostActive(''); setMyPost(true); setIsMyPost('active');}} className={isMyPost}>Mes post</li>
                <li onClick={() => {setPostLiked(false); setIsPostLiked(''); setCreatePost(true); setIsCreatePostActive('active'); setMyPost(false); setIsMyPost('');}} className={isCreatePostActive}>Créer un post</li>
            </ul>
        </div>
        <div className='profile_information'>
            {profileContent()}
        </div>
    </section>
    </main>
  );
}

export default Profile;
