import React from 'react';
import SignInForm from '../../components/signinform';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: ''
        }
    }

    render() {
        return (
            <div >
                <SignInForm></SignInForm>
            </div>
        );
    }
}
