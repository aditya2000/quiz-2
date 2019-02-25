import React, { Component } from "react";
import app from "../../config/base";
import './end.css';

class End extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.logout = this.logout.bind(this);
  }

  logout() {
    app.auth().signOut();
  }

  render() {
    return (
    <div className="end">
        <h1>Quiz Ended</h1>
        <button onClick={this.logout} class="btn3">
            Logout
          </button>
    </div>
    )
  }
}

export default End;