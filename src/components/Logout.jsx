import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
