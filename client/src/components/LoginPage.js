import React, { Component } from "react";
import { socketEmit } from "../helpers/socketEvents";
import App from './App'
class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      error: null
    };

    this.loginUser = this.loginUser.bind(this);
  }

  loginUser = event => {
    event.preventDefault();

    const userName = event.target.elements.userName.value.trim();
    console.log(userName);
    if (!userName) {
      this.setState({ error: "Please enter a username" });
    }
    socketEmit.joinUser(userName, err => {
      this.setState({ error: err });
    });

    event.target.elements.userName.value = "";
  };

  render() {
      console.log(this.props.user)
      if(this.props.user){
          
          return <App />
      }
    return (
      <div className="login-page">
        <div className="login-modal">
          <form onSubmit={this.loginUser}>
            <h3>Join Chat</h3>
            <p className="error">{this.state.error}</p>
            <p>Username</p>
            <input
              type="text"
              name="userName"
              maxLength="20"
              autoFocus
              autoComplete="off"
            />
            <button type="submit" className="button-text">
              Join
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginPage;

