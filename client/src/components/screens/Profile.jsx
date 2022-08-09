import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../Navbar';
import { UserContext } from '../../App';
import AlertMes from './Alert';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// 42 - seriyasida rasmni ozgartirish tashlab ketildi kod buzilmasligi uchun u oxirida bajariladi

function Profile() {
    const [post, setPost] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    // console.log(state);
    
    useEffect(() => {
        axios.get('/mypost',{ 
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            }
        }).then(result => {
            // console.log(result);
            setPost(result.data.myposts)
        })
    }, []); 

    return (
        <>
            <Navbar />
            <div className="profile">
                <div className="profile-info">
                    <div className="profile-img">
                        <img src={state?state.photo:'/nophoto.png'} alt=""/>
                    </div>
                    <div className="profile-text">
                        <div className="profile-name">{ state?state.username:"Загруска..." }</div>
                        <div className="profile-follower">
                            <p className="prf-text"><b>{ post.length }</b> публикаций</p>
                            <p className="prf-text"><b>{ state?state.followers.length:"0" }</b> подписчиков</p>
                            <p className="prf-text"><b>{ state?state.following.length:"0" }</b> подписок</p>
                        </div>
                        <button className="logout-btn"
                            onClick={() => {
                                localStorage.clear();
                                dispatch({ type: "CLEAR" });
                                history.push('/login')
                                AlertMes("Успешной выход", "success");
                            }}
                        >
                            Выйти из аккаунта
                        </button>
                    </div>
                </div>
                <div className="profile-pucblics">
                    {
                        post.map(i => {
                            return(
                                <div className="publics" key={i._id}>
                                    <img src={i.photo} alt=""/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default Profile;