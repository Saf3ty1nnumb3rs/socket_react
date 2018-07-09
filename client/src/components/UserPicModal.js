import React, { Component } from "react";
import Modal from "react-modal";
import axios from "axios";
import PropTypes from "prop-types";
import { socketEmit } from "../helpers/socketEvents";

class UserPicModal extends Component {
  state = {
    error: null
  };

  previewPic = input => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = event => {
        const preview = document.getElementById("preview");
        preview.src = event.target.result;
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  uploadPic = event => {
    event.preventDefault();

    const data = new FormData();
    const inputfile = document.getElementById("inputfile");

    data.append("id", this.props.user.id);
    data.append("userPic", inputfile.files[0]);

    axios
      .post("api/userPic", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
        socketEmit.getUserPic();
        this.props.onRequestClose();
      })
      .catch(() => {
        this.setState({
          error: "Acceptable formats: .jpg, .png or .gif, less than 5MB"
        });
      });
  };

  render() {
    return (
      <Modal
        className="avatar-modal"
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
      >
        <form onSubmit={event => this.uploadPic(event)}>
          <h3>Set Profile</h3>
          <p className="error">{this.state.error}</p>
          <img id="preview" src={this.props.user.avatar} alt="avatar" />
          <input
            id="inputfile"
            name="avatar"
            type="file"
            onChange={() =>
              this.previewPic(document.getElementById("inputfile"))
            }
          />
          <button type="submit" className="button-text">
            Confirm
          </button>
        </form>
      </Modal>
    );
  }
}

UserPicModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    userPic: PropTypes.string,
    rooms: PropTypes.array
  }).isRequired
};

export default UserPicModal;
