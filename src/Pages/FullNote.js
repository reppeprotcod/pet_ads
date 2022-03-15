import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { useEasybase } from 'easybase-react'
import { useParams } from 'react-router-dom'

export default function FullNote() {
    const { id } = useParams();
    const { db, e, useReturn } = useEasybase();
    const { frame } = useReturn(() => db('NOTES').return().where(e.eq('id', Number(id))), [id]);

    return (
        <Container className="mt-5" style={{ marginBottom: '2rem' }}>
            <Row>
                <Col sm={8}>
                    <Card className="mt-4 cardCol">
                        {frame.map(ele =>
                            <Container style={{ padding: '1rem 2rem 2rem 2rem' }}>
                                <img alt="" src={ele.photo} style={{ width: '100%', height: '70vh', objectFit: 'contain' }} />
                                <h3 style={{ marginTop: '0.5rem' }}>{ele.main_info}</h3>
                                <div>{ele.extra_info}</div>
                            </Container>
                        )}
                    </Card>
                </Col>
                <Col sm={4} className="text-right">
                    {frame.map(ele =>
                        <Card className="mt-4 cardHome">
                            <Card.Body>
                                <Card.Title>{ele.user_name}</Card.Title>
                                <Card.Text>{ele.user_phone}</Card.Text>
                                <Card.Text>{ele.user_email}</Card.Text>
                                <Card.Text>{ele.city}</Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}