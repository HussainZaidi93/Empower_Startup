import React from 'react';
import { Helmet } from 'react-helmet-async';
import { StartupsPage } from '..';

function InspectionHomePage(props) {
  return (
    <div>
      <Helmet>
        <title> Startup List | SE </title>
      </Helmet>
      <StartupsPage role='Inspector'/>
    </div>
  );
}

export default InspectionHomePage;
