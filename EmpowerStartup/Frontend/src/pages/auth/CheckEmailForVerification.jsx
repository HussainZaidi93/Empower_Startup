import { Helmet } from 'react-helmet-async';
import  { AccountVerificationPage } from './';
// ----------------------------------------------------------------------
export default function CheckEmailForVerification() {
  return (
    <>
      <Helmet>
        <title> Verify Your Email | SE </title>
      </Helmet>
        <AccountVerificationPage/>

    </>
  );
}
