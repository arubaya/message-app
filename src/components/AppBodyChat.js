// Import React
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

// Import Style
import '../styles/AppBodyChat.css';

// Import Material UI
import { Avatar } from '@material-ui/core';

// Import Other
import db from '../firebase';

function AppBodyChat({ id, name, addNewChat }) {

    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState("");
    
    useEffect(() => {
        if (id) {
            db.collection('rooms')
                .doc(id)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => (
                    setMessages(snapshot.docs.map(doc => 
                        doc.data()))
                ));
        }
    }, [id])


    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])

    const createChat = () => {
        const roomName = prompt("Please enter name for chat room:");

        if (roomName) {
            db.collection("rooms").add({
                name: roomName,
            })
        }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="appbodyChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="appbodyChat_info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message} </p>
                </div>
            </div>
        </Link>
    ): (
        <div onClick={createChat} className="appbodyChat">
            <h2>Add new chat</h2>
        </div>
    )
}

export default AppBodyChat
