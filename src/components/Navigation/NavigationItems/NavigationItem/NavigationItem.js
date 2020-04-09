import React from 'react';
import classes from './NavigationItem.module.css';
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <NavLink exact activeClassName={classes.active} to={props.link} alt="Navigation Item">{props.children}</NavLink>
    </li>
);

export default navigationItem;