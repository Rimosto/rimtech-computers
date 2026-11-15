import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';

export default function Layout() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          &copy; {new Date().getFullYear()} RimTech Computers. All rights reserved.
        </div>
      </footer>
    </>
  );
}