export const state = () => ({
  userData: {},
  authenticated: false,
})
export const mutations = {
  setUserData(state, userData) {
    state.userData = userData
  },
  isAuthenticated(state, bool) {
    state.authenticated = bool
  },
}
export const actions = {
  setUserData({ commit }, { userData }) {
    commit('setUserData', userData)
  },
  isAuthenticated({ commit }, { bool }) {
    commit('isAuthenticated', bool)
  },
}

export const getters = {
  userData: (s) => s.userData,
}
