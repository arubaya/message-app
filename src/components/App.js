// Import React
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// Import CSS
import '../styles/App.css';

// Import Component
import AppBodyChat from './AppBodyChat.js';
import Chat from './Chat.js';

// Import Material UI
import ChatIcon from '@material-ui/icons/Chat';
import PeopleIcon from '@material-ui/icons/People';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { Avatar, IconButton, Menu, MenuItem, Button } from '@material-ui/core';

// Import Other
import Cookies from 'js-cookie';
import { useStateValue } from '../StateProvider.js';
import db, { auth, provider } from '../firebase.js';
import { actionTypes } from '../reducer.js';

function App() {

  const [login, setLogin] = useState(false);
  
  const cookie = Cookies.getJSON("USER_LOGIN");
  // const [ { } ,dispatch] = useStateValue();

  useEffect(() => {
    const user = Cookies.get("USER_LOGIN")
    if (user) {
      setLogin(true)
      // db.collection("member").doc(`${cookie.uid}`).onSnapshot((snapshot) => {
      //   dispatch({
      //     type: actionTypes.SET_USER,
      //     user: {
      //       name: `${snapshot.data().name}`,
      //       photo: `${snapshot.data().photo}`,
      //       online: `${snapshot.data().online}`,
      //     }
      //   })
      // })
    } else {
      setLogin(false)
    }
  }, [])

  
  

  const ProtectedRoute = ({authentication, component:Component, ...rest}) => {
    return(
      <Route
      {...rest}
      render={() =>authentication ? 
        (<Component />)
      : (<Redirect to="/login" />)}
      /> 
    )
  }
  const Protectedlogin = ({authentication, component:Component, ...rest}) => {
    return(
      <Route
      {...rest}
      render={() =>!authentication ? 
        (<Component />)
      : (<Redirect to="/chats" />)}
      /> 
    )
  }

  // APP Component
const AppBody = () => {

    const [rooms, setRooms] = useState([]);

    
    const [anchorEl, setAnchorEl] = useState(null)
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }
    
    const [user, setUser] = useState([]);
    useEffect(() => {
      db.collection("member").doc(`${cookie}`).onSnapshot((snapshot) => {
        setUser({
          name: `${snapshot.data().name}`,
          photo: `${snapshot.data().photo}`,
        })  
      })
    }, [])


    useEffect(() => {
        const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => 
            setRooms(snapshot.docs.map((doc) => 
                ({
                    id: doc.id,
                    data: doc.data(),
                })    
            ))
        );
  
        return () => {
            unsubscribe();
        }
    }, []);
  
    const logout = () => {
        handleClose()
        Cookies.remove("USER_LOGIN")
        setLogin(false)
    }
  
    return (
        <div className="app">
            <div className="app_header">
                <Avatar src={user.photo} />
                <div className="app_headerRight">
                    <IconButton>
                        <PeopleIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={handleClick} aria-haspopup="true" aria-controls="menu" >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
            <div className="app_search">
                <div className="app_searchContainer">
                    <SearchOutlinedIcon />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>
            <div className="app_chats">
                <AppBodyChat addNewChat/>
                {rooms.map((room) => (
                    <AppBodyChat key={room.id} id={room.id} name={room.data.name} />
                ))}
            </div>
        </div>
    )
  }

  // Login Component
const Login = () => {
  
    const signIn = () => {
        auth.signInWithPopup(provider)
        .then(result => {

            // Cookies.set("USER_LOGIN", {
            //   uid: `${result.user.uid}`,
            //   name: `${result.user.displayName}`,
            //   photo: `${result.user.photoURL}`,
            // })
            Cookies.set("USER_LOGIN", `${result.user.uid}`)

            db.collection("member").onSnapshot(snapshot => {
              snapshot.docs.map(doc => {
                if (`${doc.id}` !== `${result.user.id}`) {
                  db.collection("member").doc(`${result.user.uid}`).set({
                      name: `${result.user.displayName}`,
                      photo: `${result.user.photoURL}`, 
                      online: false
                    })
                }
              })
            })
            setLogin(true)
            
        })
        .catch(error => alert(error.message))
    };
  
    return (
        <div className="login">
            <div className="login_container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Logo" />
                <div className="login_text">
                    <h1>Sign in to WhatsApp</h1>
                </div>
                <Button type="submit" onClick={signIn}>
                    Sign in with Google
                </Button>
            </div>
            
        </div>
    )
  }

  return (
    <div>
      <Router>
        <Switch>
          <Protectedlogin path="/login" authentication={login} component={Login} />
          <ProtectedRoute path="/chats" authentication={login} component={AppBody} />
          <Route path="/rooms/:roomId" component={Chat} />
          <Route path="/">
            <Redirect to="/chats" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
