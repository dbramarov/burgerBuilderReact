import React, { Component } from "react";
import Aux from '../../hoc/Auxi/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('https://react-my-burger-7a891.firebaseio.com/ingredients.json').then(res => {
            this.setState({ingredients: res.data});
        }).catch(error => {
            this.setState({error: true});
        });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igKey => ingredients[igKey]).reduce((sum, el) => {
            return sum + el
        }, 0);
        this.setState({purchaseable: sum > 0});
    }

    purchaseHandler = (bool) => {
        this.setState({purchasing: bool});
    }

    purchaseContinue = () => {
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'John Doe',
                address: {
                    street: '111 Hubbaroni Ave',
                    zipCode: '16029',
                    country: 'USA'
                },
                email: 'jDoe@email.com'
            }
        }
        axios.post('/orders.json', order).then(res => {
            this.setState({loading: false, purchasing: false});
        }).catch(error => {
            this.setState({loading: false, purchasing: false});
        })
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        }
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cant be loaded!</p> : <Spinner />;
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ordered={() => this.purchaseHandler(true)}
                        purchaseable={this.state.purchaseable}
                        price={this.state.totalPrice} 
                        disabled={disableInfo} 
                        ingredientRemove={this.removeIngredientHandler} 
                        ingredientAdded={this.addIngredientHandler}/>
                </Aux>
            )
            orderSummary = <OrderSummary 
                price={this.state.totalPrice}
                purchaseCanceled={() => this.purchaseHandler(false)} 
                purchaseContinue={this.purchaseContinue} 
                ingredients={this.state.ingredients}/>
        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <Aux>
                <Modal modalClosed={() => this.purchaseHandler(false)} show={this.state.purchasing}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);