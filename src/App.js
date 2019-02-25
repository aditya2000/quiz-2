import React, { Component } from "react";
import Quiz from "./components/quiz/quiz";
import "./App.css";
import app from "./config/base";
import Login from "./Login";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        // localStorage.setItem("user", user.uid);
      } else {
        this.setState({ user: null });
        //localStorage.removeItem("user");
      }
    });
  }

  render() {
    return <div className="App">{this.state.user ? <Quiz /> : <Login />}</div>;
  }
}

export default App;
