<template>
  <v-app>
    <v-app-bar :clipped-center="clipped" fixed app width="100%">
      <v-toolbar-title v-text="title" />
      <v-btn @click="logout"> Logout </v-btn>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import global from '~/mixins/global.js'
export default {
  middleware: 'authenticated',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Gavali report',
    }
  },
  mounted() {
    const images = [
      'https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      'https://images.pexels.com/photos/2527671/pexels-photo-2527671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      'https://images.pexels.com/photos/710722/pexels-photo-710722.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      'https://images.pexels.com/photos/681331/pexels-photo-681331.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    ]

    const item = images[Math.floor(Math.random() * images.length)]
    document.getElementById('app').style.background =
      'url(' + item + ') no-repeat center center fixed'

    setInterval(() => {
      const item = images[Math.floor(Math.random() * images.length)]
      document.getElementById('app').style.background =
        'url(' + item + ') no-repeat center center fixed'
    }, 10000)
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/clearUserData')
      this.$router.push('/auth')
    },
  },
}
</script>

<style>
#app {
  background-size: cover;
  background-position: center;
  -webkit-transition: background-image 0.6s ease-in-out;
  transition: background-image 0.6s ease-in-out;
}

.v-toolbar__content {
  justify-content: space-between;
}
</style>
