import React, { Component } from 'react'
import {
    Navbar,
    NavbarBrand,
} from 'reactstrap';

export class Menu extends Component {
    render() {
        return (
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">DNS Viewer</NavbarBrand>
            </Navbar>
        )
    }
}

export default Menu
