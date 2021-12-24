<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3 green123">
         List รายการสินค้า
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <template>
          <v-card>
            <v-card-title>
              รายการสินค้า
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="ListTable"
              :loading="!ListTable.length"
              :search="search"
            >
              <template slot="progress">
                <v-progress-linear
                  color="red"
                  indeterminate
                ></v-progress-linear>
              </template>

              

            

              <template v-slot:[`item.actions`]="{ item }">
                <v-icon large color="yellow darken-2" @click="editItem(item)"
                  >mdi-pencil-outline
                </v-icon>

                <v-icon large color="red darken-2" @click="deleteItem(item)"
                  >mdi-close-circle
                </v-icon>
              </template>
            </v-data-table>

            <div>

  <!-- Checkboxes list -->
  <ul>
    <li v-for='lang in langsdata' v-bind:key="lang.id">
     <input type='checkbox' v-bind:value='lang' v-model='languages' >{{ lang }}
    </li>
  </ul>

  <!-- Print -->
  <input type='button' @click='printValues()'  value='> เลือกสินค้า'>

  <br>
ยืนยันสินค้า : {{ selectedlang }}

</div>
          </v-card>
        </template>

        
      </v-col>
    </v-row>

   
    <v-col></v-col>


  </v-container>
</template>

<script>

import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc, 
  doc, deleteDoc, setDoc,
} from "firebase/firestore";


import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export default {
  data: () => ({
isCheckAll: false,
    langsdata: ["สินค้า A","สินค้า B","สินค้า C","สินค้า D"],
    languages: [],
    selectedlang: "",
      alert: true,


    ListTable: [
      {
        Firstname : "Rathaphoom",
        Lastname : "Topathomwong",
        note: "",
        price: 1000,
        amount: 10000,
      },
      
      {
        Firstname : "์Nattapat",
        Lastname : "Petchsuwan",
        note: "",
        price: 1000,
        amount: 10000,
      },
    ],

    search: "",
     headers: [
      {
        text: "Firstname",
        value: "Firstname",
      },
      {
        text: "Lastname",
        value: "Lastname",
      },
     
  
      {
        text: "จำนวน",
        value: "amount",
      },
      

      {
        text: "Price",
        value: "price",
      },


        {
        text: "Note",
        value: "note",
      },



      
    ],


    valid: true,
    amount: 0,
    amountRules: [
      (v) => !!v || "amount is required",
      (v) => (v && v > 0 && v < 10000) || "amount more than 0 and less than 10000",
    ],
    
    note: "",

    FirstnameRules: [(v) => !!v || "firstname is required"],
    LastnameRules: [(v) => !!v || "lastname is required"],
  
    priceRules: [
      (v) => !!v || "Price is required",
    ],
  
    dialog: false,
    dialogDelete: false,
    menu: false,
    modal: false,
    editedIndex: -1,
    itemSelected: {},
    db : getFirestore(),


    editedItem: {
      amount: 10,
      
        
      note: "",
    },

    defaultItem: {
      amount: 10,
      
        
      note: "",
    },




  }),

  methods: {
    SignInAnonymously() { const auth = getAuth(); 
    signInAnonymously(auth) 
    .then(() => { 
      // Signed in.. 
      }) 
      .catch((error) => { 
        console.log(error); 
    
        });   
    },
printValues: function(){
      this.selectedlang = "";
      // Read Checked checkboxes value
      for (var key in this.languages) {
         this.selectedlang += this.languages[key]+", "; 


      }
      localStorage.setItem('สินค้าที่ต้องการ', JSON.stringify(this.selectedlang));

    },

    authStateChanged() { 
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => { 
        if (user) { 
          // User is signed in, see docs for a list of available properties 
          // https://firebase.google.com/docs/reference/js/firebase.User 
          console.log(user); 
          // ... 
          } else { 
            // User is signed out 
            // ... 
          } 
      }); 
    },


    validate() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          this.createItem();
        } else {
          this.updateItem();
        }



        console.log(this.ListTable);
        this.close();
      } else {
        alert("Form not valid");
      }
    },

    readItem() {
      if (localStorage.getItem("amount") != null) {
        this.ListTable = JSON.parse(localStorage.getItem("amount"));
      }

      console.log(this.ListTable);
    },

    

    async getItemFromFirestore() {
      console.log("get and sync");

      const q = query(collection(this.db, "ListTable"), where("amount" ,">", 0));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        this.ListTable = [];
        var tmp = {};
        querySnapshot.forEach((doc) => {
          tmp = Object.assign({ uid: doc.id }, doc.data());
          this.ListTable.push(tmp);
        });       
      });

      console.log(this.ListTable);
      console.log(unsubscribe);
    },

    async createItem() {
      this.editedItem.amount = parseInt(this.editedItem.amount);      
      const docRef = await addDoc(collection(this.db, "ListTable"), this.editedItem);
      console.log("Document written with ID: ", docRef.id);
    },

    
    

    editItem(item) {
      
      this.editedIndex = item.uid;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async updateItem() {
      this.editedItem.amount = parseInt(this.editedItem.amount);
      await setDoc(doc(this.db, "ListTable", this.editedIndex), this.editedItem);
      
    },

    deleteItem(item) {
      this.itemSelected = item;
      this.editedIndex = item.uid;
      console.log(this.editedIndex);
      
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
         
      await deleteDoc(doc(this.db, "ListTable", this.editedIndex));
      console.log("Delete");
      this.closeDelete();
    },










    close() {
      this.dialog = false;
      this.clearItem();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.clearItem();
    },

    clearItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.itemSelected = {};
      console.log(this.editedIndex);
    },

    
  },
  watch: {
    editedIndex(val) {
      console.log(val);
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
    },
  },
  mounted() {
    // this.readItem();
    this.getItemFromFirestore();
    this.SignInAnonymously(); 
    this.authStateChanged();
    
    
  },
};
</script>

<style>
.green123 {
  color: green;
}
</style>
