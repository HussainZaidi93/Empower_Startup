import React from 'react';
import { Helmet } from 'react-helmet-async';
import MonitorStartUpSection from 'src/sections/@dashboard/admin/MonitorStartUpSection';

export default function MonitorStartupPage(props) {
    return (
        <div>
            <Helmet>
                <title> Monitor Startup | SE </title>
            </Helmet>
            <MonitorStartUpSection />
        </div>
    );
}