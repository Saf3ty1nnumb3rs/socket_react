import React, { Component } from "react";
import More from "react-icons/lib/fa/bars";
import Send from "react-icons/lib/md/send";
import { socketOn, socketEmit } from "../helpers/socketEvents";
import { sidebarOpen } from "../helpers/sidebarToggle";
import LoginPage from "./LoginPage";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import Message from "./Message";
import MyMessage from "./MyMessage";

import "../styles/App.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      users: [],
      room: null,
      rooms: []
    };

    socketOn.updateUser(user => {
      this.setState({ user });
    });

    socketOn.updateUsers(users => {
      this.setState({ users });
    });

    socketOn.updateRoom(room => {
      this.setState({ room });
    });

    socketOn.updateRooms(rooms => {
      this.setState({ rooms });
    });

    this.sendMessage = event => {
      event.preventDefault();

      const text = event.target.elements.text.value.trim();

      if (text) {
        socketEmit.clientMessage(text, this.state.room);

        event.target.elements.text.value = "";
      }
    };

    this.switchRoom = room => {
      this.setState({ room });
    };

    this.openSidebar = side => {
      sidebarOpen(side);
    };
  }

  componentDidUpdate() {
    const messages = document.getElementsByClassName("messages")[0];

    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  render() {
    const currentRoom = this.state.rooms.find(
      room => room.name === this.state.room
    );

    if (!this.state.user) {
      return <LoginPage />;
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
                onClick={() => this.openSidebar("left")}
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
          <SidebarRight />
        </div>
      </div>
    );
  }
}

export default App;
