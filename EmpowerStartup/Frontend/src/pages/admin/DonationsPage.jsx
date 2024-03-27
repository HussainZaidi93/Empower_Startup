import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DonationsSection } from 'src/sections/@dashboard';

export default function DonationsPage(props) {
    return (
        <div>
            <Helmet>
                <title> Donations| SE </title>
            </Helmet>
            <DonationsSection />
        </div>
    );
}