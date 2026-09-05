import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet, useLocation } from "react-router-dom";

function Layout() {
    const { pathname } = useLocation();
    const isMiniPdv = pathname === "/minipdv";

    return (
        <div className={isMiniPdv ? "mini-pdv-layout" : undefined}>
            <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar">
                <Container>
                    <Navbar.Brand>SIGIN Delivery</Navbar.Brand>

                    <Nav className="me-auto flex-row flex-nowrap">
                        <Nav.Link as={NavLink} to="/minipdv">
                            Mini PDV
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/balcao">
                            Balcão
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/pizzaria">
                            Pizzaria
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

            <Container fluid={isMiniPdv} className={isMiniPdv ? "p-0 mini-pdv-content" : "mt-4"}>
                <Outlet />
            </Container>
        </div>
    );
}

export default Layout;
