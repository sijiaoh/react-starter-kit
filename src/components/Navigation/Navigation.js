/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useContext } from 'react';
import cx from 'classnames';
import s from './Navigation.css';
import Link from '../Link';
import ApplicationContext from '../ApplicationContext';

export default function Navigation() {
  const { fetchGraphql, loggedIn, logout } = useContext(ApplicationContext);
  useStyles(s);

  const onClickLogout = async () => {
    const data = await fetchGraphql('mutation{logout}');
    if (!data.logout) throw new Error('Failed to logout.');
    logout();
  };

  const loginButton = (
    <>
      <Link className={s.link} to="/login">
        Log in
      </Link>
      <span className={s.spacer}>or</span>
      <Link className={cx(s.link, s.highlight)} to="/register">
        Sign up
      </Link>
    </>
  );
  const logoutButton = (
    <Link className={s.link} to="/" onClick={onClickLogout}>
      Log out
    </Link>
  );
  return (
    <div className={s.root} role="navigation">
      <Link className={s.link} to="/about">
        About
      </Link>
      <Link className={s.link} to="/contact">
        Contact
      </Link>
      <span className={s.spacer}> | </span>
      {loggedIn ? logoutButton : loginButton}
    </div>
  );
}
