import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AuditorHomeSection } from 'src/sections/auditor';

function AuditorHomePage(props) {
  return (
    <div>
      <Helmet>
        <title> Startup List | SE </title>
      </Helmet>
      <AuditorHomeSection/>
    </div>
  );
}

export default AuditorHomePage;
