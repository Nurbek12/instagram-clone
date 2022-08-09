import React, {  useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from '../App';

const Navbar = () => {
    const {state} = useContext(UserContext);
    const [srch, setSrch] = useState(false);
    const [searc, setSeacr] = useState(""); 
    const [users, setUsers] = useState([]);
    const SearchModal = useRef(null);

    const SearchUsers = (qry) => {
        // /setSeacr
        setSeacr(qry);
        fetch('/searchuser',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: qry
            })
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            setUsers(result.user);
        })
    }

    return(
        <header>
            <nav>
                <Link to="/" className="logo">Instagram</Link>
                <div className="search" onBlur={() => {
                    setTimeout(() => {
                        setSrch(false)
                    },1000)
                    }}>
                    <i className="fa fa-search"></i>
                    <input type="text" placeholder="Поиск"
                    onChange={e => SearchUsers(e.target.value)}
                    value={searc}
                    onFocus={() => setSrch(true)}
                    
                    ref={SearchModal}  />
                    <div id="searchRes"></div>
                    {
                        srch?
                        (
                        <div className="search-container">
                            <div className="search-list">
                                {
                                    users.map(user => { 
                                        return(
                                            <Link to={user._id !== state._id?'/profile/'+user._id:"/profile"} key={user._id}>
                                            <div className="user" >
                                                <img src={user.photo} alt="" />
                                                <h2>
                                                    <b>{user.username}</b><br /><span>{user.name}</span>
                                                </h2>
                                            </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        ):""
                    }
                </div>
                <ul className="nav-items">
                    <li className="item"><Link to="/"><i className="fa fa-home"></i></Link></li>
                    <li className="item"><Link to="/chat"><i className="fa fa-comments-o"></i></Link></li>
                    <li className="item"><Link to="/createpost"><i className="fa fa-plus-square-o"></i></Link></li>
                    <li className="item"><Link to="/allposts"><i className="fa fa-compass"></i></Link></li>
                    <li className="item"><Link to="/myfollowespost"><i className="fa fa-heart-o"></i></Link></li>
                    <li className="item"><Link to="/profile"><img src={state?state.photo:'/nophoto.png'} alt="" /></Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar