import React, { Component } from 'react';

declare global {
    interface Window {
        instagram: any;
    }
}

interface InstagramLoginProps {
    clientId: string;
    onSuccess: (response: any) => void;
    onFailure: (error: any) => void;
    scope?: string;
    buttonText?: string;
    render: (props: {
        onClick: () => void;
        isProcessing: boolean;
    }) => JSX.Element;
}

interface InstagramLoginState {
    isProcessing: boolean;
}

class InstagramLogin extends Component<InstagramLoginProps, InstagramLoginState> {
    _isMounted: boolean;

    static defaultProps = {
        scope: 'user_profile',
        buttonText: 'Login with Instagram',
    };

    constructor(props: InstagramLoginProps) {
        super(props);
        this.state = {
            isProcessing: false,
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadInstagramSdk();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setStateIfMounted = (state: Partial<InstagramLoginState>) => {
        if (this._isMounted) {
            this.setState(state as InstagramLoginState);
        }
    };

    loadInstagramSdk() {
        if (document.getElementById('instagram-sdk')) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'instagram-sdk';
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    click = () => {
        if (this.state.isProcessing) {
            return;
        }

        this.setStateIfMounted({ isProcessing: true });

        window.instagram.login({
            clientId: this.props.clientId,
            scope: this.props.scope,
            redirectUri: `${window.location.origin}/instagram-login`,
            onSuccess: this.handleSuccess,
            onFailure: this.handleFailure,
        });
    };

    handleSuccess = (response: any) => {
        this.props.onSuccess(response);
        this.setStateIfMounted({ isProcessing: false });
    };

    handleFailure = (error: any) => {
        this.props.onFailure(error);
        this.setStateIfMounted({ isProcessing: false });
    };

    render() {
        const { buttonText, render } = this.props;
        const { isProcessing } = this.state;

        return render({
            onClick: this.click,
            isProcessing,
        });
    }
}

export default InstagramLogin;
