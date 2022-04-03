<template>
  <div>
    <div id="title">
      <h1><b> MCB IT-News</b></h1>
    </div>
    <div id="upload" v-if="IsLoggedIn">
      <input type="file" @change="uploadFile" ref="file" accept=".pdf" />
      <button @click="submitFile">Upload!</button>
    </div>
    <div
      id="files"
      class="FileView rounded-bottom rounded-top rounded-left rounded-right"
    >
      <a
        v-for="(f, index) in this.files"
        :key="f.name"
        v-on:click="viewpdffile(f.name)"
        class="FileView"
      >
        <b v-if="index === 0"> {{ f.name }} </b>
        <span v-else> {{ f.name }}</span>
        <br />
      </a>
    </div>
    <div id="pdfview" class="pdfview" v-if="pdfvisible">
      <div class="box stack-top" @click="closepdfview">
        <button class="btnclose btn btn-danger">Schließen [X]</button>
        <iframe
          :src="basepath + '/../files/' + curFile + '#zoom=140%'"
          style="width: 100%; height: 100%"
        />
      </div>
    </div>
  </div>
</template>



<script>
import axios from "axios";

export default {
  name: "MCBNews",

  data() {
    return {
      files: [
        {
          name: "",
          url: "",
        },
      ],
      curFile: "",
      basepath: "",
      selectedUploadFile: undefined,
      pdfvisible: true,
    };
  },

  created() {
    console.log("created MCBNews...");
    this.basepath = this.$parent.APIURL;
    this.GetFiles();
  },
  computed: {
    IsLoggedIn() {
      return this.$parent.loggedin;
    },
  },
  methods: {
    viewpdffile(file) {
      this.curFile = file;
      this.pdfvisible = true;
    },
    closepdfview() {
      this.pdfvisible = false;
    },
    async GetFiles() {
      console.log("GetFiles: " + this.$parent.APIURL + "/files");
      this.toEdit = "";
      await axios
        .get(this.$parent.APIURL + "/files")
        .then((res) => {
          //console.log('Result: ' + JSON.stringify(res.data))
          //this.$toast.success("aktualisiert")
          this.files = res.data;
          //display first file per default
          this.curFile = this.files[this.files.length - 1].name;
        })
        .catch((error) => {
          console.log("error: " + error);
          this.$toast.error(error);
        });
    },
    OLDsubmitFile() {
      axios
        .post(
          this.$parent.APIURL + "/fileupload",
          this.currentUploadFile.files[0],
          {
            headers: {
              //"Content-Type": "multipart/form-data",
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(function () {
          console.log("SUCCESS!!");
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },
    uploadFile() {
      this.selectedUploadFile = this.$refs.file.files[0];
      console.warn("File: " + this.selectedUploadFile);
    },
    submitFile() {
      const formData = new FormData();
      formData.append("file", this.selectedUploadFile);
      const headers = { "Content-Type": "multipart/form-data" };
      axios
        .post(this.$parent.APIURL + "/fileupload", formData, { headers })
        .then((res) => {
          //res.data.files; // binary representation of the file
          res.status; // HTTP status
          this.GetFiles();
          this.$toast.success("Upload OK");
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },
  },
};
</script>
<style scoped>
.FileView {
  font-family: Arial, Times;
  font-size: 125%;
  color: rgb(30, 30, 30);
  background-color: rgb(234, 252, 255);
  opacity: 0.8;
  margin: 0 auto;
  overflow-y: auto;
  border-bottom-right-radius: 100%;
  border-bottom-left-radius: 100%;
  max-height: 40%;
  width: 30%;
}

.btnclose {
  position: fixed;
  top: 6%;
  right: 15%;
  font-size: 12px;
}

.pdfview {
  background-color: aliceblue;
  width: 70%;
  height: 100%;
  position: relative, center;
  /*margin: 20px;*/
}
.box {
  width: 75%;
  height: 80%;
  position: absolute;
  top: 7%;
  left: 10%;
  opacity: 0.95; /* for demo purpose  */
}
.stack-top {
  z-index: 9;
  margin: 20px; /* for demo purpose  */
  background-color: aqua;
}
</style>