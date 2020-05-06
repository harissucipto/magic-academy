import { action } from 'easy-peasy';

const ui = {
  view: 'student',
  changeView: action((state, payload) => {
    state.view = payload;
  }),
};

export default ui;
