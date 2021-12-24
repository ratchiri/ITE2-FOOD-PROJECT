<template>
  <v-app id="inspire">
    <v-app-bar app color="success" dark>
      <div class="d-flex align-center">
        

      

        <v-toolbar-title class="pointer" @click="goto('/Calendar')">Calendar list </v-toolbar-title>
        &nbsp;&nbsp;
        &nbsp;&nbsp;


        <v-toolbar-title   depressed class="pointer" @click="goto('/')">Food Storage </v-toolbar-title>
        &nbsp;&nbsp;
        &nbsp;&nbsp;

        <v-toolbar-title   depressed class="pointer" @click="goto('/Food')">Ingredient</v-toolbar-title>&nbsp;&nbsp;
        &nbsp;&nbsp;
        &nbsp;&nbsp;
      

        <v-btn v-if="!signInState" depressed color="success" @click="goto('/signinform')">Sign In</v-btn>

        <v-btn v-if="signInState" depressed color="success" @click="SignOut">Sign Out</v-btn>
        &nbsp;&nbsp;
        &nbsp;&nbsp;

    


      </div>

      <v-spacer></v-spacer>

      <!-- <v-toolbar-items class="hidden-sm-and-down">
        <v-btn depressed color="success" @click="goto('/crudfirestore')">Firestore</v-btn>
        <v-btn v-if="signInState" to="/profile" target="_blank" text class="hidden-sm-and-down">
          <span class="mr-2">Profile</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-toolbar-items> -->

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
    </v-app-bar>


    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            src="https://stickershop.line-scdn.net/stickershop/v1/product/1405071/LINEStorePC/main.png;compress=true"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Panda</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title @click="goto(item.link)">
              {{
                item.title
              }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
export default {
  name: "App",

  data: () => ({
    drawer: null,
    items: [
      { title: "Home", icon: "mdi-view-dashboard", link: "/" },
      { title: "Profile", icon: "mdi-forum", link: "/profile" },
    ],
    signInState: false,
    Admin: false,
  }),

  methods: {
    goto(path) {
      this.$router.push(path);
    },
    menuItems() {
      return this.menu;
    },
    SignOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful. 
          this.$router.push({ path: "/signinform" });
        })
        .catch((error) => {
          // An error happened. 
          console.log(error);
        });
    },
    authStateChanged() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties 
          // https://firebase.google.com/docs/reference/js/firebase.User 
          console.log(user);
          this.signInState = true;

        } else {
          this.signInState = false;
          // User is signed out 
          // ... 
        }
      });
    },

  },
  mounted() {
    this.authStateChanged();
  },
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>

.pointer {
  cursor: pointer;
}
