import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/api';

const Login = () => {
  const [serviceId, setServiceId] = useState('');
  const [secret, setSecret] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login(serviceId, secret);
      localStorage.setItem('token', accessToken);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Service ID"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Login
      </button>
    </form>
  );
};

export default Login;