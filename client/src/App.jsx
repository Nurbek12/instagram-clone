import React,{useEffect, createContext, useReducer, useContext} from 'react';
// import Navbar from './components/Navbar';
import Chat from './components/screens/Chat';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import AllRecPosts from './components/screens/AllRecPosts';
import SubsUserPost from './components/screens/SubsUserPost';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import './style.css';
import {reducer, initialState} from './reducers/userReducer';

export const UserContext = createContext();

const Routing = () => {
    const history = useHistory();
    const {state, dispatch} = useContext(UserContext);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log(user);
        if(user){
            dispatch({ type: "USER", payload: user });
            // history.push('/');
        }else{
            history.push('/signup')
        }
    }, []);

    return(
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/signup">
                <Signup />
            </Route>
            <Route exact path="/profile">
                <Profile />
            </Route>
            <Route path="/createpost">
                <CreatePost />
            </Route> 
            <Route path="/profile/:userid">
                <UserProfile />
            </Route>
            <Route path="/myfollowespost">
                <SubsUserPost />
            </Route>
            <Route path="/allposts">
                <AllRecPosts />
            </Route>
            <Route path="/chat">
                <Chat />
            </Route>
        </Switch>
    )
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <div className='container'>
                <div className="errobox"></div>
                <BrowserRouter>
                    {/* <Navbar /> */}
                    <Routing />
                </BrowserRouter>
            </div>
        </UserContext.Provider>
    );
}

export default App;