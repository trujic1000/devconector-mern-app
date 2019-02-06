import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  // Redirecting if we're already logged in
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  // Lifecycle hook called when component recieves props
  componentWillReceiveProps(nextProps) {
    // If authenticated redirect to dashboard
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    // If recieving errors, set state errors
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  // onChange method to link fields with state
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Submitting the form
  onSubmit = e => {
    e.preventDefault();

    const authData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(authData);
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.email || errors.auth
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  {(errors.password || errors.auth) && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.password || errors.auth
                    })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {(errors.password || errors.auth) && (
                    <div className="invalid-feedback">
                      {errors.password || errors.auth}
                    </div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
