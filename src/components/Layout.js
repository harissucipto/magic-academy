import React, { useMemo } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import * as PATHS from '../contants/paths';

import Login from '../pages/Login';
import Home from '../pages/Home';
import Header from './Header';
import DetailCourse from '../pages/DetailCourse';

function Layout() {
  const { pathname } = useLocation();

  const isNotDisplayExtra = useMemo(
    () => someHaveItem(pathname, [PATHS.LOGIN]),
    [pathname]
  );

  return (
    <div>
      {isNotDisplayExtra && <Header />}
      <Switch>
        <Route
          path={`${PATHS.DETAIL_COURSE}/:id`}
          component={DetailCourse}
        />
        <Route path={PATHS.LOGIN} component={Login} />
        <Route path={PATHS.HOME} component={Home} />
      </Switch>
    </div>
  );
}

const someHaveItem = (path, paths) =>
  !paths.some((item) => item === path);

export default Layout;
