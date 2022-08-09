import React, { useState, useContext, useEffect } from 'react';
import Loading from './Loading';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../App'; 

function UserProfile() {
    const [userPr, setUserPr] = useState(null);
    const { userid } = useParams();
    const {state, dispatch} = useContext(UserContext);
    // console.log(userid);
    // console.log(state);
    
    useEffect(() => {
        axios.get(`/user/${userid}`,{
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            }
        }).then(result => {
            // console.log(result.data);
            // setPost(result.data)
            setUserPr(result.data);
        })
    }, []);

    const FollowUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
                followid: userid
            })
        }).then(res => res.json())
        .then(data => {
            // console.log(data);
            dispatch({type: "UPDATE", payload: {following: data.following, followeres: data.followeres}})
            localStorage.setItem("user", JSON.stringify(data));
            setUserPr(p => {
                return {
                    ...p,
                    user: { 
                        ...p.user,
                        followers: [...p.user.followers, data._id]
                    }
                }
            });
        })
    }

    const UnFollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
                followid: userid
            })
        }).then(res => res.json())
        .then(data => {
            // console.log(data);
            dispatch({type: "UPDATE", payload: {following: data.following, followeres: data.followeres}})
            localStorage.setItem("user", JSON.stringify(data));
            setUserPr(p => {
                const newFollower = p.user.followers.filter(i => i !== data._id)
                return {
                    ...p,
                    user: { 
                        ...p.user,
                        followers: newFollower
                    }
                }
            });
        })
    }
 
    return (
        <>
            {userPr 
            ? 
            <>  
            {/* <Navbar /> */}
            <nav>
                <Link to="/" className="logo">Instagram</Link>
                
                <ul className="nav-items">
                    <li className="item"><Link to="/"><i className="fa fa-home"></i></Link></li>
                    <li className="item"><Link to="/chat"><i className="fa fa-comments-o"></i></Link></li>
                    <li className="item"><Link to="/createpost"><i className="fa fa-plus-square-o"></i></Link></li>
                    <li className="item"><Link to="#"><i className="fa fa-compass"></i></Link></li>
                    <li className="item"><Link to="#"><i className="fa fa-heart-o"></i></Link></li>
                    <li className="item"><Link to="/profile"><img src={state?state.photo:'/nophoto.png'} alt="" /></Link></li>
                </ul>
            </nav>
            <div className="profile user-prof">
                <div className="profile-info">
                    <div className="profile-img">
                        <img src={userPr.user?userPr.user.photo:'/nophoto.png'} alt=""/>
                    </div>
                    <div className="profile-text">
                        {/* <div className="profile-name">{ state?state.username:"Загруска..." }</div> */}
                        <div className="profile-name">{ userPr.user.username }</div>
                        <div className="profile-email">{ userPr.user.email }</div>
                        <div className="profile-follower">
                            <p className="prf-text"><b>{userPr.posts.length}</b> публикаций</p>
                            <p className="prf-text"><b>{userPr.user.followers.length}</b> подписчиков</p>
                            <p className="prf-text"><b>{userPr.user.following.length}</b> подписок</p>
                        </div>
                        {
                            !userPr.user.followers.includes(state._id)
                            ?
                            <button className="subsc-btn"
                                onClick={() => FollowUser()}
                            >
                                Подписаться
                            </button>
                            :
                            <button className="unsubsc-btn"
                                onClick={() => UnFollowUser()}
                            >
                                Отменить
                            </button>
                        }
                    </div>
                </div>
                <div className="profile-pucblics">
                    {
                        userPr.posts.map(i => {
                            return(
                                <div className="publics" key={i._id}>
                                    <img src={i.photo.toString().replace("/profile","")} alt=""/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            </>
            
            : <Loading />}
        </>
    );
}

export default UserProfile;