
import React, { Component } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import "./login.css"
import { Link, Redirect } from "react-router-dom";
import API from "../../utils/API"

class Login extends Component {

    state = {
        email: "",
        password: "",
        id: "",
        play: false
    }
    componentDidMount() {
        localStorage.clear()
    }


    validateForm = () => {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = event => {
        let self = this;
        event.preventDefault();
        console.log(this.state)

        API.loginUser(this.state)
            .then(function (result) {

                console.log(result)
                let data = result.data
                if (result.data.isUser) {


                    self.setState({
                        password: "",
                        id: data.id
                    }, function () {
                        localStorage.setItem("key", self.state.id.toString())
                    })

                    self.setState({
                        play: true
                    })
                }
                else {
                    alert('Incorrect Username and/or Password!');
                }

            }).catch(err => {
                alert(err);
            })

    }




    render() {

        if (this.state.play === true) {
            return <Redirect to="/main" />
        }

        return (
            <div>
                <Container>
                    <h1>Wizard Game Login</h1>

                    <p>
                        Cast spells to defeat monsters!
                </p>
                    <aside id="loginaside">
                        <Form className="loginForm" onSubmit={this.handleSubmit}>
                            <Form.Group as={Row} controlId="formHorizontalEmail">
                                <Form.Label column sm={2}>
                                    Email
                        </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        autoFocus
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>
                                    Password
                         </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        autoFocus
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </Col>
                            </Form.Group>

                            <Button
                                className="btn"
                                variant="primary"
                                type="submit"
                                disabled={!this.validateForm()}>
                                Play
                             </Button>

                            <Link to="/createuser">
                                <Button className="btn" variant="primary">
                                    Create an account
                           </Button>
                            </Link>
                        </Form>
                    </aside>
                </Container>
            </div>
        );
    }
}


export default Login;