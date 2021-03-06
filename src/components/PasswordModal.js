import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { socketEmit } from "../helpers/socketEvents";


class PasswordModal extends Component {
  state = {
    error: null
  };

  submitPassword = event => {
    event.preventDefault();

    const password = event.target.elements.password.value.trim();

    if (!password) {
      return this.setState({ error: "Password is required" });
    }
    socketEmit.joinRoom(this.props.roomName, password, err => {
      this.setState({ error: err });

      if (!this.state.error) {
        this.props.onRequestClose();
      }
    });
    event.target.elements.password.value = "";
  };
  render() {
    return (
      <Modal
        className="password-modal"
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
      >
      <form onSubmit={this.submitPassword}>
          <h3>Join Chat</h3>
          <p className="error">{this.state.error}</p>
          <p>Password</p>
          <input type="password" name="password" autoFocus autoComplete="off" />
          <button type="submit" className="button-text">Join</button>
      </form>
      </Modal>
    );
  }
}

PasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    roomName: PropTypes.string,
  };
  
  PasswordModal.defaultProps = {
    roomName: '',
  };
  
export default PasswordModal;
