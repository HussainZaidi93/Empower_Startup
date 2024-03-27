import React from 'react';
import { Helmet } from 'react-helmet-async';
import InspectionSection from 'src/sections/@dashboard/admin/InspectionSection';

export default function InspectorPage(props) {
    return (
        <div>
            <Helmet>
                <title> Inspector | SE </title>
            </Helmet>
            <InspectionSection />
        </div>
    );
}