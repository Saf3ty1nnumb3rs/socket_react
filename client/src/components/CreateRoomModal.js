import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { socketEmit } from "../helpers/socketEvents";

class CreateRoomModal extends Component {
  state = {
    error: null
  };

  createRoom = event => {
    event.preventDefault();

    const roomName = event.target.elements.roomName.value.trim();
    const password = event.target.elements.password.value.trim();

    if (!roomName) {
      return this.setState({ error: "Room name is required" });
    }

    socketEmit.joinRoom(roomName, password);

    event.target.elements.roomName.value = "";
    event.target.elements.password.value = "";

    this.props.onRequestClose();
  };
  render() {
    return (
      
        <Modal
          className="create-room-modal"
          isOpen={this.props.isOpen}
          onRequestClose={this.props.onRequestClose}
        >
          <form onSubmit={this.createRoom}>
            <h3>Create New Room</h3>
            <p className="error">{this.state.error}</p>
            <p>Room Name</p>
            <input
              type="text"
              name="roomName"
              maxLength="20"
              autoFocus
              autoComplete="off"
            />
            <p>Password (optional)</p>
            <input type="password" name="password" />
            <button type="submit" className="button-text">
              Create
            </button>
          </form>
        </Modal>
      
    );
  }
}

CreateRoomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

export default CreateRoomModal;

