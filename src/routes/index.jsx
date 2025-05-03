import RegisterAuthenticate from "../pages/login-signup/register-authenticate";
import CreateTemplate from "../pages/template-generator/create-template"
import AdminMain from "../pages/admin-section/Main"
import LandingPage from "../pages/landing-page/LandingPage"
import Recharge from "../pages/user-operations/recharge"
import Profile from  "../pages/user-operations/profile"
const routes = [
  {
    Component: CreateTemplate,
    path: "/create",
    isPrivate: true, // Private route, needs auth
  },
  {
    Component: Profile,
    path: "/profile",
    isPrivate: true, // Private route, needs auth
  },
  {
    Component: Recharge,
    path: "/recharge",
    isPrivate: true, // Private route, needs auth
  },
  {
    Component: LandingPage,
    path: "/",
    isPrivate: false,
  },
  {
    Component: RegisterAuthenticate,
    path: "/signin",
    isPrivate: false,
  },
  {
    Component: RegisterAuthenticate,
    path: "/signup",
    isPrivate: false,
  },
  {
    Component: AdminMain,
    path: "/admin",
    isPrivate: true, // Private route, needs auth
  },
  {
    Component: AdminMain,
    path: "/admin/:path",
    isPrivate: true, // Private route, needs auth
  }
];

export default routes;
