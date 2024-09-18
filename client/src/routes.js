import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import MainLayout from "./layouts/MainLayout";
import NotFound from "./pages/notFound/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./protectedRoute";



const routes = [
    

    {
        path: "/",
        element: (
            <ProtectedRoute>
               <MainLayout/> 
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/dashboard",
                element: <Dashboard/>
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "*",
        element: <NotFound/>
    }
]


export default routes