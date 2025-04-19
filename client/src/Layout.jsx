import { Outlet } from "react-router-dom";
import Header from "./Header";

export default  function Layout() {
    return(
        <div className="flex flex-col max-w-4xl min-h-screen px-8 py-4 mx-auto">
            <Header />
            <Outlet />
        </div>
    )
}