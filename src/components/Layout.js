import React, { useMemo } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import * as PATHS from '../contants/paths';

import Login from '../pages/Login';
import Home from '../pages/Home';
import Header from './Header';
import DetailCourse from '../pages/DetailCourse';
import MyCourse from '../pages/MyCourse';
import Instructor from '../pages/Instructor';
import EditCourse from '../pages/EditCourse';
import Enroll from '../pages/Enroll';
import Register from '../pages/Register';

function Layout() {
  const { pathname } = useLocation();

  const isNotDisplayExtra = useMemo(
    () => someHaveItem(pathname, [PATHS.LOGIN, PATHS.REGISTER]),
    [pathname]
  );

  return (
    <div>
      {isNotDisplayExtra && <Header />}
      <Switch>
        <Route path={`${PATHS.ENROLL}/:id`} component={Enroll} />
        />
        <Route
          path={`${PATHS.EDIT_COURSE}/:id`}
          component={EditCourse}
        />
        <Route path={PATHS.INSTRUCTOR} component={Instructor} />
        <Route path={PATHS.MY_COURSE} component={MyCourse} />
        <Route
          path={`${PATHS.DETAIL_COURSE}/:id`}
          component={DetailCourse}
        />
        <Route path={PATHS.REGISTER} component={Register} />
        <Route path={PATHS.LOGIN} component={Login} />
        <Route path={PATHS.HOME} component={Home} />
      </Switch>
    </div>
  );
}

const someHaveItem = (path, paths) =>
  !paths.some((item) => item === path);

export default Layout;
