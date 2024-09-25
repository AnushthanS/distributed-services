import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Box>
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="blue.500" color="white">
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
              E-commerce App
            </Heading>
          </Flex>

          <Box>
            <Button as={Link} to="/" colorScheme="blue" variant="ghost" mr={3}>
              Products
            </Button>

            <Button as={Link} to="/orders" colorScheme="blue" variant="ghost" mr={3}>
              Orders
            </Button>

            <Button as={Link} to="/login" colorScheme="blue" variant="ghost">
              Login
            </Button>
          </Box>
        </Flex>

        <Container maxW="container.xl" mt={8}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
        
      </Box>
    </BrowserRouter>
  )
}

export default App;