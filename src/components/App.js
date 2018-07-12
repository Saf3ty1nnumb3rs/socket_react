import React, { Component } from "react";
import More from "react-icons/lib/fa/bars";
import Send from "react-icons/lib/md/send";
import { socketOn, socketEmit } from "../helpers/socketEvents";
import { sidebarOpen } from "../helpers/sidebarToggle";
import LoginPage from "./LoginPage";
import SidebarLeft from "./SidebarLeft";
import Message from "./Message";
import MyMessage from "./MyMessage";
import io from 'socket.io-client';


// const socketUrl = "http://localhost:3001"

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      users: [],
      room: null,
      rooms: [],
      // socket: null
    };


    this.sendMessage = this.sendMessage.bind(this);
    this.switchRoom = this.switchRoom.bind(this);

    socketOn.updateUser(user => {
      this.setState({ user });
    });

    socketOn.updateUsers(users => {
      this.setState({ users });
    });

    socketOn.updateRoom(room => {
      this.setState({ room: room.name });
    });

    socketOn.updateRooms(rooms => {
      this.setState({ rooms });
    });
  }
    

  componentDidMount() {
    // this.initSocket()
    console.log('App did mount')
  }

  // initSocket = () => {
  //   const socket = io(socketUrl)
  //   socket.on('connect',()=> {
  //     console.log('Connected')
  //   })
  //   console.log(socket)
  //   this.setState( {socket} )
  // }

  componentDidUpdate() {
    const messages = document.getElementsByClassName("messages")[0];

    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }
  
  static openSidebar = () => {
    sidebarOpen();
  };

  sendMessage = event => {
    event.preventDefault();

    const text = event.target.elements.text.value.trim();

    if (text) {
      socketEmit.clientMessage(text, this.state.room);

      event.target.elements.text.value = "";
    }
  };

  switchRoom = room => {
    this.setState({ room });
  };

  render() {
    const currentRoom = this.state.rooms.find(
      room => room.name === this.state.room
    );

    if (!this.state.user) {
      return <LoginPage user={this.state.user} />;
    }

    return (
      <div className="chat-app">
        <SidebarLeft
          user={this.state.user}
          users={this.state.users}
          rooms={this.state.rooms}
          switchRoom={this.switchRoom}
        />
        <div className="chat-content">
          <div className="topbar">
            <div className="more">
              <button
                onClick={() => App.openSidebar()} 
                title="Show public chats & online users"
              >
                <More className="icon" size="22px" />
              </button>
            </div>
            <div className="room-info">
              <p className="room-name">{this.state.room}</p>
              <p className="room-users">
                {this.state.room &&
                  (currentRoom.users.join(", ").length > 30
                    ? `${currentRoom.users.join(", ").slice(0, 30)}...`
                    : currentRoom.users.join(", "))}
              </p>
            </div>
            <div className="themes">
            </div>
          </div>
          <div className="messages">
            {this.state.room && currentRoom.messages.map((message, i) => {
              if (message.sender.name === this.state.user.name) {
                return <MyMessage key={i} message={message} />;
              }

              return <Message key={i} message={message} />;
            })}
          </div>
          <div className="chat-input">
            <form onSubmit={event => this.sendMessage(event)}>
              <input
                type="text"
                name="text"
                placeholder="Message..."
                spellCheck="false"
                autoFocus
                autoComplete="off"
              />
              <button>
                <Send className="send-icon" size="24px" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


