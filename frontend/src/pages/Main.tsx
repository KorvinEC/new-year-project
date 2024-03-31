import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";

const Header = styled.div`
  display: flex;
`

const NavLinkContainer = styled(NavLink)`
  margin: 10px;
  font-size: 40px;
  text-decoration: none;
`

const SpacerDiv = styled.div`
  flex-grow: 1;
`

const Main = () => {
    return (
        <>
            <Header>
                <NavLinkContainer to={'/cards'}>Cards</NavLinkContainer>
                <NavLinkContainer to={'/templates'}>Templates</NavLinkContainer>
                <SpacerDiv/>
                <NavLinkContainer to={'/login'}>Login</NavLinkContainer>
                <NavLinkContainer to={'/register'}>Register</NavLinkContainer>
            </Header>
            <Outlet/>
        </>
    );
}

export default Main;