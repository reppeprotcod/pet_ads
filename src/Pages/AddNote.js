import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Tab, Nav, CardColumns, Button, Card, Container, Form } from 'react-bootstrap'
import { useEasybase } from 'easybase-react'
import axios from 'axios'

export default function AddNote() {
    const [easybaseData, setEasybaseData] = useState([]);
    const [dataOffset, setDataOffset] = useState(0);

    const [mainInfo, setMainInfo] = useState("");
    const [extraInfo, setExtraInfo] = useState("");
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [city, setCity] = useState("");

    const [publishClicked, setPublishClicked] = useState(false);
    const [deleteClicked, setDeleteClicked] = useState(false);

    const itemsPerPage = 5;

    const history = useHistory();
    const { db, e, getUserAttributes } = useEasybase();

    useEffect(() => {
        const mounted = async () => {
            const ebData = await db('NOTES', true).return().limit(itemsPerPage).offset(dataOffset).all();
            setEasybaseData(ebData);
        }
        mounted();
    }, [db, dataOffset]);

    const PostCards = () => {
        if (easybaseData && easybaseData.map) {
            return easybaseData.map(ele =>
                <Card style={{height: '30rem'}}>
                    <Card.Img variant="top" src={ele.photo} style={{ height: '50vh', objectFit: 'cover' }} />
                    <Card.Body>
                        <Card.Title>{ele.main_info}</Card.Title>
                        <Card.Text>{ele.extra_info}</Card.Text>
                        <Button variant="dark" onClick={() => { onDeleteClick(ele.id); }} >Удалить</Button>
                    </Card.Body>
                </Card>
            );
        } else return (<div></div>);
    }

    const Posts = () => {
        if (easybaseData.length) {
            return (
                <div>
                    <CardColumns style={{ marginTop: '1rem' }}>
                        <PostCards />
                    </CardColumns>
                    <Button variant="dark" className="bottomBtn" onClick={onBackClick}>Назад</Button>
                    <span style={{ margin: '0rem 1rem', verticalAlign: '30%', fontWeight: 'bold' }}>{dataOffset + 1}</span>
                    <Button variant="dark" className="bottomBtn" onClick={onForwardClick}>Дальше</Button>
                </div>
            );
        } else return (<h2 style={{ margin: '1rem 0rem 0rem 0rem' }}>Нет опубликованных объявлений</h2>);
    }

    const onBackClick = () => {
        if (dataOffset >= itemsPerPage) setDataOffset(dataOffset - itemsPerPage);
        else setDataOffset(0);
    }

    const onForwardClick = () => {
        const length = easybaseData.length;
        if (dataOffset <= length - itemsPerPage + 1) setDataOffset(dataOffset + itemsPerPage);
    }

    const onPublishClick = () => {
        if (publishClicked === true) return;
        setPublishClicked(true);
        let reader = new FileReader();
        reader.onloadend = (event) => {
            let body = new FormData();
            body.set('key', 'f30b929350dd82871534c6ced19f12a3');
            body.append('image', event.target.result.split(",").pop());
            axios({
                method: 'POST',
                url: 'https://api.imgbb.com/1/upload',
                data: body
            }).then(async (res) => {
                let length = (await db('NOTES', false).return().all()).length;
                let lastId = (await db('NOTES', false).return().all())[length - 1].id;
                let attributes = await getUserAttributes();
                let record = {
                    main_info: mainInfo,
                    extra_info: extraInfo,
                    photo: res.data.data.image.url,
                    user_name: attributes['name'],
                    user_phone: userPhone,
                    user_email: userEmail,
                    city: city,
                    id: lastId + 1,
                    views: 0,
                    date: Date.now()
                };
                await db('NOTES', true).insert(record).one();
                alert("Объявление успешно добавлено!");
                setPublishClicked(false);
                history.push("/");
            });
            setPublishClicked(false);
        }
        reader.readAsDataURL(document.getElementById('userPetImg').files[0]);
    }

    const onDeleteClick = async (id) => {
        if (deleteClicked === true) return;
        setDeleteClicked(true);
        await db('NOTES').delete().where(e.eq('id', id)).one().then(() => {
            alert("Объявление успешно удалено!");
            setDeleteClicked(false);
            document.location.reload();
        });
    }

    return (
        <Container className="mt-5 addNoteForm">
            <Tab.Container id="left-tabs" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column mt-2">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Добавить объявление</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Мои объявления</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <Form style={{ marginTop: '1rem' }}>
                                    <Form.Group>
                                        <Form.Label>Главное о питомце:</Form.Label>
                                        <Form.Control type="text" required value={mainInfo} onChange={e => setMainInfo(e.target.value)} />
                                        <Form.Text>кто, порода (если есть), пол</Form.Text>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Дополнительная информация</Form.Label>
                                        <Form.Control as="textarea" rows={2} value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Ваш город</Form.Label>
                                        <Form.Control type="text" required value={city} onChange={e => setCity(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.File id="userPetImg" label="Добавьте фото" />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Как с вами смогут связаться:</Form.Label>
                                        <Form.Control type="email" placeholder="Введите email.." required value={userEmail} onChange={e => setUserEmail(e.target.value)} />
                                        <Form.Text>*обязательно</Form.Text>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Control type="text" placeholder="Введите номер телефона.." value={userPhone} onChange={e => setUserPhone(e.target.value)} />
                                        <Form.Text>*по желанию</Form.Text>
                                    </Form.Group>

                                    <Button variant="dark" className="bottomBtn" onClick={onPublishClick}>Опубликовать</Button>
                                </Form>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <Posts />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    )
}