import React, { Component } from "react";

import "./navbar.css";
import app from "../config/base";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    app.auth().signOut();
  }

  render() {
    return (
      <div className="navbar">
        <nav>
          <div className="navWide">
            <div className="wideDiv">
              <h2>CURIEUX</h2>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
