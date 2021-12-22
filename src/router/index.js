import Vue from "vue";
import VueRouter from "vue-router";
import About from "../views/About.vue";

import Home from "../views/Food.vue" 
import SigninForm from "../views/SigninForm.vue" 
import Profile from "../views/Profile.vue" 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Calendar from "../views/Calendar.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { 
      requiresAuth: true, },
  },


  {
    path: "/signinform",
    name: "Sign in Form",
    component: SigninForm,
  },

  


  

  {
    path: "/Calendar",
    name: "Calendar",
    component: Calendar,
  },
  
  
  
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { 
      requiresAuth: true, },
  },

  
  
  
  {
    path: "/about",
    name: "About",
    component: About,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  // base: "/ite",
});


router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const auth = getAuth(); 
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next(); 
      } else { 
        next({ path: "/signinform" }); 
      } 
    }); 
  } else { 
    next(); 
  } 
});

export default router;
