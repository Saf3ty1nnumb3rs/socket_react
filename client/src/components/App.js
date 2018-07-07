import React,{ Component } from 'react';
import { socketOn, socketEmit} from '../helpers/socketEvents';
import { sidebarOpen } from '../helpers/sidebarToggle';
import LoginPage from './LoginPage';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import Message from './Message';
import MyMessage from './MyMessage';

import '../styles/App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      users: [],
      room: null,
      rooms: [],
    };

    socketOn.updateUser((user) => {
      this.setState({ user })
    });

    socketOn.updateUsers((users) => {
      this.setState({ users })
    });

    socketOn.updateRoom((room) => {
      this.setState( { room } )
    });

    socketOn.updateRooms((rooms) => {
      this.setState( { rooms } )
    });

    this.sendMessage = (event) => {
      event.preventDefault()

      const text = event.target.elements.text.value.trim();

      if(text) {
        socketEmit.clientMessage(text, this.state.room)

        event.target.elements.text.value = ''
      }
    };

    this.switchRoom = (room) => {
      this.setState( { room } )
    };

    this.openSidebar = (side) => {
      sidebarOpen(side);
    };
  }


  componentDidUpdate() {
    const messages = document.getElementsByClassName('messages')[0]

    if (messages) {
      messages.scrollTop = messages.scrollHeight
    }
  }

  render() {
    const currentRoom = this.state.rooms.find(room => room.name === this.state.room);

    if(!this.state.user) {
      return <LoginPage />
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
