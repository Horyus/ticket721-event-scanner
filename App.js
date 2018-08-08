import React from 'react';
import { View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { test } from "./src/redux/test.reducer";
import { createStackNavigator } from 'react-navigation';
import {Home} from "./src/views/home";
import { createNavigationReducer, createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers';

const AppNavigator = createStackNavigator(
    {
        Home: {
            screen: Home
        }
    },
    {
        initialRouteName: 'Home'
    });

const navReducer = createNavigationReducer(AppNavigator);

const reducer = combineReducers({
    test: test,
    nav: navReducer
});

const middleware = createReactNavigationReduxMiddleware("root", state => state.nav);

const App = reduxifyNavigator(AppNavigator, "root");
const mapStateToProps = (state) => ({
    state: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const Store = createStore(reducer, applyMiddleware(middleware));

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={Store}>
                <AppWithNavigationState/>
            </Provider>
        );
    }
}

