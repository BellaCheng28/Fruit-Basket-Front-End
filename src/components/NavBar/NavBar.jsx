import { useContext } from "react"; 
import { AuthedUserContext } from "../../App";
import { Link } from "react-router-dom";



const NavBar = ({ handleSignout }) => {
const { cart,user} = useContext(AuthedUserContext); 

  return (
    <>
      {user ? (
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/cart">
                Shopping Cart (
                {cart.reduce((total, item) => total + item.quantity, 0)})
              </Link>
            </li>
            <li>
              <Link to="/orderslist">My Orders</Link>
            </li>
            <li>
              <Link to="" onClick={handleSignout}>
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