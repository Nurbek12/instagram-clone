import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import AlertMes from './Alert';
 
function Login() {
    const {state, dispatch} = useContext(UserContext);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [odata, setOdata] = useState([]);
    const history = useHistory();
    const PostData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) ){
        //    setOdata("Неправильный адрес электронной почта");
            AlertMes("Неправильный адрес электронной почта", "error");
            return;
        }
        
        fetch('/signin', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        })
        .then(resp => resp.json())
        .then(data => {
            // console.log(data);
            setOdata(data);
            if(data.error){
                AlertMes(data.error, "error");
            }else{
                localStorage.setItem('jwt', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch({ type: "USER", payload: data.user });
                AlertMes("Успешной вход", "success");
                history.push('/');
            }
        }).catch(err => {
            console.log(err);
        })

    }

    return (
        <React.Fragment>
            <div className="content log">
                <form action="#">
                    <h1 className="title">Instagram</h1>
                    <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Телефон, имя пользователя или эл. адрес" />
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Парол"/>
                    <button onClick={ PostData } className="btn" type="button">Войти</button>
                    <span>ИЛИ</span>
                    <button className="btn btn-o" type="button"><i className="fa fa-facebook-square"></i> Войти через Facebook</button>
                    <a href="#">Забыли парол?</a>
                    { (odata.error) ? (
                        <p className="error">{odata.error}</p>
                    ) : "" }
                </form>
                <div className="to-login">
                    У вас ещё нет аккаунт? <Link to="/signup">Зарегистрироваться</Link>
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

export default Login;