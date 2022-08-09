import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom'
// getsubpost
function SubsUserPost() {
    const [data, setData] = useState([]);
    const { state } = useContext(UserContext);

    useEffect(() => {
        axios.get('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
            }
        })
            .then(result => {
                // console.log(result.data.posts);
                // console.log(result.data);
                setData(result.data.posts);
            })
    }, []);

    const LikePost = (id) => {
        // axios.put('/like',{
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": "Bearer "+localStorage.getItem('jwt'),
        //     },
        //     body: JSON.stringify({ postId: id })
        // })
        fetch('/like', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                });
                setData(newData);
            }).catch(err => console.log(err))
    }

    const UnLikePost = (id) => {
        fetch('/unlike', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                });
                setData(newData);
            }).catch(err => console.log(err))
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
                text,
                postId,
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                });
                setData(newData);
            }).catch(err => console.log(err));
    }



    return (
        <div>
            <Navbar />
            <section className="posts">

                {
                    data.map(i => {
                        return (
                            <div className="post" key={i._id}>
                                <div className="post_nav">
                                    <div>
                                        <img src="/img/17.jpg" className="post_img" alt="image" />
                                        <Link to={'/profile/' + i.postedBy._id}>{i.postedBy.username}</Link>
                                    </div>
                                    <div className="settings">
                                        <i className="fa fa-ellipsis-h"></i>
                                    </div>
                                </div>
                                <img src={i.photo} className="post_big_img" />
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
                                    <h3 className="lenlike">{i.likes.length} отметок "Нравится"</h3>
                                    <h3 className="desc"><span>{i.title}</span> {i.body} </h3>
                                    <h4>Посмотреть все комментарии ({i.comments.length})</h4>
                                    {
                                        i.comments.map((record, ric) => {
                                            return (
                                                <h4 key={ric} style={{ fontWeight: "500" }}>
                                                    <span style={{ fontWeight: "600" }}>
                                                        {record.postedBy.username}
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
                                    <div className="smiles"></div>
                                    <i className="fa fa-smile-o isSmil"></i>
                                    <input type="text" placeholder="Добавьте комментарий..." />
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

export default SubsUserPost;