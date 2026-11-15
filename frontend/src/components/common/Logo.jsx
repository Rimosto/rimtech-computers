import { Link } from 'react-router-dom';
import logo from '../../assets/brand/rimtech-logo.svg';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="RimTech Computers home">
      <img src={logo} alt="RimTech Computers" />
    </Link>
  );
}