import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useUnit } from "effector-react/effector-react.mjs";
import { $currentUser, logoutEvent } from "../stores/Authorization";

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
    const logout = () => {
        logoutEvent()
    }

    const currentUser = useUnit($currentUser);

    return (
        <>
            <Header>
                <NavLinkContainer to={'/cards'}>Cards</NavLinkContainer>
                <NavLinkContainer to={'/templates'}>Templates</NavLinkContainer>
                <SpacerDiv/>
                {currentUser ? (
                    <NavLinkContainer to={'/'} onClick={logout}>Logout</NavLinkContainer>
                ) : (
                    <>
                        <NavLinkContainer to={'/login'}>Login</NavLinkContainer>
                        <NavLinkContainer to={'/register'}>Register</NavLinkContainer>
                    </>
                )}
            </Header>
            <Outlet/>
        </>
    );
}

export default Main;