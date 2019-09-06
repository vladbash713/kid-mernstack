import React from 'react';
import SignUpForm from '../../components/signupform';

export default class Signup extends React.Component {
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
                <SignUpForm></SignUpForm>
            </div>
        );
    }
}
