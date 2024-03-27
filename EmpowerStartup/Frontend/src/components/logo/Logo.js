import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { logoImage } from 'src/images';

// ----------------------------------------------------------------------

const Logo = () => {
  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      <img src={logoImage} alt="Logo" height="100px" width="150px" />
    </Link>
  );
};

export default Logo;
