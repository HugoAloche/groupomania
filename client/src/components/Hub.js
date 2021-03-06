import '../main.scss';
import { useEffect, useState } from 'react'
import logo from '../img/logo-groupomania.png'
import edit from '../img/icons/edit.svg'
import like from '../img/icons/like.svg'
import like_vierge from '../img/icons/like_vierge.svg'
import dislike from '../img/icons/dislike.svg'
import dislike_vierge from '../img/icons/dislike_vierge.svg'
import update from '../img/icons/update.svg'
import del from '../img/icons/delete.svg'
import account from '../img/icons/account.svg'
import { useNavigate } from "react-router-dom";
import {updatePost, deletePost, listPosts} from '../controllers/post'
import {sendLike, listLikes} from '../controllers/likes'
import {sendComment, deleteComment, updateComments, listComments} from '../controllers/comments'

function Hub() {
    const [connected, setConnection] = useState(false)
    const [comment, setComment] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    const [showCommentOptions, setShowCommentOptions] = useState(false)
    const [updateContent, setUpdateContent] = useState(false)
    const [contentBool, setUpdateContentBool] = useState(false)
    const [updateComment, setUpdateComment] = useState(false)
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
                        <li onClick={goToProfile}><img srcSet={account} alt='ic??ne de profile'/>Mon profile</li>
                    </ul>
        } else {
            return <ul>
                        <li onClick={goToHome}>Se connect??</li>
                    </ul>
        }
    }
        
    const [lstPosts, setPosts] = useState([])
    const [lstComments, setComments] = useState([])
    const [lstLikes, setLikes] = useState([])

    useEffect(() => {
        listPosts().then(res => {
            setPosts(res)
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        listLikes().then(res => {
            setLikes(res)
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

    const hisPost = (idUser, idPost, title, content, url) => {
        if (idUser === parseInt(localStorage.getItem('id')) || parseInt(localStorage.getItem('id')) === 30) {
            return <div className='editSection'>
                <img onClick={() => setShowOptions(!showOptions)} className='editLogo' srcSet={edit} alt="logo d'??dition" />
                {showOptions ? <ul>
                    <li onClick={url ? () => {setUpdateContent(idPost); setUpdateContentBool(!contentBool); setTitle(title); setContent(content); setImgData(url)} : () => {setUpdateContent(idPost); setUpdateContentBool(!contentBool); setTitle(title); setContent(content);}}><img srcSet={update} alt="logo de mise ?? jour" /></li>
                    <li onClick={() => deletePost(idPost)}><img srcSet={del} alt="lgoo de suppresion" /></li>
                </ul> : null}
            </div>
        }
    }

    const hisComment = (idComment, idUser) => {
        if (idUser === parseInt(localStorage.getItem('id')) || parseInt(localStorage.getItem('id')) === 30) {
                        return <div className='editSection'>
                            <img onClick={() => setShowCommentOptions(!showCommentOptions)} className='editLogo' srcSet={edit} alt="logo d'??dition" />
                            {showCommentOptions ? <ul>
                                <li onClick={() => setUpdateComment(!updateComment)}><img srcSet={update} alt="logo de mise ?? jour" /></li>
                                <li onClick={() => deleteComment(idComment)}><img srcSet={del} alt="lgoo de suppresion" /></li>
                            </ul> : null}
                        {showUpdateComment(idComment)}
                        </div>
        }
    }

    const showUpdateContent = (id) => {
        if (updateContent === id && contentBool)  {
            return <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='title'>Titre de votre article <sup>*</sup></label>
                    <input type='text' placeholder='Titre...' id='title' maxLength={255} value={title} required onChange={(event) => {setTitle(event.target.value)}}></input>
                    <label htmlFor='content'>Contenu de l'article <sup>*</sup></label>
                    <textarea type='text' placeholder='Contenu...' id='content' maxLength={255} value={content} required onChange={(event) => {setContent(event.target.value)}}></textarea>
                    <label htmlFor='image'>Ajouter une image</label>
                    <input type='file' id='image' onChange={onChangeImage}></input>
                    <button className='fit' onClick={() => updatePost(id, title, content, file)}>Mettre ?? jour</button>
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

    const showUpdateComment = (id) => {
        if (updateComment) {
            return <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='comment'>Votre commentaire <sup>*</sup></label>
                <textarea type='text' placeholder='Votre commentaire...' id='comment' maxLength={255} value={comment} required onChange={(event) => {setComment(event.target.value)}}></textarea>
                <button className='fit' onClick={() => updateComments(id, comment)}>Mettre ?? jour</button>
            </form>
        </div>
        }
    }

    const commentSection = (idPost) => {
        // eslint-disable-next-line array-callback-return
        return lstComments.map((comment, index) => {
            if (comment.idPost === idPost) {
                return <div key={index} className='comment'>
                    {hisComment(comment.idcomments, comment.idUser)}
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

    const isLiked = (idPost, idUser) => {
        let val = null
        let nb_likes = 0
        let nb_dislikes = 0
        lstLikes.forEach(likes => {
            if (likes.idPost === idPost && likes.idUser === idUser) {
                val = likes.value
            }
            if (likes.value === 1 && likes.idPost === idPost) {
                nb_likes += 1
            }
            if (likes.value === -1 && likes.idPost === idPost) {
                nb_dislikes += 1
            }
        })
        if (val === 1) {
            return <div className='wrapper'>
                        <img className='pointer' srcSet={like} onClick={() => putLike(idPost, idUser, 0)} alt='logo de like' />
                        <p>{nb_likes}</p>
                        <img className='pointer' srcSet={dislike_vierge} onClick={() => putLike(idPost, idUser, -1)} alt='logo de like' />
                        <p>{nb_dislikes}</p>
                    </div>
        } else if (val === -1) {
            return <div className='wrapper'>
            <img className='pointer' srcSet={like_vierge} onClick={() => putLike(idPost, idUser, 1)} alt='logo de like' />
                        <p>{nb_likes}</p>
            <img className='pointer' srcSet={dislike} onClick={() => putLike(idPost, idUser, 0)} alt='logo de like' />
                        <p>{nb_dislikes}</p>
        </div>
        } else {
            return <div className='wrapper'>
            <img className='pointer' srcSet={like_vierge} onClick={() => putLike(idPost, idUser, 1)} alt='logo de like' />
                        <p>{nb_likes}</p>
            <img className='pointer' srcSet={dislike_vierge} onClick={() => putLike(idPost, idUser, -1)} alt='logo de like' />
                        <p>{nb_dislikes}</p>
        </div>
        }
    }

    const putLike = (idPost, idUser, value) => {
        sendLike(idPost, idUser, value)
    }

  return (
    <main>
    <header className='company'>
        <ul>
            <li onClick={goToHome}><img className='logo' srcSet={logo} alt="logo de la soci??t?? Groupomania" /></li>
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
                    {post.url ? hisPost(post.idusers, post.idposts, post.title, post.content, post.url) : hisPost(post.idusers, post.idposts, post.title, post.content)}
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
                {isLiked(post.idposts, parseInt(localStorage.getItem('id')))}
            </ul>
            ))}
    </section>
    </main>
  );
}

export default Hub;
