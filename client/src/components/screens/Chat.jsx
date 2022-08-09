import React,{ useEffect, useState, useContext, useRef } from 'react';
import Smiles from './Smiles';
import axios from 'axios';
import Navbar from '../Navbar';
import { UserContext } from '../../App';

function Chat() {
    const [users, setUsers] = useState([]);
    const { state } = useContext(UserContext);
    const box = useRef(null);
    const [mess, setMess] = useState("")
    const [chat, setChat] = useState([]);
    const inputSmiles = (el,sm) => {
        // el.parentElement.querySelector('input').value += sm;
        setMess(p => p+sm);
        // console.log(el, sm);
    }
    useEffect(async () => {
        await axios.get('/allusers',{
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            }
        })
        .then(result => {
            setUsers(result.data.users);
        })
    
        setInterval(() => {
            axios.get('/allmessages', {
                headers: {
                    "Authorization": "Bearer "+localStorage.getItem('jwt'),
                }
            }).then(result => {
                setChat(result.data.mes)
            })
        }, 3000); 
    }, [])

    const SendMessage = (txt) => {
        if(!txt){
            return;
        }
        fetch('/sendmessage',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
            body: JSON.stringify({text: txt})
        }).then(res => res.json())
        .then(dat => {
            // console.log(dat);
        })
        .catch(err => {
            console.log(err);
        })
        setChat(p => {
            const newChat = {
                text: txt,
                sendmessuser: state, 
            }
            return [...p, newChat]
        });
    }

    useEffect(() => {
        setTimeout(()=>{
            if(!box.current) return;
            box.current.scrollTop = box.current?.scrollHeight;
        },500)
    }, [chat])
    
    return (
        <>
            <Navbar />
            <section className="chat-container">
                <div className="content">
                    <div className="my_user">
                        <h2>{state?state.username:""}</h2>
                        <i className="fa fa-edit"></i>
                    </div>
                    <div className="users">

                        {
                            users.map(user => {
                                if(user._id == state._id){
                                    return
                                }
                                return(
                                    <div className="user" key={user._id}>
                                        <img src={user.photo} className="user_img" />
                                        <h3>{user.username}<br /><span>message</span></h3>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
                <div className="chat">
                    <div className="chat_nav">
                        <div className="user">
                            <img src="/img/vue-dark.jpg" className="user_img" />
                            <h3>Группа Инстаграм<br /><span>{users.length} участников</span></h3>
                        </div>
                    </div>
                    <div className="chat-box" ref={box}>
                        {
                            chat.map((c, ind) => {
                                return(
                                <div className="mess" key={ind}>
                                    {
                                        c.sendmessuser._id==state._id?"":<img src={c.sendmessuser.photo}  className="chat-user-img"/>
                                    }
                                    <p className={c.sendmessuser._id==state._id?"outc":"incom"}>
                                    {
                                        c.sendmessuser._id==state._id?
                                        "":
                                        <span>{c.sendmessuser.username} <br /></span>
                                    }
                                        
                                        {c.text}
                                    </p>
                                </div>
                                )
                            })
                        }
                        {/* outc */}
                    </div>
                    <form onSubmit={e => {
                        e.preventDefault();
                        SendMessage(mess);
                        e.target.querySelector('.smiles').classList.remove('show');
                        setMess("");
                    }}>
                        <Smiles fc={inputSmiles} />
                        <i className="fa fa-smile-o"
                            onClick={(e) => {
                                e.target.parentElement.querySelector('.smiles').classList.toggle('show');
                            }}
                        ></i>
                        <input type="text" placeholder="Напишите сообшение..." id="mess" onChange={e => setMess(e.target.value)} value={mess}/>
                        <i className="fa fa-send" id="send" type="submit"></i>
                        <i className="fa fa-image"></i>
                        <i className="fa fa-heart-o"></i>
                    </form>
                </div>
    </section>
        </>
    );
}

export default Chat;