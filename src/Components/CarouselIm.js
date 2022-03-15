import React from 'react'
import Carousel from 'react-bootstrap/Carousel'

import catsImg from '../images/cats.jpg'
import dogImg from '../images/dog.jpg'
import parrotImg from '../images/parrot.jpg'

export default function CarouselIm() {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={catsImg}
                    style={{objectFit: 'cover'}}
                    alt="Cats"
                />
                <Carousel.Caption>
                    <h3>Для чего всё это?</h3>
                    <p>Помоги спасти жизни животным!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={dogImg}
                    style={{objectFit: 'cover'}}
                    alt="Dog"
                />
                <Carousel.Caption>
                    <h3>Для чего всё это?</h3>
                    <p>Не выбрасывай их на улицу!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={parrotImg}
                    style={{objectFit: 'cover'}}
                    alt="Parrot"
                />
                <Carousel.Caption>
                    <h3>Для чего всё это?</h3>
                    <p>Найди им новый дом!</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}