<template>
  <v-app>
    <v-form>
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Normal with hint text"
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show2 ? 'text' : 'password'"
              name="input-10-2"
              label="Visible"
              hint="At least 8 characters"
              value="wqfasds"
              class="input-group--focused"
              @click:append="show2 = !show2"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show3 ? 'text' : 'password'"
              name="input-10-2"
              label="Not visible"
              hint="At least 8 characters"
              value="wqfasds"
              class="input-group--focused"
              @click:append="show3 = !show3"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.emailMatch]"
              :type="show4 ? 'text' : 'password'"
              name="input-10-2"
              label="Error"
              hint="At least 8 characters"
              value="Pa"
              error
              @click:append="show4 = !show4"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    valid: false,
    name: '',
    password: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v.length <= 10 || 'Name must be less than 10 characters',
    ],
  }),
}
</script>

<style lang="css" scoped></style>
