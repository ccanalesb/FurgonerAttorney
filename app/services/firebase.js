import * as firebase from "firebase";

var config = {
    apiKey: "AIzaSyAtLq-HbsgKKhJWD8HC2EaWV2FMQMeSfJc",
    authDomain: "test-8c400.firebaseapp.com",
    databaseURL: "https://test-8c400.firebaseio.com",
    
  };
export const firebaseRef = firebase.initializeApp(config);