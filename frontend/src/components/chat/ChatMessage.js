import { React } from "react"
import './ChatMessage.css';
import Avatar from "./Avatar.js";
import Message from "./Message.js";
  
const ChatMessage = ({ isUser, message }) => {
    // const { isUser, avatarStyle, seed, message, logo } = this.props.args;
    // const avatarUrl = !!logo ? logo: `https://api.dicebear.com/5.x/${avatarStyle}/svg?seed=${seed}`;
    // const { theme } = '';
    
    // if (!theme) {
    //   return <div>Theme is undefined, please check streamlit version.</div>
    // }
  
    // set CSS variables for theme
    let body = document.querySelector('body')
    body?.style.setProperty('--secondary-bg-color', '#e2e2e2')
    body?.style.setProperty('--bg-color', '#eee')
    body?.style.setProperty('--primary-color', 'red')
    body?.style.setProperty('--text-color', 'black')
    // body?.style.setProperty('--font', '')
    

    return (
      <Message isUser={isUser} avatar='user'>
        {/* <Avatar src={avatarUrl}/> */}
        <div>{message}</div>
      </Message>
    );
  }

export default ChatMessage;
