import '../main.scss';
import { useEffect, useState } from 'react'
import logo from '../img/logo-groupomania.png'
import edit from '../img/icons/edit.svg'
import update from '../img/icons/update.svg'
import del from '../img/icons/delete.svg'
import account from '../img/icons/account.svg'
import { useNavigate } from "react-router-dom";
import {updatePost ,deletePost, sendComment} from '../controllers/post'

function Company() {
    const [connected, setConnection] = useState(false)
    const [comment, setComment] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    const [updateContent, setUpdateContent] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [file, setPicture] = useState(null);
    const [imgData, setImgData] = useState('https://via.placeholder.com/600');

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
    const handleSubmit = (event) => {
        event.preventDefault();
    }

    useEffect(() => {
        if (localStorage.length > 0) {
            setConnection(true)
        }
    }, [])

    const navigation = useNavigate();

    const goToHome = () => {
        navigation('/', { replace: true })
    }

    const goToProfile = () => {
        navigation('/profile', { replace: true })
    }

    const isConnected = () => {
        if (connected) {
            return <ul>
                        <li onClick={goToProfile}><img srcSet={account} alt='icône de profile'/>Mon profile</li>
                    </ul>
        } else {
            return <ul>
                        <li onClick={goToHome}>Se connecté</li>
                    </ul>
        }
    }
        
    const [lstPosts, setPosts] = useState([])
    const [lstComments, setComments] = useState([])

    const listPosts = async () => {
        return await fetch('http://localhost:3000/api/auth/getPosts', {
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

    useEffect(() => {
        listPosts().then(res => {
            setPosts(res)
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        listComments().then(res => {
            setComments(res)
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    const listComments = async () => {
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
                <form onSubmit={handleSubmit}>
                    <label htmlFor='title'>Titre de votre article <sup>*</sup></label>
                    <input type='text' placeholder='Titre...' id='title' maxLength={255} value={title} required onChange={(event) => {setTitle(event.target.value)}}></input>
                    <label htmlFor='content'>Contenu de l'article <sup>*</sup></label>
                    <textarea type='text' placeholder='Contenu...' id='content' maxLength={255} value={content} required onChange={(event) => {setContent(event.target.value)}}></textarea>
                    <label htmlFor='image'>Ajouter une image</label>
                    <input type='file' id='image' onChange={onChangeImage}></input>
                    <button className='fit' onClick={() => updatePost(id, title, content, file)}>Mettre à jour</button>
                </form>
            </div>
        }
    }

    const commentForm = (id) => {
        if (connected) {
            return <form onSubmit={commentFormHandler}>
                    <label htmlFor='comment'>Commentaire</label>
                    <textarea type='text' placeholder='Commentaire...' id='comment' maxLength={255} onChange={(event) => {setComment(event.target.value)}}></textarea>
                    <button className='fit' onClick={() => sendComment(comment, id)}>Envoyer</button>
                </form>
        }
    }

    const commentSection = (id) => {
        return lstComments.map((comment, index) => {
            if (comment.idPost === id) {
                return <div key={index} className='comment'>
                    <div>
                        <img srcSet='https://i.pravatar.cc/95?img=2' alt='avatar' />
                        <div>
                            <p><b>@{comment.author}</b></p>
                            <p>{comment.date}</p>
                        </div>
                    </div>
                    <p>{comment.comment}</p>
                </div>
            }
        })
    }

    const commentFormHandler = (event) => {
        event.preventDefault()
    }

  return (
    <main>
    <header className='company'>
        <ul>
            <li onClick={goToHome}><img className='logo' srcSet={logo} alt="logo de la société Groupomania" /></li>
        </ul>
        {isConnected()}
    </header>
    <section className='post'>
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
                {commentForm(post.idposts)}
                {commentSection(post.idposts)}
            </ul>
            ))}
    </section>
    </main>
  );
}

export default Company;