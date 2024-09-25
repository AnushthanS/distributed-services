import React, { useState } from 'react';
import { Box, Input, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

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
    <Box as="form" onSubmit={handleLogin}>
      <VStack spacing={4}>
        <Input
          placeholder="Service ID"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          required
        />
        <Input
          placeholder="Secret"
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
        />
        <Button type="submit" colorScheme="blue">Login</Button>
      </VStack>
    </Box>
  );
};

export default Login;