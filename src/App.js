import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';

import Map2D from './views/Map2D';
import DiscreteMap2D from './views/DiscreteMap2D';


const routes = [
  { path: "/", component: Home },
  { path: "/map2d", component: Map2D },
  { path: "/discrete2d", component: DiscreteMap2D },
];

function Home() {
  return (
    <ul>
      {routes.map((r, i) => (
        <li key={i}>
          <Link to={r.path}>{r.component.name}</Link>
        </li>
      ))}
    </ul>
  );
}


export default function AppRouter() {
  return (
    <Router>
      {routes.map((r, i) => (
        <Route path={r.path} exact component={r.component} key={i} />
      ))}
    </Router>
  );
}
