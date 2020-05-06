import { persist, computed, action } from 'easy-peasy';

const auth = persist(
  {
    token: null,
    user: null,
    isLoggedIn: computed((state) => state.user != null),
    signin: action((state, payload) => {
      const { token, user } = payload;
      state.token = token;
      state.user = user;
    }),
    signout: action((state) => {
      state.token = null;
      state.user = null;
    }),
  },
  { whitelist: ['token', 'user'] }
);

export default auth;
