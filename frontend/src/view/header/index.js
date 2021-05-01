import React from 'react'
import { Link } from 'react-router-dom'
import { FaCar, FaUsers, FaLaptop, FaCreditCard, FaWhatsapp, FaSignOutAlt, FaAngleUp, FaAngleDown } from "react-icons/fa";
import { MenuItem, MenuList, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Collapse } from '@material-ui/core';
import { MdMenu } from "react-icons/md";

export default function Header(props) {

    const [state, setState] = React.useState({
        open: false
    })

    const [collapse, setCollapse] = React.useState({
        site: false,
        financeiro: false
    })

    return (
        <>
            {(window.innerWidth < 577) ? 
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setState({ open: true })}>
                            <MdMenu />
                        </IconButton>
                        <Typography variant="h6">
                            {props.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                :
                <nav className="header navbar navbar-expand-lg navbar-light bg-white p-0">
                    <div className="container">
                        <Link className="navbar-brand" to="/">
                            <img src="/logo.png" alt="CarShop" height="40" />
                        </Link>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/vehicles">
                                    <FaCar className="icon-lg mr-2" /> Veículos
                                </Link>
                            </li>
                            <li className="nav-item">
                                    <button className="nav-link bg-white" to="#">
                                        <FaUsers className="icon-lg mr-2" /> Proprietários
                                    </button>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" data-toggle="dropdown">
                                    <FaLaptop className="icon-lg mr-2" /> Site
                                </Link>
                                <MenuList className="dropdown-menu">
                                    <MenuItem className="dropdown-item">
                                        Otimização para o Google
                                    </MenuItem>
                                    <MenuItem className="dropdown-item">
                                        Unidades e Telefones
                                    </MenuItem>
                                    <MenuItem className="dropdown-item">
                                        Minha Logo
                                    </MenuItem>
                                    <MenuItem className="dropdown-item">
                                        Dominio
                                    </MenuItem>
                                    <MenuItem className="dropdown-item">
                                        Configurações
                                    </MenuItem>
                                </MenuList>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" data-toggle="dropdown">
                                    <FaCreditCard className="icon-lg mr-2" /> Financeiro
                                </Link>
                                <MenuList className="dropdown-menu">
                                    <MenuItem className="dropdown-item">
                                        Meu Plano
                                    </MenuItem>
                                    <MenuItem className="dropdown-item">
                                        Minhas Transações
                                    </MenuItem>
                                </MenuList>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/vehicles">
                                    <FaWhatsapp className="icon-lg mr-2" /> Ajuda
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/vehicles">
                                    <FaSignOutAlt className="icon-lg mr-2" /> Sair
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            }
            <Drawer anchor="left" open={state.open} onClose={() => setState({ open: false })}>
                <div style={{width: 320, maxWidth: window.innerWidth - 70}}>
                    <List component="nav" className="menu-mobile">
                        <ListItem>
                            <img className="img-fluid logo-mobile" src="/logo.png" alt="CarShop" />
                        </ListItem>
                        <ListItem>
                            admin@carshop.com
                        </ListItem>
                        <Divider className="mt-2 mb-3" />
                        <ListItem>
                            <ListItemIcon>
                                <FaCar />
                            </ListItemIcon>
                            <ListItemText primary="Veículos" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <FaUsers />
                            </ListItemIcon>
                            <ListItemText primary="Proprietários" />
                        </ListItem>
                        <ListItem button onClick={() => setCollapse({ site: (collapse.site) ? false : true })}>
                            <ListItemIcon>
                                <FaLaptop />
                            </ListItemIcon>
                            <ListItemText primary="Site" />
                            {(collapse.site) ? <FaAngleUp /> : <FaAngleDown />}
                        </ListItem>
                        <Collapse in={collapse.site} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Otimização para o Google" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Unidades e Telefones" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Minha Logo" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Dominio" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Configurações" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider className="mt-2 mb-2" />
                        <ListItem button onClick={() => setCollapse({ financeiro: (collapse.financeiro) ? false : true })}>
                            <ListItemIcon>
                                <FaCreditCard />
                            </ListItemIcon>
                            <ListItemText primary="Financeiro" />
                            {(collapse.financeiro) ? <FaAngleUp /> : <FaAngleDown />}
                        </ListItem>
                        <Collapse in={collapse.financeiro} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Meu Plano" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Minhas Transações" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem>
                            <ListItemIcon>
                                <FaWhatsapp />
                            </ListItemIcon>
                            <ListItemText primary="Ajuda" />
                        </ListItem>
                        <Divider className="mt-2 mb-2" />
                        <ListItem>
                            <ListItemIcon>
                                <FaSignOutAlt />
                            </ListItemIcon>
                            <ListItemText primary="Sair" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    )
}
