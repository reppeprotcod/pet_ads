import React, { useEffect, useState } from 'react'
import { Card, Container, Row, Col, Button, Dropdown } from 'react-bootstrap'
import { useEasybase } from 'easybase-react'
import { useParams } from 'react-router-dom'

import dogsImg from '../images/dogs.jpg'
import '../App.css'

export default function Home() {
    const [easybaseData, setEasybaseData] = useState([]);
    const [dataOffset, setDataOffset] = useState(0);
    const [sortType, setSortType] = useState("");

    const itemsPerPage = 5;

    const { db, e } = useEasybase();
    const { phrase } = useParams();

    useEffect(() => {
        const mounted = async () => {
            let ebData = null;

            if (phrase != null) ebData = (await db('NOTES', false).return().all()).filter((value) => {
                let exp = new RegExp(phrase, "i");
                return exp.test(value['main_info']) || exp.test(value['city']);
            });
            else ebData = await db('NOTES', false).return().all();

            if (sortType === "dateAsc") {
                ebData = ebData.sort((a, b) => {
                    let aDate = new Date(a.date);
                    let bDate = new Date(b.date);
                    if (aDate < bDate) return -1;
                    else if (aDate === bDate) return 0;
                    else return 1;
                });
            } else if (sortType === "dateDesc") {
                ebData = ebData.sort((a, b) => {
                    let aDate = new Date(a.date);
                    let bDate = new Date(b.date);
                    if (aDate < bDate) return 1;
                    else if (aDate === bDate) return 0;
                    else return -1;
                });
            }

            if(ebData)ebData = ebData.slice(dataOffset, dataOffset + itemsPerPage);
            setEasybaseData(ebData);
        }
        mounted();
    }, [db, dataOffset, e, phrase, sortType]);

    const PostCards = () => {
        if (easybaseData && easybaseData.map) {
            return easybaseData.map(ele => {
                let date = new Date(ele.date);
                return (<Card className="cardCol" style={{ margin: '1rem 0rem' }}>
                    <Row>
                        <Col md="auto">
                            <img alt="" src={ele.photo} style={{ display: 'inline-block', width: '6rem', height: '8rem', objectFit: 'cover', borderRadius: '3px' }} />
                        </Col>
                        <Col xs>
                            <h3 style={{ marginTop: '0.5rem' }}>{ele.main_info}</h3>
                            <div>{ele.extra_info}</div>
                            <div>{(date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "." + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "." + date.getFullYear()}</div>
                        </Col>
                        <Col md="auto" className="align-self-end">
                            <Button variant="dark" href={"/fullNote/" + ele.id} style={{ margin: '0.5rem' }}>Подробнее</Button>
                        </Col>
                    </Row>
                </Card>);
            });
        } else return (<div></div>);
    }

    const Posts = () => {
        if (easybaseData.length) {
            return (
                <div>
                    <PostCards />
                    <Button variant="dark" className="bottomBtn" onClick={onBackClick}>Назад</Button>
                    <span style={{ margin: '0rem 1rem', verticalAlign: '30%', fontWeight: 'bold' }}>{dataOffset / itemsPerPage + 1}</span>
                    <Button variant="dark" className="bottomBtn" onClick={onForwardClick}>Дальше</Button>
                </div>
            );
        } else return (<h2 style={{ marginTop: '1rem' }}>Нет объявлений</h2>);
    }

    const onBackClick = () => {
        if (dataOffset >= itemsPerPage) setDataOffset(dataOffset - itemsPerPage);
        else setDataOffset(0);
    }

    const onForwardClick = () => {
        if (dataOffset <= easybaseData.length - itemsPerPage + 1) setDataOffset(dataOffset + itemsPerPage);
    }

    const onDateAscClick = () => {
        setSortType("dateAsc");
    }

    const onDateDescClick = () => {
        setSortType("dateDesc")
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={4} className="text-center">
                    <Card className="mt-4 cardHome">
                        <Card.Img variant="top" src={dogsImg} />
                        <Card.Body>
                            <Card.Title>Перед тем, как завести питомца</Card.Title>
                            <Card.Text>Прочитайте статью и ответьте себе, готовы ли Вы взять на себя такую ответсвенность.</Card.Text>
                            <Button variant="dark" href="https://www.marieclaire.ru/psychology/4-voprosa-kotorye-nado-zadat-sebe-pered-tem-kak-zavesti-pitomca/" target="blank">Смотреть</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={8} style={{ marginTop: '1.5rem' }}>
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            Сортировать
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={onDateDescClick}>Сначала новые</Dropdown.Item>
                            <Dropdown.Item onClick={onDateAscClick}>Сначала старые</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Posts />
                </Col>
            </Row>
        </Container>
    )
}