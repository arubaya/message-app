import React, {useEffect, useState} from 'react'
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';

import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SendIcon from '@material-ui/icons/Send';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import '../styles/Chat.css'
import { useParams, useHistory } from 'react-router-dom';
import db from '../firebase';
import firebase from 'firebase';
import Cookies from 'js-cookie';
import Scroll from './Scroll.js'


function Chat() {

    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const {roomId} = useParams();
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState("");

    const cookie = Cookies.getJSON("USER_LOGIN");

    const [anchorEl, setAnchorEl] = useState(null)
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const history = useHistory()

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
        if(roomId) {
            db.collection('rooms')
                .doc(roomId)
                .onSnapshot(snapshot => (
                setRoomName(snapshot.data().name)
            ));
            db.collection('rooms')
                .doc(roomId)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => (
                    setMessages(snapshot.docs.map(doc => 
                        doc.data())
                    )
                ))
        }
    }, [roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [roomId])

    const sendMessage = (e) => {
        e.preventDefault();
        // console.log(`you typed >> ${input}`);

        db.collection('rooms')
            .doc(roomId)
            .collection('messages')
            .add({
                message: input,
                name: user.name,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })

        setInput("")
    }

    const deleteRoom = () => {
        let r = window.confirm(`Room chat ${roomName} akan dihapus. yakin?`);
        handleClose()
        if (r) {
            history.push("/chats")
            alert("Dihapus")
            // window.setTimeout(() => {db.collection('rooms').doc(roomId).delete()}, 3000);
        }
    }

    return (
        <div className="chat"> 
            <div className="chat_header">
                <IconButton>
                    <ArrowBackIcon onClick={() => {history.push("/chats")}} />
                </IconButton>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="chat_headerInfo">
                    <h3>{roomName}</h3>
                </div> 
                <div className="chat_headerRight">
                    <IconButton color="inherit">
                        <SearchOutlinedIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleClick} aria-haspopup="true" aria-controls="menu" >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        color="inherit"
                    >
                        <MenuItem onClick={deleteRoom}>Delete room</MenuItem>
                    </Menu>
                </div>
            </div>
            
            <div className="chat_body">
                {messages.map((message) => (
                    <div className={`chat_messageContainer ${message.name === user.name && "chat_receiver"}`}>
                        <p className={`chat_name ${message.name === user.name && "chat_receiverName"}`}>
                            {message.name}
                        </p>
                        <div className={`chat_message ${message.name === user.name && "chat_receiverMessage"}`}>
                            {message.message}
                            <p className="chat_timestamp">
                                {new Date(message.timestamp?.toDate()).toUTCString()}
                            </p>
                        </div>
                    </div>
                ))}
                <Scroll />
            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon />
                <form onSubmit={sendMessage}>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" type="text" />
                    <IconButton color="inherit">
                        <SendIcon onClick={sendMessage} type="submit" />
                    </IconButton>
                    {/* <button onClick={sendMessage} type="submit">Send a message</button> */}
                </form>
                {/* <MicIcon /> */}
            </div>
        </div>
    )
}

export default Chat 
// ; isTypingName(cookie.user, e.target.value)}