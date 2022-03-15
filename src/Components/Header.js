import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Search } from 'react-bootstrap-icons'
import { Container, Form, FormControl, Nav, Navbar, Button, InputGroup } from 'react-bootstrap'
import { useEasybase } from 'easybase-react'

export default function Header() {
    const { isUserSignedIn, signOut } = useEasybase();
    const history = useHistory();

    const [ phrase, setPhrase ] = useState("");

    const onSearchClick = () => {
        if (phrase.replace(/\s+/, '').length > 0) {
            history.push("/search/" + phrase);
        }
    }

    const onSignOutClick = () => {
        signOut();
        history.push("/");
    }

    const SignInButton = () => {
        if (isUserSignedIn()) return (<Nav.Link onClick={onSignOutClick}>Выйти</Nav.Link>);
        else return (<Nav.Link href="/signIn">Войти</Nav.Link>);
    }

    const AddButton = () => {
        if (isUserSignedIn()) return (<Nav.Link href="/addNote">Добавить объявление</Nav.Link>);
        else return (<div></div>);
    }

    return (
        <div>
            <Navbar className="head" fixed="top" collapseOnSelect expand="md" variant="dark" >
                <Container>
                    <Navbar.Brand href="/">FiPe</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/about">О сайте</Nav.Link>
                            <AddButton />
                            <SignInButton />
                        </Nav>
                        <Form inline>
                            <InputGroup>
                                <FormControl type="text" placeholder="Поиск.." value={phrase} onChange={e => setPhrase(e.target.value)} onKeyPress={e => { if(e.key === 'Enter') onSearchClick(); }}/>
                                <InputGroup.Append>
                                    <Button variant="light" style={{ backgroundСolor: 'white' }} onClick={onSearchClick}>
                                        <Search style={{ marginTop: '-3px'}}/>
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}