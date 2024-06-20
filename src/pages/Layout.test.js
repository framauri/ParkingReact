import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/maps">Maps</Link>
            </li>
            <li>
              <Link to="/nopage">No Page</Link>
            </li>
          </ul>
        </nav>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer>
        <p>© 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
