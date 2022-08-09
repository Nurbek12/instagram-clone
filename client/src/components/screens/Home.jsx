import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Smiles from './Smiles';
import Navbar from '../Navbar';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom'

function Home() {
    const [data,setData] = useState([]);
    const {state} = useContext(UserContext);
    const [subUser, setSubUser] = useState([])

    useEffect(() => {
        axios.get('/allpost',{
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            }
        })
        .then(result => {
            // console.log(result.data.posts);
            // console.log(result.data);
            setData(result.data.posts.reverse());
        })

        axios.get('/allusers', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
            }
        })
        .then(result => {
            // console.log(result.data.posts);
            // console.log(result.data);
            setSubUser(result.data.users);
        })
    }, []);

    const LikePost = (id) => {

        fetch('/like',{
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item 
                }
            });
            setData(newData);
        }).catch(err => console.log(err))
    }

    const UnLikePost = (id) => {
        fetch('/unlike',{
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            });
            setData(newData);
        }).catch(err => console.log(err))
    }

    const makeComment = (text, postId) => {
        fetch('/comment',{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
                text,
                postId,
            })
        }).then(res => res.json())
        .then( result => {
            // console.log(result);
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            });
            setData(newData);
        }).catch(err => console.log(err));
    }

    const DeletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            const newData = data.filter(i => {
                return i._id !== result._id
            });
            setData(newData); 
        })
    }

    const LikeAnim = (el, bl, id) => {
        if(bl){
            return;
        }
        var like = document.createElement('div');
        like.classList.add('likeHeart');
        like.innerHTML = '<i class="fa fa-heart"></i>'
        el.parentElement.append(like);
        setTimeout(() => {
            like.remove();
        },600);
        LikePost(id)
    }

    const inputSmiles = (el,sm) => {
        el.parentElement.querySelector('input').value += sm;
        // console.log(el, sm);
    }

    return (
        <div>
            <Navbar />
            <div className="recomended">
                    <span className="recomend">
                        <img src={state?state.photo:""} className="home_nik_img" />
                        <h3>{state?state.username:""}<br /><span>{state?state.name:""}</span></h3>
                        <Link to="/profile" className="aina">Переключится</Link>
                    </span>
                    <h3 className="title"><span>Рекомендации для вас</span> Все</h3>
                    <ul className="recomends">
                    {
                        subUser.map((sb, ind) => {
                            return (
                                !state.following.includes(sb._id)&&sb._id !== state._id
                                ?
                                <a href="#" className="recomend" key={ind}>
                                    <img src={sb.photo} className="home_nik_img small-img"/>
                                    <h3>{ sb.username } <br/> <span>Рекомендации для вас</span></h3>
                                    <span href="#" className="aina">Подптсаться</span>
                                </a>:""
                            )
                        })
                    }
                    </ul>
                    <div className="links">
                        <a href="#">Информатция</a>  
                        <a href="#">Помощь</a>  
                        <a href="#">Просса</a>  
                        <a href="#">API</a>  
                        <a href="#">Вакансии</a>  
                        <a href="#">Конфиденщальность</a>  
                        <a href="#">Условия</a>  
                        <a href="#">Места</a>  <br/>
                        <a href="#">Популярные аккаунты</a>  
                        <a href="#">Хештеги</a>  
                        <a href="#">Язык</a> 
                        <p>&copy; 2021 INSTAGRAM FROM META</p>
                    </div>
                </div>
            <section className="posts">

                <div className="stories">
                    <div id="storieBtnPrev">
                        <i className="fa fa-angle-left"></i>
                    </div>

                    <div className="stories-cont">
                    {
                        subUser.map((sb, ind) => {
                            return (
                                state.following.includes(sb._id)||sb._id == state._id?
                                <div className="storie"  key={ind}>
                                    <img src={sb.photo} className="stories_img" />
                                    <span>{ sb.username }</span>
                                </div>:""
                            )
                        })
                    }
                    </div>


                    <div id="storieBtnNext">
                        <i className="fa fa-angle-right"></i>
                    </div>
                </div>

                {
                    data.map(i => {
                        return(
                        <div className="post" key={i._id}>
                            <div className="post_nav">
                                <div>
                                    <img src={i.postedBy.photo||'/nophoto.png'} className="post_img" />
                                    <Link to={i.postedBy._id !== state._id?'/profile/'+i.postedBy._id:"/profile"}>{ i.postedBy.username }</Link>
                                </div>
                                { 
                                    i.postedBy._id == state._id
                                    ?
                                        <div className="settings" 
                                            onClick={() => DeletePost(i._id)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </div>
                                    :<div className="settings">
                                        <i className="fa fa-ellipsis-h"></i>
                                    </div>
                                
                                }
                            </div>
                            <img src={i.photo} className="post_big_img" 
                                onDoubleClick={(e) => LikeAnim(e.target, i.likes.includes(state._id), i._id)}
                            />
                            <div className="appr-post">
                                <div className="icons">
                                    {
                                        i.likes.includes(state._id)
                                        ?
                                        <div className="like thislike"
                                            onClick={() => UnLikePost(i._id)}
                                        >
                                            <i className="fa fa-heart"></i>
                                        </div>
                                        :
                                        <div className="like"
                                            onClick={() => LikePost(i._id)}
                                        >
                                            <i className="fa fa-heart-o"></i>
                                        </div>

                                    }
                                    <div className="comment">
                                        <i className="fa fa-comment-o"></i>
                                    </div>
                                    <div className="send">
                                        <i className="fa fa-send-o"></i>
                                    </div>
                                </div>
                                <div className="navigat">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div className="mark">
                                    <i className="fa fa-bookmark-o"></i>
                                </div>
                            </div>
                            <div className="comments">
                                <h3 className="lenlike">{ i.likes.length } отметок "Нравится"</h3>
                                <h3 className="desc"><span>{ i.title }</span> {i.body} </h3>
                                <h4>Посмотреть все комментарии ({ i.comments.length })</h4>
                                {
                                    i.comments.map((record, ric)=> {
                                        return (
                                            <h4 key={ric} style={{fontWeight: "500"}}>
                                                <span style={{fontWeight: "600"}}>
                                                    {record.postedBy.username}&nbsp;
                                                </span> 
                                                {record.text}
                                            </h4>
                                        )
                                    })
                                }
                            </div>
                            <form action="#" className="form" onSubmit={e => {
                                e.preventDefault();
                                makeComment(e.target[0].value, i._id);
                                e.target[0].value = '';
                            }}>
                                <Smiles fc={inputSmiles} />
                                <i className="fa fa-smile-o isSmil"
                                    onClick={(e) => {
                                        e.target.parentElement.querySelector('.smiles').classList.toggle('show');
                                    }}
                                ></i>
                                <input type="text" placeholder="Добавьте комментарий..." className="inputs" />
                                <button>Опубликоват</button>
                            </form>
                        </div>
                        )
                    })
                }

            </section>
        </div>
    );
}

export default Home;