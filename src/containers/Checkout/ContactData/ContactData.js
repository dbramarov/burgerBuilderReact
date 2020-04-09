import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elType: 'input',
                elConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elType: 'input',
                elConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elType: 'input',
                elConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elType: 'input',
                elConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elType: 'input',
                elConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elType: 'select',
                elConfig: {
                    options: [{value: 'fastest', displayValue: 'Fastest'}, {value: 'cheapest', displayValue: 'Cheapest'}]
                },
                value: 'fastest',
                valid: true
            },
        },
        loading: false,
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for (let formEl in this.state.orderForm) {
            formData[formEl] = this.state.orderForm[formEl].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order).then(res => {
            this.setState({loading: false});
            this.props.history.push('/');
        }).catch(error => {
            this.setState({loading: false});
        })
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (rules && rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules && rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules && rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputChangedHandler = (event, inputId) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormEl = {
            ...updatedOrderForm[inputId]
        };
        updatedFormEl.value = event.target.value;
        updatedFormEl.valid = this.checkValidity(updatedFormEl.value, updatedFormEl.validation);
        updatedFormEl.touched = true;
        updatedOrderForm[inputId] = updatedFormEl;

        let formIsValid = true;
        for (let inputId in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputId].valid && formIsValid;
        }
        console.log(formIsValid);
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map( formEl => (
                    <Input 
                        key={formEl.id} 
                        invalid={!formEl.config.valid}
                        shouldValidate={formEl.config.validation}
                        touched={formEl.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formEl.id)}
                        elType={formEl.config.elType} 
                        elConfig={formEl.config.elConfig} 
                        value={formEl.config.value}/>
                ))}
                <Button disabled={!this.state.formIsValid} btnType="Success">ORDER</Button>
            </form>
        );
        if (this.state.loading) {   
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;