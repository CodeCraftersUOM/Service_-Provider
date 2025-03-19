import Image from "next/image";
import { FaUser, FaBell, FaFacebookMessenger } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-md w-full">
      {/* Left Side - Logo and Brand Name */}
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="Travelwish Logo" width={50} height={50} />
        <span className="text-xl font-bold">Travelwish</span>
      </div>

      {/* Center - Navigation Links */}
      <div className="flex space-x-6">
        <a href="#" className="text-gray-700 hover:text-blue-500">Become a Service Provider</a>
        <a href="#" className="text-gray-700 hover:text-blue-500">Categories</a>
        <a href="#" className="text-gray-700 hover:text-blue-500">About</a>
      </div>

      {/* Right Side - Icons and Login/Signup */}
      <div className="flex items-center space-x-4">
        <FaUser className="text-gray-700 text-xl" />
        <span className="text-gray-700">Log in</span>
        <span className="text-gray-700">|</span>
        <span className="text-gray-700">Sign up</span>
        <FaBell className="text-gray-700 text-xl" />
        <FaFacebookMessenger className="text-blue-600 text-xl" />
      </div>
    </nav>
  );
};

export default Navbar;
