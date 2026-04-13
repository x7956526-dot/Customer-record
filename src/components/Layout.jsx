import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: '首页看板' },
  { to: '/customers', label: '客户管理' },
  { to: '/projects', label: '项目管理' },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>客户项目助手</h1>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
