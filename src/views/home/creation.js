import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Container, Header, Left, Body, Title, Right, Button, Icon, Content, Form, Item, Label, Input, Text} from 'native-base';
import {withNavigation} from 'react-navigation';
import { BarCodeScanner, Permissions, Camera } from 'expo';
import {Vibration} from 'react-native';
import EthAddr from 'ethereum-address';

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

export class _Creation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: ''
        };
        this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    handleBarCodeScanned({type, data, target}) {
        if (type === BarCodeScanner.Constants.BarCodeType.qr) {
            try {
                const {name, address} = JSON.parse(data);
                if (!name || !address) return ;
                if (this.state.name !== name || this.state.address !== address)
                    Vibration.vibrate(500);
                this.setState({
                    name: name,
                    address: address
                })
            } catch (e) {

            }
        }
    }

    checkForm() {
        if (this.state.address !== '') {
            if (EthAddr.isChecksumAddress(this.state.address))
                return 0;
            else
                return 2;
        }
        return 1;
    }

    render() {
        const check = this.checkForm();
        let button;

        switch (check) {
            case 0:
                button = <Button style={{width: Dimensions.get('window').width, justifyContent: 'center'}} primary block full>
                    <Text style={{textAlign: 'center'}}>Create</Text>
                </Button>;
                break ;
            case 1:
                button = <Button style={{width: Dimensions.get('window').width, justifyContent: 'center'}} disabled block full>
                    <Text style={{textAlign: 'center'}}>Create</Text>
                </Button>;
                break ;
            case 2:
                button = <Button style={{width: Dimensions.get('window').width, justifyContent: 'center'}} danger block full>
                    <Text style={{textAlign: 'center'}}>Invalid Address</Text>
                </Button>;
                break ;
            default:
                button = <Button style={{width: Dimensions.get('window').width, justifyContent: 'center'}} disabled block full>
                    <Text style={{textAlign: 'center'}}>Create</Text>
                </Button>;
        }
        return (
            <Container>
                <Header style={styles.head} transparent>
                    <Left>
                        <Button transparent onPress={() => {this.props.navigation.pop()}}>
                            <Icon style={{fontSize: 25, marginLeft: 10}} type="Ionicons" name="ios-arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title style={styles.title}>create event</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content>
                    <Camera
                        onBarCodeRead={this.handleBarCodeScanned}
                        style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2}}
                    />
                    <Form>
                        <Item floatingLabel>
                            <Label style={{fontSize: 10}}>Name</Label>
                            <Input style={{fontSize: 12}} value={this.state.name} onChangeText={(val) => this.setState({name: val})}/>
                        </Item>
                        <Item floatingLabel last>
                            <Label style={{fontSize: 10}}>Address</Label>
                            <Input style={{fontSize: 12, fontFamily: 'RobotoMono'}} value={this.state.address} onChangeText={(val) => this.setState({address: val})}/>
                        </Item>
                        {
                            button
                        }
                    </Form>
                </Content>
            </Container>
        );
    }
}

export const Creation = withNavigation(_Creation);
