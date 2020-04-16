<template>
  <div id="app">
    <div class="output">
      <p class="text-muted subtitle">
        Exachange Rate
      </p>
      <h2>{{ output }}</h2>
    </div>
    <div class="convert-form">
      <div class="form-group">
        <label class="text-muted">Amount</label>
        <input type="text" class="form-control" v-model="amount" />
      </div>
      <div class="form-group">
        <label class="text-muted">From</label>
        <select class="form-control" v-model="from">
          <option v-for="(c, i) in curr" v-bind:key="i" :value="c.code">{{
            c.name
          }}</option>
        </select>
      </div>
      <div class="form-group">
        <label class="text-muted">To</label>
        <select class="form-control" v-model="to">
          <option v-for="(c, i) in curr" v-bind:key="i" :value="c.code">{{
            c.name
          }}</option>
        </select>
      </div>
      <div class="form-group">
        <button class="btn-convert" v-on:click="convert()" v-show="!isLoading">
          Convert
        </button>
        <button class="btn-convert" disabled v-show="isLoading">
          Loading ...
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Currency from "./data/currency-data";

export default {
  name: "App",
  components: {},
  data: function() {
    return {
      isLoading: false,
      amount: 1,
      to: "INR",
      from: "USD",
      output: 0
    };
  },
  computed: {
    curr() {
      return Currency;
    }
  },
  methods: {
    convert() {
      this.isLoading = true;
      let convertTo = this.from + "_" + this.to;
      axios
        .get(
          `https://free.currconv.com/api/v7/convert?q=${convertTo}&apiKey=053e15997f4985b2c574`
        )
        .then(res => {
          let d = res.data["results"][convertTo];
          let symbol = Currency[this.to];
          this.output = symbol.symbol + " " + (d.val * this.amount).toFixed(2);
          this.isLoading = false;
        })
        .catch(err => alert("Error", err));
    }
  }
};
</script>

<style>
body {
  padding: 0 !important;
  margin: 0 !important;
}
#app {
  padding: 0 20px;
  margin: 0px;
  border-top: 5px solid #4392fe;
}
* {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.output {
  text-align: center;
}
.output h2 {
  margin: 0;
}
.text-muted {
  color: #8f8f8f;
}
.subtitle {
  margin-bottom: 0px;
}
.convert-form label {
  display: block;
  font-size: 12px;
}
input,
select {
  width: 100%;
}
.form-control {
  font-size: 14px;
  border: 1px solid #bebebe;
  border-radius: 5px;
  height: 30px;
}
.form-group {
  margin-bottom: 10px;
}
.btn-convert {
  width: 100%;
  background-color: #4392fe;
  color: white;
  font-weight: bold;
  height: 30px;
  border: none;
}
</style>
