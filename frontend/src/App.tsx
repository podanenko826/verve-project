import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages'
import Dashboard from './pages/Dashboard'

import Events from './pages/Events'
import DetailsPage from './pages/Events/Details'
import ArchivePage from './pages/Events/Archive'
import SettingsPage from './pages/Settings'
import AccountPage from './pages/Account'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/events' element={<Events />} />
                <Route path='/events/details/:id' element={<DetailsPage />} />
                <Route path='/events/archive' element={<ArchivePage />} />
                <Route path='/settings' element={<SettingsPage />} />
                <Route path='/account' element={<AccountPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
