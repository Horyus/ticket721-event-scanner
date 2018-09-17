import React from 'react';
import {connect} from 'react-redux';
import {Container, Header, Left, Button, Icon, Body, Title, Right, Content, Text, Card, CardItem} from 'native-base';
import { BarCodeScanner, Permissions, Camera } from 'expo';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Wallet} from 'ethers';
import {EventAdd} from "../../redux/event/event.actions";

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
    card_info: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card_info_title: {
        textAlign: 'center',
        fontSize: 30
    },
    card_info_body: {
        textAlign: 'center',
        fontSize: 25
    }
});

class _Scanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scanned: {},
            status: 'IDLE'
        };
        this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
    }

    handleBarCodeScanned({type, data, target}) {
        if (type === BarCodeScanner.Constants.BarCodeType.qr && this.state.status !== 'FETCHING') {
            try {
                const parsed = JSON.parse(data);
                const original_message = (parsed.v ? 'V' : 'P') + parsed.id + parsed.timestamp;
                const signer = Wallet.verifyMessage(original_message, parsed.sig);
                if (this.state.scanned.id === parsed.id) return;
                this.setState({
                    scanned: {
                        ...JSON.parse(data),
                        signed_by: signer
                    },
                    status: 'FETCHING'
                });
                this.props.event.contracts.Ticket721Hub.companions(signer)
                    .then(async author => {
                        let owner;
                        let event;
                        if (parsed.v) {
                            owner = await this.props.event.contracts.Ticket721.ownerOf(parsed.id);
                            event = await this.props.event.contracts.Ticket721.fromEvent(parsed.id);
                        } else {
                            owner = await this.props.event.contracts.Ticket721Public.ownerOf(parsed.id);
                            event = await this.props.event.contracts.Ticket721Public.fromEvent(parsed.id);
                        }
                        if (owner !== author) { // Proper address check
                            this.setState({
                                status: 'ERROR_OWNER'
                            });
                        } else if (event !== this.props.event.events[this.props.event.selected].address) { // Proper address check
                            console.log("not good event");
                            this.setState({
                                status: 'ERROR_EVENT'
                            });
                        } else {
                            this.setState({
                                status: 'VALID'
                            })
                        }
                    })
                // Check proper contract for ownership
            } catch (e) {
                this.setState({
                    scanned: {},
                    status: 'ERROR'
                })
            }
        }
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    render() {
        switch (this.props.event.contracts.status) {
            case 'LOADED':

                let card_style = 0;

                const card_info_title = "Ticket #" + this.state.scanned.id;
                let card_info_body;
                let button = null;
                switch (this.state.status) {
                    case 'VALID':
                        card_info_body = 'Valid Ticket.';
                        card_style = 0;
                        if (this.props.event.events[this.props.event.selected].scanned.indexOf(this.state.scanned.id) === -1) {
                           button =
                               <Button block onPress={() => {this.props.addTicket(this.state.scanned.id, this.props.event.selected)}}>
                                   <Text>
                                       Check In
                                   </Text>
                               </Button>;
                        } else {
                            button = <Button block disabled>
                                <Text>
                                    Ticket already scanned !
                                </Text>
                            </Button>

                        }
                        break ;
                    case 'ERROR_OWNER':
                        card_info_body = 'Owner and Signature Emitter do not match.';
                        break ;
                    case 'ERROR_EVENT':
                        card_info_body = 'Scanned ticket is not for current event.';
                        break ;
                    case 'ERROR':
                        card_info_body = 'An Error Occured.';
                        break ;
                }


                return (
                    <Container>
                        <Header style={styles.head} transparent>
                            <Left>
                                <Button transparent onPress={() => {
                                    this.props.navigation.pop()
                                }}>
                                    <Icon style={{fontSize: 25, marginLeft: 10}} type="Ionicons" name="ios-arrow-back"/>
                                </Button>
                            </Left>
                            <Body>
                            <Title
                                style={styles.title}>{this.props.event.events[this.props.event.selected].name}</Title>
                            </Body>
                            <Right>
                            </Right>
                        </Header>
                        <Content>
                            <Camera
                                onBarCodeRead={this.handleBarCodeScanned}
                                style={{
                                    width: Dimensions.get('window').width,
                                    height: Dimensions.get('window').height / 2
                                }}
                            />
                            {
                                this.state.status === 'IDLE'
                                    ?
                                    null
                                    :
                                    <Card style={styles.card_info}>
                                        <CardItem header>
                                            <Text style={styles.card_info_title}>{card_info_title}</Text>
                                        </CardItem>
                                        <CardItem>
                                            <Body style={styles.card_info}>
                                            <Text style={styles.card_info_body}>
                                                {card_info_body}
                                            </Text>
                                            </Body>
                                        </CardItem>
                                        {
                                            button
                                        }
                                    </Card>
                            }
                        </Content>
                    </Container>
                );
            default:
                return null;
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state.event.events[state.event.selected]);
    return {
        ...ownProps,
        event: state.event
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        ...ownProps,
        addTicket: (event_idx, idx) => {dispatch(EventAdd(event_idx, idx))}
    }
};

export const Scanner = connect(mapStateToProps, mapDispatchToProps)(_Scanner);
