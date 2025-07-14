import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import React, { useEffect, useState } from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobal } from "../../hooks/useGlobal";
import { Logout } from "@mui/icons-material";
import { serverApi } from "../../../lib/config";

interface NavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleLogoutClose: () => void;
  handleLogoutrequest: () => void;
}

export default function HomeNavbar(props: NavbarProps) {
  const {
    cartItems,
    onAdd,
    onDelete,
    onDeleteAll,
    onRemove,
    setLoginOpen,
    setSignupOpen,
    handleLogoutClose,
    handleLogoutClick,
    handleLogoutrequest,
    anchorEl,
  } = props;

  const { authMember } = useGlobal();

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 700);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // Clean up the event listener
      window.removeEventListener('scroll', handleScroll);
    };
  }, [window.scrollY]);

  return (
    <div className="home-navbar">
      <div className="dark"></div>
      <Container className="navbar-container">
        <Stack className={isFixed ? ' fixed' : 'menu'}>
          <Box>
            <NavLink to={"/"}>
              <img src="img/logo.png" className="brand-logo" />
            </NavLink>
          </Box>
          <Stack className="links">
            <Box className={"hover-line"}>
              <NavLink to={"/"} activeClassName="underline">
                Home
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to={"/products"} activeClassName="underline">
                Products
              </NavLink>
            </Box>
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink to={"/orders"} activeClassName="underline">
                  Orders
                </NavLink>
              </Box>
            ) : null}
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink to={"/member-page"} activeClassName="underline">
                  MyPage
                </NavLink>
              </Box>
            ) : null}

            <Box className={"hover-line"}>
              <NavLink to={"/help"} activeClassName="underline">
                Help
              </NavLink>
            </Box>
            <Basket
              cartItems={cartItems}
              onAdd={onAdd}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
              onRemove={onRemove}
            />

            {!authMember ? (
              <Box>
                <Button
                  variant="contained"
                  color="error"
                  className="login-btn"
                  onClick={() => setLoginOpen(true)}
                >
                  Login
                </Button>
              </Box>
            ) : (
              <img
                className="user"
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember.memberImage}`
                    : "/icons/default-user.svg"
                }
                aria-haspopup="true"
                onClick={handleLogoutClick}
              />
            )}

            <Menu
              id="account-menu"
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleLogoutClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogoutrequest}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "blue" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>

        <Stack className="header-frame">
          <Stack className="detail">
            <Box className="main-text">
              World's most <br /> delicious Cousine
            </Box>
            <Box className="desc">The choice, not the choice</Box>
            <Box className="time">24 hours service</Box>
            {!authMember ? (
              <Box className="signup">
                <Button
                  onClick={() => setSignupOpen(true)}
                  variant="contained" color="error"
                  className="signup-btn"
                >
                  Sign-up
                </Button>
              </Box>
            ) : (
              <Box className="">
                <Button
                  onClick={() => window.location.replace("/products")}
                  variant="contained" color="error"
                  className="see-product"
                >
                  See Our Menu
                </Button>
              </Box>
            )}
          </Stack>

          <Stack className="logo-frame">
            <img src="/img/right.webp" alt="" className="frame-img" />
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
