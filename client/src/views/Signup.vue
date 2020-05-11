<script>
import { mapActions } from 'vuex';

export default {
  Name: 'SignUp',
  data() {
    return {
      formData: {},
      rules: { required: (value) => !!value || 'Required.' },
    };
  },
  computed: {
    isFormValid() {
      return (this.formData.username && this.formData.password);
    },
  },
  methods: {
    ...mapActions(['setUsername', 'signup']),
    enter() {
      this.signup(this.formData)
        .then(() => {
          this.setUsername(this.formData.username);
          this.$router.push('/');
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<template>
  <v-layout justify-center align-center>
    <v-spacer/>
    <v-flex md3>
      <v-card>
        <v-card-title>
          <v-spacer/>
          <strong>ChatApp</strong>
          <v-spacer/>
        </v-card-title>
        <v-card-text>
          <v-layout>
            <v-flex>
              <v-text-field
                v-model="formData.name"
                label="Name"
                @keyup.enter.native="enter"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-text-field
                v-model="formData.surname"
                label="Surname"
                @keyup.enter.native="enter"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-text-field
                v-model="formData.username"
                label="Username"
                :rules="[rules.required]"
                @keyup.enter.native="enter"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-text-field
                v-model="formData.password"
                label="Password"
                type="password"
                :rules="[rules.required]"
                @keyup.enter.native="enter"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="success"
            depressed block
            :disabled="!isFormValid"
            @click.stop="enter"
          >
            Sign-Up
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-layout>
        <v-spacer/>
        <v-flex style="text-align:center" pt-4>
          <router-link to="/Login" style="color:blue">
            Already a member ? Go to Login.
          </router-link>
        </v-flex>
        <v-spacer/>
      </v-layout>
    </v-flex>
    <v-spacer/>
  </v-layout>
</template>

<style>

</style>
