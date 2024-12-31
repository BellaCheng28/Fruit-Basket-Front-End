import { useContext } from "react";
import { AuthedUserContext } from "../../App";
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ handleSignout }) => {
  const { cart, user } = useContext(AuthedUserContext);
  const location = useLocation();
  // 判断是否是当前路由
  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-white bg-green-600" // 高亮样式
      : "text-gray-300 hover:text-white"; // 默认样式
  };

  return (
    <>
      {user ? (
        <nav className=" bg-green-800 p-4">
          <ul className="flex justify-between items-center">
            <li>
              <Link to="/" className={`px-3 py-2 rounded ${getLinkClass("/")}`}>
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
                className={`px-3 py-2 rounded ${getLinkClass("/cart")}`}
              >
                Shopping Cart (
                {cart.reduce((total, item) => total + item.quantity, 0)})
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
                to=""
                onClick={handleSignout}
                className={`px-3 py-2 rounded ${getLinkClass("")}`}
              >
                Sign Out
              </Link>
            </li>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default NavBar;
