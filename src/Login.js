import React, { Component } from "react";
import app from "./config/base";
import firebase from "./config/base";
import "./login.css";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },

  menu: {
    width: 200
  }
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    this.state = {
      email: "",
      password: "",
      name: ""
    };

    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true
    });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    app
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then()
      .catch(error => {
        alert(error);
      });
  }

  signup(e) {
    e.preventDefault();
    app
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(u => {
        this.db.collection("users").add({
          userid: firebase.auth().currentUser.uid,
          level: 1,
          lastsolved: 0,
          splittime: 0,
          points: 0,
          name: this.state.email
        });
      })
      .then(u => {
        //alert(u);
      })
      .catch(error => {
        alert(error);
      });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className="login">
        <p>
          ENTER A VALID EMAIL ADDRESS. BECAUSE THATS THE ONLY WAY TO CONTACT
          YOU. INCASE YOU WIN.
        </p>
        <p>FIRST SIGN UP, THEN LOGIN</p>
        <div className="header">
          <h1>CONFUNDO'19</h1>
        </div>

        <form className={classes.form}>
          <div class="form-group">
            <input
              value={this.state.email}
              onChange={this.handleChange}
              type="email"
              name="email"
              class="input"
              placeholder="Enter email"
              margin="normal"
              variant="filled"
            />
          </div>
          <div class="form-group">
            <input
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              name="password"
              class="input"
              placeholder="Password"
              margin="normal"
              variant="filled"
            />
          </div>
          <button type="submit" onClick={this.login} className="btn">
            Login
          </button>
          <button onClick={this.signup} className="btn">
            Signup
          </button>
        </form>
        <div id="#footer" className="footer">
          <p>
            Made with{" ❤️ "}
            <i className="fas fa-heart" style={{ color: "#dd1b3b" }} /> by{" "}
            <a href="https://github.com/dbhagesh" target="_blank">
              Bhagesh Dhankher
            </a>{" "}
            and{" "}
            <a href="https://github.com/aditya2000" target="_blank">
              Aditya Dehal
            </a>
          </p>
          <p>&copy; 2019 Curieux. All rights reserved.</p>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
