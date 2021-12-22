import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

// import  firebase  from "firebase/app";
// import  "firebase/firestore";

import { initializeApp } from "firebase/app";

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyDDfVh0lzOeJ7zP96XVhanF41awVscObss",
  authDomain: "food-project-fa77d.firebaseapp.com",
  projectId: "food-project-fa77d",
  storageBucket: "food-project-fa77d.appspot.com",
  messagingSenderId: "409470137325",
  appId: "1:409470137325:web:3d11086922e8ecfb212de4",
  measurementId: "G-CGCSL4CGJT"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

new Vue({
  vuetify,
  router,
  firebase,  
  render: h => h(App)
}).$mount('#app')
