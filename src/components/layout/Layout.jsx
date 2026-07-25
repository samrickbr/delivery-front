import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>SIGIN Delivery</Navbar.Brand>

                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/pedidoteste">
                            Pedido Teste
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/balcao">
                            Balcão
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/lanchonete">
                            Lanchonete
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/cozinha">
                            Cozinha
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/entrega">
                            Entrega
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/entrega/historico">
                            Histórico
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/cardapio">
                            Cardapio
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Outlet />
            </Container>
        </>
    );
}

export default Layout;
