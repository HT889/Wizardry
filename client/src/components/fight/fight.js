import React, { Component } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Figure,
  Image,
  ImageProps
} from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import "./fight.css";
// import axios from "axios";
import API from "../../utils/API";
import { timingSafeEqual } from "crypto";
import fighterImages from './fighterImages';
import Code from './code'
import backgroundImage from '../main-stats/backgroundImages'


class Fight extends Component {
  state = {
    userStrength: "",
    monsterDescription: "",
    monsterStrength: "",
    monsterName: "",
    monsterImg: "",
    bgImage: backgroundImage[5],
    withdraw: false,
    fight: false,
    spellCode: ""

  };

  withdraw = () => {
    this.setState({
      withdraw: true
    });
  };

  componentDidMount = () => {
    let equ = document.location.search.indexOf("=");
    let id = parseInt(document.location.search.substr(equ + 1));
    let self = this;
    var key = localStorage.getItem("key");
    API.getOneMonster(id).then(function ({
      data: { monsterDescription, imageIndex, monsterName, strength, id }
    }) {
      // if imageIndex is an id (from database) that correlates to index value of the id in fightersImage array, then
      //  this.state.imageIndex = fighterImages[imageIndex]

      let { src } = fighterImages[imageIndex]; { }
      self.setState({ monsterDescription, monsterImg: src, monsterName, strength, monsterId: id });

    });

    API.loadUser(key)
      .then(function (result) {
        self.setState({
          characterName: result.data.characterName,
          house: result.data.house,
          userStrength: result.data.strength
        })
      })

    var code = Code(this.state.monsterId)
    console.log("+++++" + code)
  };


  handleCode = e => {
    let spellCode = { ...this.state.spellCode } + e.target.value
    this.setState({
      spellCode
    })
  }

  fight = () => {

    let self = this
    let userStrength = this.state.userStrength
    let monsterStrength = this.state.strength
    let key = localStorage.getItem("key")
    console.log(userStrength)


    if (userStrength > monsterStrength && this.state.spellCode === code) {
      alert("You have defeated "+ self.state.monsterName)
      this.setState({ userStrength: userStrength + 20 }, function () {
        let data = []
        data.push(this.state.userStrength)
        console.log(data)
        API.updateUser(data, key)
          .then(function (result) {
            self.setState({ fight: true })
            console.log(self.state.fight)
          })

      })
    }
    else {
      console.log(userStrength)
      alert("you are not strong enough")
    }
  }




  render() {

    if (this.state.fight === true) {
      return <Redirect to="/main" />
    }


    const { monsterImg } = this.state;
    // console.log('state.monsterImg', monsterImg);
    return (

      <div style={{ hight: "100vh", backgroundImage: `url("${this.state.bgImage.src}")` }}>
        <Container>
          <Link to="/main">
            <Button className="withdrawBtn" onClick={this.withdraw} variant="primary">
              Withdraw
           </Button>
          </Link>
          <Row >
            {/* <Col xs={{ span: 4, offset: 2 }}> */}
            <Col xs={{ span: 4, offset: 1 }}>
              <Figure>
                <Figure.Image id="fightContainer"
                  width={300}
                  height={300}
                  alt="175x175"
                  src={monsterImg}
                  className="fighters"
                />
                <Figure.Caption>Monster!</Figure.Caption>
              </Figure>
            </Col>


            <Col>

              <Button id="fightBtn" onClick={this.fight} variant="primary" size="lg">
                Cast spell!
            </Button>

            </Col>

            <Col className="justify-content-end" xs={5}>
              <Figure>
                <Figure.Image id="fightContainer"
                  width={300}
                  height={300}
                  alt="175x175"
                  src="https://picsum.photos/id/660/300/300"
                  className="fighters"
                />
                <Figure.Caption className="justify-content-center">
                  <ul>
                    <li>Name: {this.state.characterName}</li>
                    <li>House: {this.state.house}</li>
                    <li>Strength: {this.state.userStrength}</li>
                  </ul>
                </Figure.Caption>
              </Figure>
            </Col>
          </Row>


          <Row className="justify-content-md-center">
                        <Col xs={2}>
                        <Button id = "letterBtn">1</Button>
                        </Col>

                        <Col xs={2}>
                        <Button id = "letterBtn">2</Button>
                        </Col>

                        <Col xs={2}>
                        <Button id = "letterBtn">3</Button>
                        </Col>

                        <Col xs={2}>
                        <Button id = "letterBtn">4</Button>
                        </Col>

                    </Row>

        </Container>
      </div >
    );
  }
}

export default Fight;


