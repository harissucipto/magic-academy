import { action, computed } from 'easy-peasy';

const ui = {
  view: 'student',
  changeView: action((state, payload) => {
    state.view = payload;
  }),
  isStudent: computed((state) => state.view === 'student'),
};

export default ui;
