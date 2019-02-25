import React, { Component } from "react";
import "./quiz.css";
import app from "../../config/base";
import firebase from "../../config/base";
import Navbar from "../navbar";
import End from '../end/end';

import md5 from "crypto-js/md5";
//import { AutoSizer, Column, SortDirection, Table } from "react-virtualized";

const Row = ({ points, level, splittime, name }) => (
  <div className="row">
    <div>{points}</div>
    <div>{level}</div>
    <div>{splittime}</div>
    <div>{name}</div>
  </div>
);

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: [],
      numOfQuestions: 0,
      level: 1,
      answer: "",
      correct: false,
      hints: [],
      data2: [],
      points: 0,
      timer: 0,
      name: "",
      lastsolved: 0,
      flag: 0
    };

    this.getQuizData = this.getQuizData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
    this.compareBy.bind(this);
    this.sortBy.bind(this);
    this.updateLevel = this.updateLevel.bind(this);
    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true
    });
  }

  componentDidMount() {
    this.updateLevel();
    //this.getQuizData();
  }

  componentWillMount() {}

  logout() {
    app.auth().signOut();
  }
  compareBy(key) {
    return function(a, b) {
      if (a[key] > b[key]) return -1;
      if (a[key] < b[key]) return 1;
      return 0;
    };
  }

  sortBy(key) {
    let arrayCopy = [...this.state.data2];
    arrayCopy.sort(this.compareBy(key));
    this.setState({ data2: arrayCopy });
  }

  updateLevel() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.db
          .collection("users")
          .where("userid", "==", firebase.auth().currentUser.uid)
          .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
              var newLevel = doc.data().level;
              var newPoints = doc.data().points;
              this.setState(
                {
                  level: newLevel,
                  points: newPoints
                },
                () => {
                  this.getQuizData();
                  this.setState({
                    timer: 0
                  });
                  setTimeout(() => {
                    this.setState({
                      timer: 1
                    });
                  }, 5000);
                  setTimeout(() => {
                    this.setState({
                      timer: 2
                    });
                  }, 10000);
                }
              );
            });
          });
      } else {
        console.log("USER NOT LOGGED IN");
      }
    });
  }

  getQuizData() {
    this.db.collection("users")
            .where("userid", "==", firebase.auth().currentUser.uid)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                 this.setState({
                   lastsolved: doc.data().lastsolved,
                   flag :1
                   
                })
                console.log("current"+Number(Math.round(new Date().getTime() / 1000)))
                console.log("last"+this.state.lastsolved)
              });
            });
    this.db
      .collection("questions")
      .where("level", "==", this.state.level.toString())
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState(
            prev => ({
              quiz: [doc.data()],
              numOfQuestions: doc.data().length
            }),
            () => {
              //console.log(this.state.quiz)
              var hints = [];
              this.state.quiz.forEach(quest => {
                if (quest.level == this.state.level) {
                  hints = quest.hints;
                }
              });
              this.setState({
                hints: hints
              });
            }
          );
        });
      });
    this.setState({
      data2: []
    });
    this.db
      .collection("users")

      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            data2: [...this.state.data2, doc.data()]
          });
          //console.log(doc.data());
        });
      });
    //console.log(this.state.data2);
    this.db
      .collection("users")
      .where("userid", "==", firebase.auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc =>
          this.setState({
            name: doc.data().name
          })
        );
      });
  }

  handleChange(e) {
    this.setState({
      answer: e.target.value
    });
  }

  handleSubmit(e) {
    // console.log("OO", this.state.data2);
    e.preventDefault();
    this.state.quiz.map(question => {
      if (this.state.level.toString() === question.level) {
        let ans = md5(this.state.answer.toLowerCase());
        // console.log(ans.words[0]);
        if (ans.words[0] == question.answer) {
          alert("You're right!!");
          var size = 0;
          const db = this.db;
          db.collection("users")
            .where("level", ">=", this.state.level)
            .get()
            .then(snap => {
              snap = snap.size;
              size = snap;
            });
          if (size < 10) {
            db.collection("users")
              .where("userid", "==", firebase.auth().currentUser.uid)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  db.collection("users")
                    .doc(doc.id)
                    .update({
                      points: this.state.points + 10
                    });
                });
              });
          } else if (size < 15) {
            db.collection("users")
              .where("userid", "==", firebase.auth().currentUser.uid)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  db.collection("users")
                    .doc(doc.id)
                    .update({
                      points: this.state.points + 9
                    });
                });
              });
          } else {
            db.collection("users")
              .where("userid", "==", firebase.auth().currentUser.uid)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  db.collection("users")
                    .doc(doc.id)
                    .update({
                      points: this.state.points + 8
                    });
                });
              });
          }

          this.setState(prev => ({
            level: prev.level + 1
          }));

          const state = this.state;

          db.collection("users")
            .where("userid", "==", firebase.auth().currentUser.uid)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                db.collection("users")
                  .doc(doc.id)
                  .update({
                    level: state.level + 1
                  });
              });
            });
          var d = Number(Math.round(new Date().getTime() / 1000));
          db.collection("users")
            .where("userid", "==", firebase.auth().currentUser.uid)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                db.collection("users")
                  .doc(doc.id)
                  .update({
                    lastsolved: d
                  });
                  // console.log(d)
              });
            });

          var docRef = db
            .collection("firstsolved")
            .doc(this.state.level.toString());

          docRef
            .get()
            .then(doc => {
              if (doc.exists) {
                if (doc.data().time == null) {
                  docRef.update({
                    time: d
                  });

                  db.collection("users")
                    .where("userid", "==", firebase.auth().currentUser.uid)
                    .get()
                    .then(querySnapshot => {
                      querySnapshot.forEach(doc => {
                        db.collection("users")
                          .doc(doc.id)
                          .update({
                            splittime: 0
                          });
                      });
                    });
                } else {
                  var time_first = doc.data().time;

                  db.collection("users")
                    .where("userid", "==", firebase.auth().currentUser.uid)
                    .get()
                    .then(querySnapshot => {
                      querySnapshot.forEach(doc => {
                        db.collection("users")
                          .doc(doc.id)
                          .update({
                            splittime: doc.data().lastsolved - time_first
                          });
                        console.log("lastsolved =>", doc.data().lastsolved);
                        this.setState({
                          lastsolved :doc.data().lastsolved
                        })
                        console.log("timefirst =>", time_first);
                      });
                    });

                  // db.collection("users")
                  //   .where("userid", "==", firebase.auth().currentUser.uid)
                  //   .get()
                  //   .then(querySnapshot => {
                  //     querySnapshot.forEach(doc =>
                  //        console.log("Look:", doc.data().splittime)
                  //     );
                  //   });
                }
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            .catch(function(error) {
              console.log("Error getting document:", error);
            });
        } else {
          alert("Wrong");
        }
      }
    });
  }

  render() {
    const rows = this.state.data2.map(rowData => <Row {...rowData} />);
    var date_end = new Date();
    return (
      <div className="quizApp">
        <Navbar />
        {this.state.level>=40|| (date_end.getDate()>=26 && date_end.getHours()>=21)?(<End/>):(<div>
          <div className="quiz">
          <h1>CONFUNDO</h1>
          <h2>WELCOME {this.state.name} </h2>
          <button onClick={this.logout} class="btn3">
            Logout
          </button>
          {this.state.quiz.map(question => {
            if (this.state.level.toString() === question.level) {
              return (
                <div key={Math.random()}>
                  <div class="polaroid">
                    <p class="container">LEVEL : {question.level}</p>
                    <img src={question.question} alt="question" class="image" />
                  </div>
                </div>
              );
            } else {
              return <div key={Math.random()} />;
            }
          })}

          <h3 class="hint">Hints</h3>
          <div class="hints">
            <h3>Hints</h3>
            <p key={Math.random()}>{this.state.hints[0]}</p>
            {this.state.flag===1?(<div> {Number(Math.round(new Date().getTime() / 1000)) >= this.state.lastsolved+ 60? (
              <p key={Math.random()}>{this.state.hints[1]}</p>
            ) : (
              <p key={Math.random()} />
            )}</div>):(<div></div>)}
            {this.state.flag===1?(<div>{Number(Math.round(new Date().getTime() / 1000)) >= this.state.lastsolved+100 ? (
              <p key={Math.random()}>{this.state.hints[2]}</p>
            ) : (
              <p key={Math.random()} />
            )}</div>):(<div></div>)}
          </div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Enter your answer"
              onChange={this.handleChange}
              class="ans"
            />
            <input type="submit" value="Submit" class="btn3" />
          </form>
        </div>
        <div class="footer2">
          <h2>
            Check out our Facebook page for bonus hints.
            <a
              href="https://www.facebook.com/curieuxsgtbkhalsa/"
              target="_blank"
            >
              <img
                src="http://cofarming.info/wp-content/uploads/2017/01/facebook-icon-preview-1-400x400.png"
                class="icon"
                alt="img"
              />
            </a>
          </h2>
        </div>
        <div class="table">
          <div class="header">
            <div onClick={() => this.sortBy("points")}>points</div>
            <div onClick={() => this.sortBy("level")}>level</div>
            <div onClick={() => this.sortBy("splittime")}>splittime</div>
            <div onClick={() => this.sortBy("name")}>name</div>
          </div>
          <div class="body">{rows}</div>
        </div>
        <div class="rules">
            <h1>Rules</h1>
            <ul>
              <li>For interaction with the organizers there would be organizer managed Facebook page</li>
              <li>Only alphabets and numbers are allowed.(No special characters)</li>
              <li>Any attempt of hacking will lead to automatic disqualification.</li>
              <li>If admin realizes that any participant has used any kind of unfair means to clear any level then the admin is liable to block the user without any prior notice to anyone and admin will be unquestionable.</li>
              <li>Point Scheme will be as follows: 
                <ol>
                  <li>First 10 players to clear the level will get 10 points.</li>
                  <li>Next 15 players will get 9 points.</li>
                  <li>Remaining players to clear that level will get 8 points.</li>
                </ol>
              </li>
              <li>Only one prize will be awarded: 
                <ol>
                  <li>The prize will go to the first player completing all the levels irrespective of points and split time.</li>
                  <li> If no one is able to complete all the levels and the event ends, the player with maximum level will win. If levels are same then points will be considered and if points are same then split time will be considered in deciding the winner.</li>
                </ol>
              </li>
            </ul>
        </div>
        </div>)}
      </div>
    );
  }
}

export default Quiz;
