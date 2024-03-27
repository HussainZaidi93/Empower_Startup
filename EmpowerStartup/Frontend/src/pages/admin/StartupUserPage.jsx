import React from 'react';
import { Helmet } from 'react-helmet-async';
import { StartupUserSection } from 'src/sections/@dashboard';

export default function StartupUserPage(props) {
    return (
        <div>
            <Helmet>
                <title> Startups | SE </title>
            </Helmet>
            <StartupUserSection />
        </div>
    );
}