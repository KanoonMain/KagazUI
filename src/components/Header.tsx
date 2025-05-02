import { Link, useLocation } from "react-router-dom";
import SitemarkIcon from "./SitemarkIcon";

const Header = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname != "/" && (
        <header style={{ backgroundColor: "#f0f0f0", height: "50px" }}>
          <Link to="/" style={{ paddingLeft: "20px", cursor: "pointer" }}>
            <SitemarkIcon />
          </Link>
          {/* Add navigation links or any other header elements */}
        </header>
      )}
    </>
  );
};

export default Header;
