import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Send from "./Send";

import QRPayments from "./QRPayments";

import History from "./History";

import PayLater from "./PayLater";

import Profile from "./Profile";

import Analytics from "./Analytics";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Send: Send,
    
    QRPayments: QRPayments,
    
    History: History,
    
    PayLater: PayLater,
    
    Profile: Profile,
    
    Analytics: Analytics,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Send" element={<Send />} />
                
                <Route path="/QRPayments" element={<QRPayments />} />
                
                <Route path="/History" element={<History />} />
                
                <Route path="/PayLater" element={<PayLater />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}