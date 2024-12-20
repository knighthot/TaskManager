const Sidebar = () => {
    return (
      <aside className="h-full w-64 bg-[#081028] text-white flex flex-col">
        <div className="p-4">
          <img
            src="/path/to/avatar.png"
            alt="Avatar"
            className="w-16 h-16 rounded-full"
          />
          <h1 className="mt-4 text-xl font-bold">FikraLex</h1>
          <p className="text-gray-400 text-sm">Digital Hub</p>
        </div>
        <nav className="flex-1 mt-8">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Task
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Team
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    );
  };
  
  export default Sidebar;
  