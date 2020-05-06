import { computed, persist, action } from 'easy-peasy';

const enroll = persist(
  {
    courses: [
      {
        courseId: '5eb1986b806eae008b266f41',
        userId: '5eb165cfa0005300baa9c5bc',
      },
    ],
    myCourse: computed(
      [
        (state, stateResolver) => stateResolver.auth.user,
        (state) => state.courses,
      ],
      (user, courses) => {
        if (!user?.id ?? false) return [];
        const myCourse = courses.filter(
          (item) => item.userId === user.id
        );
        return myCourse.map((item) => item.courseId);
      }
    ),
    addEnroll: action((state, payload) => {
      state.courses.push(payload);
    }),
  },

  {
    whitelist: ['courses'],
  }
);

export default enroll;
