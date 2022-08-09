import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import AlertMes from './Alert';
import axios from 'axios';

function Signup() {
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [odata, setOdata] = useState([]);
    const [pic, setPic] = useState(null)
    const history = useHistory();
    const PostData = async () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) ){
        //    setOdata("Неправильный адрес электронной почта");
            AlertMes("Неправильный адрес электронной почта", "error");
            return;
        }
        
        // fetch('/signup', {
        //     method: 'post',
        //     headers: {
        //         "Content-Type": "multipart/form-data"
        //     },
        //     body: JSON.stringify({
        //         name,
        //         username: userName,
        //         password,
        //         email,
        //         photo: pic,
        //     })
        // })const newForm = new FormData();
        const newForm = new FormData();
        newForm.append('email', email);
        newForm.append('password', password);
        newForm.append('name', name);
        newForm.append('username', userName);
        newForm.append('photo', pic);
        await axios.post('/signup', newForm, {
            headers: {
                "Content-Type":"multipart/form-data",
            },
        })
        .then(data => {
            // console.log(data);
            setOdata(data);
            if(data.error){
                AlertMes(data.error, "error");
            }else{
                AlertMes("Успешной вход", "success");
                history.push('/login');
            }
        }).catch(err => {
            console.log(err);
        })

    }
    return (
        <React.Fragment>
            {/* { odata.error ? (
                <Alert data={odata.error} isErr={odata.error ? "error":"success"}/>
            ) : "" } */}
            <div className="content log">
                <form action="#">
                    <h1 className="title">Instagram</h1>
                    <p className="subtitle">Зарегистрируйтесь, чтобы <br/> смотреть фото и видео ваших <br/> друзей.</p>
                    <button className="btn" type="button"><i className="fa fa-facebook-square"></i> Войти через Facebook</button>
                    <span>ИЛИ</span>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" placeholder="Моб. телефон или эл. адрес"/>
                    <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="Имя и Вамилия"/>
                    <input value={userName} onChange={(e)=>setUserName(e.target.value)} type="text" placeholder="Имя пользователя"/>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Парол"/>
                    <input onChange={(e)=>setPic(e.target.files[0])} type="file"/>
                    <button onClick={ PostData } className="btn" type="button">Регистратция</button>
                    
                    <p className="ifn">
                        Регистрируясь, вы принимаете наши <b>
                            Условия <br/> 
                        Политику использования данных
                        </b>  и <b> Политику <br/>
                        в отношении файлов cookie.</b>
                    </p>
                    { (odata.error) ? (
                        <p className="error">{odata.error}</p>
                    ) : "" }
                </form>
                <div className="to-login">
                    Есть аккаунт? <Link to="/login">Вход</Link>
                </div>
                <div className="apps">
                    <p>Установите приложение</p>
                    <div>
                        <img src="../img/appstore.bmp" alt=""/>
                        <img src="../img/playmarket.bmp" alt=""/>
                    </div>
                </div>
            </div>
            <div className="links">
                <a href="#">Meta</a>  
                <a href="#">Информатция</a>  
                <a href="#">Помощь</a>  
                <a href="#">Просса</a>  
                <a href="#">API</a>  
                <a href="#">Вакансии</a>  
                <a href="#">Конфиденщальность</a>  
                <a href="#">Условия</a>  
                <a href="#">Популярные аккаунты</a>  
                <a href="#">Хештеги</a> 
                <a href="#">Места</a>  
                <a href="#">Instagram Lite</a>  
                <br/>
                <p><a href="#">Язык</a>  &copy; 2021 INSTAGRAM FROM META</p>
            </div>
        </React.Fragment>
    );
}

export default Signup;