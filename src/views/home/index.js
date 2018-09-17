import React from 'react';
import { StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Container, Header, Left, Button, Icon, Body, Title, Right, Content, Text, ListItem, List} from 'native-base';
import {withNavigation} from 'react-navigation';
import {EventSelect} from "../../redux/event/event.actions";

const styles = StyleSheet.create({
    title: {
        fontFamily: 'RobotoThin',
        fontSize: 20
    },
    head: {
        height: 70,
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1
    },
    listitem_title: {
        fontFamily: 'RobotoLight'
    },
    listitem_text: {
        fontFamily: 'RobotoThin'

    },
});

export class _Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const list_items = this.props.event.events.map((elem, idx) => {
            return (
                <ListItem thumbnail key={idx} onPress={() => {
                    this.props.select(idx);
                    this.props.navigation.navigate('Scanner');
                }}>
                    <Body>
                    <Text style={styles.listitem_title}>{elem.name}</Text>
                    <Text style={styles.listitem_text} note numberOfLines={1}>{elem.address}</Text>
                    </Body>
                </ListItem>
            );
        });

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
                <Content>
                    <List>
                        {list_items}
                    </List>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        event: state.event
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        ...ownProps,
        select: (idx) => (dispatch(EventSelect(idx)))
    }
};

export const Home = withNavigation(connect(mapStateToProps, mapDispatchToProps)(_Home));
