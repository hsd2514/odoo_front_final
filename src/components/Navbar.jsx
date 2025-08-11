export default function Navbar() {
  const navItems = ["Dashboard", "Products", "Orders", "Reports", "Settings"];
  
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="text-xl font-bold">RentKar</div>
          <div className="hidden md:flex space-x-4">
            {navItems.map(item => (
              <button
                key={item}
                className="px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Search and User Profile */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <span className="hidden md:inline">Your Profile</span>
          </div>
        </div>
      </div>
    </nav>
  );
}