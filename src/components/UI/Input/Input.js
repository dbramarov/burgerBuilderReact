import React from "react";
import classes from './Input.module.css';

const input = (props) => {
    let inputEl = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    switch (props.elType) {
        case ('input'):
            inputEl = <input onChange={props.changed} className={inputClasses.join(' ')} {...props.elConfig} value={props.value}/>;
            break;
        case ('textarea'):
            inputEl = <textarea onChange={props.changed} className={classes.InputElement} {...props.elConfig} value={props.value}/>;
            break;
        case ('select'):
            inputEl = (
                <select onChange={props.changed} className={classes.InputElement} value={props.value}>
                    {props.elConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            );
            break;
        default:
            inputEl = <input onChange={props.changed} className={classes.InputElement} {...props.elConfig} value={props.value}/>;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputEl}
        </div>
    );
};

export default input;