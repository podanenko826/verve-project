import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Events from "./pages/Events";
import DetailsPage from "./pages/Events/Details";
import ArchivePage from "./pages/Events/Archive";
import SettingsPage from "./pages/Settings";
// import AccountPage from "./pages/Account";
import AxiosInterceptor from "./components/AxiosInterceptor";
import AuthMiddleware from "./components/AuthMiddleware";

function App() {
    return (
        <AxiosInterceptor>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />

                    <Route element={<AuthMiddleware />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/events" element={<Events />} />
                        <Route
                            path="/events/details/:id"
                            element={<DetailsPage />}
                        />
                        <Route
                            path="/events/archive"
                            element={<ArchivePage />}
                        />
                        <Route path="/settings" element={<SettingsPage />} />
                        {/* <Route path='/account' element={<AccountPage />} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </AxiosInterceptor>
    );
}

export default App;
