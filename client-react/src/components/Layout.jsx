import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
        <footer className="mt-8 border-t pt-4 text-center text-gray-500">
          <p>Uruapan, Michoacán</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
