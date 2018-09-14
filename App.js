import React from 'react';
import { Font} from 'expo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { test } from "./src/redux/test.reducer";
import {StyleProvider} from 'native-base';
import getTheme from './native-base-theme/components';
import { createStackNavigator } from 'react-navigation';
import {Home} from "./src/views/home";
import {Creation} from "./src/views/home/creation";
import { createNavigationReducer, createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers';

const AppNavigator = createStackNavigator(
    {
        Home: {
            screen: Home
        },
        Creation: {
            screen: Creation
        }
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
        gesturesEnabled: false,
        cardStyle: { backgroundColor: '#FFFFFF' }
    }
);

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
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    async componentWillMount()  {
        await Font.loadAsync({
            RobotoThin: require('./assets/fonts/Roboto/Roboto-Thin.ttf'),
            RobotoLight: require('./assets/fonts/Roboto/Roboto-Light.ttf'),
            Roboto: require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
            RobotoMedium: require('./assets/fonts/Roboto/Roboto-Medium.ttf'),
            RobotoBlack: require('./assets/fonts/Roboto/Roboto-Black.ttf'),
            RobotoMono: require('./assets/fonts/RobotoMono/RobotoMono-Regular.ttf')
        });
        this.setState({loading: false});
    }

    render() {

        if (this.state.loading)
            return null;
        return (
            <Provider store={Store}>
                <StyleProvider style={getTheme()}>
                    <AppWithNavigationState/>
                </StyleProvider>
            </Provider>
        );
    }
}

