import Rebase from "re-base";
import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBW0iDy1Hx0Gn36iL1XCq0DwV_dQ_iqhfM",
  authDomain: "login-a09b3.firebaseapp.com",
  databaseURL: "https://login-a09b3.firebaseio.com",
  projectId: "login-a09b3",
  storageBucket: "login-a09b3.appspot.com",
  messagingSenderId: "486052664715"
};

const app = firebase.initializeApp(config);

const base = Rebase.createClass(app.database());

export default app;
