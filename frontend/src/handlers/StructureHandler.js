import React from 'react';
import {NavLink} from 'react-router-dom';

import {Button, Grid, Icon, Image, Menu, Sidebar} from 'semantic-ui-react';

import Logo from '../images/icons/e.jpg';


export default class StructureHandler {
    static iconNames = new Map([["bars", "close"], ["close", "bars"]]);

    static toggleVisibility() {
        this.setState({visible: !this.state.visible});
        this.setState({iconName: StructureHandler.iconNames.get(this.state.iconName)});
    }

    static hideSidebar() {
        this.setState({visible: false});
        this.setState({iconName: StructureHandler.iconNames.get('close')});
    }

    static getHeader() {
        return (
            <Grid.Row columns="equal" verticalAlign="middle" className="gridHeader">
                <Grid.Column textAlign="left">
                    <NavLink to={'/'}>
                        <Image src={Logo} alt="HUNTeR Logo - Link to home site" className="logoImage"
                               onClick={StructureHandler.hideSidebar.bind(this)}/>
                    </NavLink>
                </Grid.Column>
                <Grid.Column textAlign="center" className="headerElement">
                    <h1>Header</h1>
                </Grid.Column>
                <Grid.Column textAlign="right">
                    <Button onClick={StructureHandler.toggleVisibility.bind(this)} icon={this.state.iconName}/>
                </Grid.Column>
            </Grid.Row>
        )
    }

    static getSideBar(paths) {
        return (
            <Sidebar as={Menu} animation="overlay"
                     width="thin" direction="right"
                     visible={this.state.visible} icon="labeled"
                     vertical inverted>
                {StructureHandler.getStructurePaths(paths)}
            </Sidebar>
        );
    }

    static getStructurePaths(elements) {
        return elements.map((element) =>
            <NavLink key={'navLink' + element.path} to={'/' + element.path}>
                <Menu.Item name={element.path}><Icon name={element.icon}/>
                    {element.title}
                </Menu.Item>
            </NavLink>
        );
    }
}