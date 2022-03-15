import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Form, Nav, Button } from 'react-bootstrap'
import { Row, Col, Tab } from 'react-bootstrap'
import { useEasybase } from 'easybase-react'

export default function SignIn() {
    const { signIn, signUp } = useEasybase();
    const history = useHistory();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSignInClick = async () => {
        const res = await signIn(email, password);
        if (res.success) {
            history.push("/");
        } else {
            alert("Неправильный email или пароль!");
        }
    }

    const onSignUpClick = async () => {
        const res = await signUp(email, password, { "name": userName });
        if (res.success) {
            await signIn(email, password);
            alert("Регистрация прошла успешно!");
            history.push("/");
        } else {
            alert("Не удалось зарегистрироваться!");
        }
    }

    return (
        <Container className="mt-5">
            <Tab.Container id="left-tabs" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column mt-2">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Войти</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Зарегистрироваться</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <Form style={{ marginTop: '1rem' }}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="sighT">Email</Form.Label>
                                        <Form.Control type="email" required placeholder="Введите email.." value={email} onChange={e => setEmail(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label className="sighT">Пароль</Form.Label>
                                        <Form.Control type="password" required placeholder="Введите пароль.." value={password} onChange={e => setPassword(e.target.value)} />
                                    </Form.Group>

                                    <Button variant="dark" onClick={onSignInClick}>Войти в аккаунт</Button>
                                </Form>
                            </Tab.Pane>

                            <Tab.Pane eventKey="second">
                                <Form style={{ marginTop: '1rem' }}>
                                    <Form.Group>
                                        <Form.Label className="sighT">Ваше имя</Form.Label>
                                        <Form.Control type="text" required placeholder="Введите имя.." value={userName} onChange={e => setUserName(e.target.value)} />
                                        <Form.Text className="text-dark">
                                            как к Вам смогут обращаться другие пользователи
                                            </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="sighT">Email</Form.Label>
                                        <Form.Control type="email" required placeholder="Введите email.." value={email} onChange={e => setEmail(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label className="sighT">Пароль</Form.Label>
                                        <Form.Control type="password" required placeholder="Введите пароль.." value={password} onChange={e => setPassword(e.target.value)} />
                                    </Form.Group>

                                    <Button variant="dark" onClick={onSignUpClick}>Зарегистрироваться</Button>
                                </Form>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    )
}