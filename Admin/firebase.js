const firebaseConfig = {
  apiKey: "AIzaSyAoe8rNw_Ti-StzB0ERzdsGpJ1CKjmiEMU",
  authDomain: "aether-sovereign.firebaseapp.com",
  projectId: "aether-sovereign",
  storageBucket: "aether-sovereign.firebasestorage.app",
  messagingSenderId: "461248328418",
  appId: "1:461248328418:web:1d767ddb136c2f6f7464bb",
  measurementId: "G-X7LBQST23N"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.firestore();