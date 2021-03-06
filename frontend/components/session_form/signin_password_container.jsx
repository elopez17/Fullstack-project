import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom'
import { login } from '../../actions/session_actions';
import { closeModal, openModal } from '../../actions/modal_actions';
import { receiveErrors, clearErrors } from '../../actions/session_actions';


const mapStateToProps = (state) => ({
  errors: state.errors.session,
  formType: 'signin_password',
});

const mapDispatchToProps = (dispatch) => ({
  submitForm: (user) => dispatch(login(user)),
  openModal: (payload) => dispatch(openModal(payload)),
  closeModal: () => dispatch(closeModal()),
  receiveErrors: (errors) => dispatch(receiveErrors(errors)),
  clearErrors: () => dispatch(clearErrors()),
});

class SigninPasswordForm extends React.Component {
  constructor(props){
    super(props);
    this.state = { email: props.email, password: ''};
    this.updateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToEmailForm = this.goToEmailForm.bind(this);
  }

  updateField(field){
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  handleSubmit(){
    if (this.state.password.length < 6) {
      this.props.receiveErrors(['Use at least 6 characters.']);
      this.props.openModal({email: this.state.email, modal: 'signin_password'});
      return -1;
    } else {
      this.props.submitForm(this.state)
      .then(res => {
        this.props.clearErrors();
        this.props.history.push(`/users/${res.user.id}`);
      },
      err => this.props.openModal({email: this.state.email, modal: 'signin_password'}));
    }
  }

  goToEmailForm(){
    this.props.clearErrors();
    this.props.openModal({ email: this.state.email, modal: 'signin' });
  }

  render(){
    return (
      <form className="signin-password-form">
        <input readOnly className="signin-password-email" onClick={this.goToEmailForm} type='text' value={this.state.email} />
        <input className="signin-password-inp" onChange={this.updateField('password')} type='password' value={this.state.password} placeholder="Your Password *" />
        <div className="signin-password-errors">{this.props.errors[0]}</div>
        <button className="signin-password-submit" onClick={this.handleSubmit}>Sign in</button>
      </form>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SigninPasswordForm));
