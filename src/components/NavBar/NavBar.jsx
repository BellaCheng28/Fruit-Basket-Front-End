import { useContext,useState } from "react";
import { AuthedUserContext } from "../../App";
import { Link, useLocation } from "react-router-dom";
import { fruitBasketLogo } from "../../assets/image";

const NavBar = ({ handleSignout }) => {
  const { cart, user } = useContext(AuthedUserContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 判断是否是当前路由
  const getLinkClass = (path) => {
    return location.pathname === path
      ? "inline-block text-white bg-lime-600 rounded-lg shadow-md" // 高亮样式
      : "inline-block rounded-lg font-bold text-lime-600 text-gray-300 hover:bg-lime-500 hover:text-white"; // 默认样式
  };
   const toggleMenu = () => {
     setIsMenuOpen(!isMenuOpen);
   };

  return (
    <>
      <header className="py-1 bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* logo */}
            <div className="flex flex-row items-center">
                <img src={fruitBasketLogo} alt="Logo" className="h-12 w-12 " />
                <span className="text-lime-600  blo font-bold">Fruit Basket</span>
             
            </div>
            {/* full screen */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded ${getLinkClass("/")}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className={`px-3 py-2 rounded ${getLinkClass("/products")}`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className={`relative px-3 py-2 rounded ${getLinkClass(
                    "/cart"
                  )}`}
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-cart"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                    </svg>
                  </div>
                  <span className="text- text-xs absolute right-[7px] top-0">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/orderslist"
                  className={`px-3 py-2 rounded ${getLinkClass("/orderslist")}`}
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/signin"
                  className={`px-3 py-2 rounded ${getLinkClass("/")}`}
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to=""
                  onClick={handleSignout}
                  className={`px-3 py-2 rounded ${getLinkClass("")}`}
                >
                  Sign Out
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className={`px-3 py-2 rounded ${getLinkClass("")}`}
                >
                  Sign Up
                </Link>
              </li>
            </ul>

            {/* Sign Up 和菜单按钮 */}
            <div className="flex items-center space-x-4 md:hidden">
              <Link
                to="/products"
                className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-500"
              >
                Products
              </Link>
              <Link
                to="/cart"
                className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-500"
              >
                Cart
              </Link>
              <Link
                to="/signup"
                className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-500"
              >
                Sign Up
              </Link>

              <button
                onClick={toggleMenu}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </nav>

          {/* 小屏菜单内容 */}
          {isMenuOpen && (
            <div className="mt-4 md:hidden bg-gray-50 rounded-lg shadow-lg">
              <ul className="space-y-4 p-4">
                <li>
                  <Link
                    to="/"
                    className={`block px-3 py-2 ${getLinkClass("/")}`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className={`block px-3 py-2 ${getLinkClass("/products")}`}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className={`block px-3 py-2 ${getLinkClass("/cart")}`}
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orderslist"
                    className={`block px-3 py-2 ${getLinkClass("/orderslist")}`}
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signin"
                    className={`block px-3 py-2 ${getLinkClass("/signin")}`}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to=""
                    onClick={handleSignout}
                    className={`block px-3 py-2 ${getLinkClass("")}`}
                  >
                    Sign Out
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default NavBar;
