import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import * as PATHS from '../contants/paths';

import Login from '../pages/Login';
import Home from '../pages/Home';

function Layout() {
  const { pathname } = useLocation();

  const isNotDisplayExtra = React.useMemo(
    () => someHaveItem(pathname, [PATHS.LOGIN]),
    [pathname]
  );

  return (
    <div>
      {isNotDisplayExtra && <div>Header</div>}
      <Switch>
        <Route path={PATHS.LOGIN} component={Login} />
        <Route path={PATHS.HOME} component={Home} />
      </Switch>
      {isNotDisplayExtra && <div>Footer</div>}
    </div>
  );
}

const someHaveItem = (path, paths) =>
  !paths.some((item) => item === path);

export default Layout;
