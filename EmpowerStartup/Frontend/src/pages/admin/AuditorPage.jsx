import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AuditorSection } from 'src/sections/@dashboard';

export default function AuditorPage(props) {
    return (
        <div>
            <Helmet>
                <title> Auditor | SE </title>
            </Helmet>
            <AuditorSection />
        </div>
    );
}
