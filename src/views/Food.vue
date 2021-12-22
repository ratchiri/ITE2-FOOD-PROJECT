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
          </v-card>
        </template>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card class="card-shadow card-padding">
            <v-card-title
              >คุณแน่ใจว่าต้องการลบ ({{ itemSelected.amount }})</v-card-title
            >
            <v-card-actions class="pb-0">
              <v-spacer></v-spacer>
              <v-btn @click="closeDelete" color="yellow">Cancel</v-btn>

              <v-btn @click="deleteItemConfirm(itemSelected)" color="error"
                >Ok</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
            <br />
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <template>
          <v-btn
            @click="
              editedIndex = '-1';
              dialog = true;
            "
            color="success"
            >เพิ่มข้อมูล</v-btn
          >
        </template>

        <v-dialog v-model="dialog" max-width="800px">
          <v-card class="card-shadow">
            <v-card-title>{{ formTitle }}</v-card-title>

            <v-card-text class="card-padding">
              <v-container class="px-0">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <br />

                  <v-row>
                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.Firstname"
                        :counter="25"
                        :rules="FirstnameRules"
                        label="Firstname"
                        required
                      ></v-text-field>
                    </v-col>

                     <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.Lastname"
                        :counter="25"
                        :rules="LastnameRules"
                        label="Lastname"
                        required
                      ></v-text-field>
                    </v-col>
                    

                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.note"
                        :counter="255"
                        label="หมายเหตุ"
                      ></v-text-field>
                    </v-col>
                    
                 <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.amount"
                        :counter="5"
                        :rules="amountRules"
                        label="จำนวน"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.price"
                        :counter="1000"
                        :rules="priceRules"
                        label="ราคา"
                        type="number"
                        required

                      ></v-text-field>
                    </v-col>

                  </v-row>

                  <br />
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions class="card-padding d-flex justify-center">
              <v-btn @click="close" color="error">ยกเลิก</v-btn>

              <v-btn
                v-if="editedIndex == -1"
                :disabled="!valid"
                @click="validate"
                color="success"
                >เพิ่มข้อมูล</v-btn
              >
              <v-btn v-else @click="validate" color="success"
                >ปรับปรุงข้อมูล</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-col></v-col>
<template>
  <div>
    <div class="text-center mb-4">
      <v-btn
        color="primary"
        @click="alert = !alert"
      >
        Toggle
      </v-btn>
    </div>
    <v-alert
      :value="alert"
      color="pink"
      dark
      border="top"
      icon="mdi-home"
      transition="scale-transition"
    >
      <h2>คำเตือน :</h2> <h2>1. ท่านสามารถเลือกสินค้าได้หลายชนิดในทีเดียวโดยใส่จำนวนของสินค้าลงไป</h2>
               <h2>2.ตรวจเช็ครายการอาหารให้เรียบร้อยก่อนส่ง</h2>

    </v-alert>
  </div>
</template>

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



      { text: "Actions", align: "center", value: "actions", sortable: false },
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
