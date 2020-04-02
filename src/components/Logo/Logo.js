import React from 'react';
import classes from './Logo.module.css';
import burgerLogo from '../../assets/images/burger.png';

const logo = (props) => (
    <div className={classes.Logo}>
        <img src={burgerLogo} alt="Burger Logo"/>
    </div>
);

export default logo;