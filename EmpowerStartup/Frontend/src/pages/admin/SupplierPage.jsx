import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SupplierSection } from 'src/sections/@dashboard';

export default function SupplierPage(props) {
    return (
        <div>
            <Helmet>
                <title> Suppliers | SE </title>
            </Helmet>
            <SupplierSection />
        </div>
    );
}