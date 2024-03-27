import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DonationArticleSection } from 'src/sections/@dashboard';

export default function DonationArtilcePage(props) {
    return (
        <div>
            <Helmet>
                <title> Article| SE </title>
            </Helmet>
            <DonationArticleSection />
        </div>
    );
}