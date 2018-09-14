import React from 'react';
import { StyleSheet} from 'react-native';
import {Container, Header, Left, Button, Icon, Body, Title, Right, Content} from 'native-base';
import {withNavigation} from 'react-navigation';

const styles = StyleSheet.create({
    title: {
        fontFamily: 'RobotoThin',
        fontSize: 20
    },
    head: {
        height: 70,
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1
    }
});

export class _Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header style={styles.head} transparent>
                    <Left>
                    </Left>
                    <Body>
                    <Title style={styles.title}>events</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {this.props.navigation.navigate('Creation');}}>
                            <Icon style={{fontSize: 25, marginLeft: 10}} type="Entypo" name="add-to-list"/>
                        </Button>
                    </Right>
                </Header>
            </Container>
        )
    }
}

export const Home = withNavigation(_Home);
