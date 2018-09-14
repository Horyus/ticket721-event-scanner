import React from 'react';
import { StyleSheet} from 'react-native';
import {Container, Header, Left, Button, Icon, Body, Title, Right, Content} from 'native-base';

const styles = StyleSheet.create({
    title: {
        fontFamily: 'RobotoThin',
        fontSize: 20
    },
    listitem_title: {
        fontFamily: 'RobotoLight'
    },
    listitem_text: {
        fontFamily: 'RobotoThin'

    },
    head: {
        height: 70,
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1
    },
    left_icon: {
        marginLeft: 10,
        color: '#202020'
    }
});

export class Home extends React.Component {
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
                        <Button transparent>
                            <Icon style={{fontSize: 25, marginLeft: 10}} type="Entypo" name="add-to-list"/>
                        </Button>
                    </Right>
                </Header>
            </Container>
        )
    }
}
