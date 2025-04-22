import MainPage from "../pages/Home";
import CreateTemplate from "../pages/CreateTemplate"
import AdminMain from "../pages/Admin/Main"
const routes = [
  {
    Component: CreateTemplate,
    path: "/create",
    isPrivate: true, // Private route, needs auth
  },
  {
    Component: MainPage,
    path: "/",
    isPrivate: false,

  },
  {
    Component: MainPage,
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
