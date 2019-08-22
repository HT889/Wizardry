import React, { Component } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Figure,
  Card
} from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import "./fight.css";
// import axios from "axios";
import API from "../../utils/API";
import { timingSafeEqual } from "crypto";
import fighterImages from './fighterImages';
import Code from './code'
import backgroundImage from '../main-stats/backgroundImages'
import fightAvatars from './fightAvatars'


class Fight extends Component {
  state = {
    userStrength: "",
    monsterDescription: "",
    monsterStrength: "",
    monsterName: "",
    monsterImg: "",
    bgImage: backgroundImage[5],
    withdraw: false,
    won: false,
    loses: false,
    spellCode: "",
    code: "",
    characterImage: ""
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
      self.setState({
        monsterDescription, monsterImg: src, monsterName,
        monsterStrength: strength,
        monsterId: id
      }, function () {
        var monsterId = this.state.monsterId
        // console.log(Code(monsterId))
        var code = Code(monsterId)
        console.log(code)
        this.setState({ code })
      });

    });

    API.loadUser(key)
      .then(function (result) {
        console.log("RESULT", result)
        let { src } = fightAvatars[result.data.characterImage - 1];
        self.setState({
          characterName: result.data.characterName,
          house: result.data.house,
          userStrength: result.data.strength,
          characterImage: src
        })
      })

    this.setState({
      lives: localStorage.getItem("lives")
    })
  };

  //renders the spell name
  handleCode = e => {
    let spellCode = this.state.spellCode + e.target.value
    this.setState({
      spellCode
    })
    console.log(this.state.spellCode)
  }


  //clears spell name
  clear = () => {
    this.setState({ spellCode: "" })
  }



  fight = () => {

    let self = this
    let userStrength = parseInt(this.state.userStrength)
    let monsterStrength = parseInt(this.state.monsterStrength)
    let key = localStorage.getItem("key")
    console.log(userStrength)
    console.log(monsterStrength)


    if (userStrength > monsterStrength && this.state.spellCode === this.state.code) {
      alert("Your spell is super effective \nYou have defeated " + self.state.monsterName)
      this.setState({ userStrength: userStrength + 20 }, function () {
        let data = []
        data.push(this.state.userStrength)
        console.log(data)
        API.updateUser(data, key)
          .then(function (result) {
            self.setState({ won: true })

          })

      })
    }
    else if (userStrength > monsterStrength) {
      alert("Your spell is not effective!!!!!")
      var lives = this.state.lives - 1
      this.setState({
        lives
      }, function () {
        localStorage.setItem("lives", this.state.lives)
      })

    }
    else {
      console.log(userStrength)
      alert("You are not strong enough!!!!!")
      var lives = this.state.lives - 1
      this.setState({
        lives
      }, function () {
        localStorage.setItem("lives", this.state.lives)
      })
    }
  }


  componentDidUpdate() {
    if (this.state.lives === 0) {

      this.setState({
        loses: true
      }, function () {
        alert("You have lost")
      })
    }
  }

  render() {

    if (this.state.won === true) {
      return <Redirect to="/main" />
    }
    if (this.state.loses === true) {
      return <Redirect to="/main" />
    }

    const { monsterImg } = this.state;
    const { characterImage } = this.state;
    // console.log('state.monsterImg', monsterImg);
    return (
      <div style={{ hight: "100vh", backgroundSize: "cover", backgroundImage: `url("${this.state.bgImage.src}")` }}>
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
                <Figure.Caption>
                  <Card id="monster" style={{ width: '18rem' }}>
                    <h3><strong>Monster!</strong></h3>
                    <ul>
                      <li><strong>Name: </strong>{this.state.monsterName}</li>
                      <li><strong>Description: </strong>{this.state.monsterDescription}</li>
                      <li><strong>Strength: </strong>{this.state.monsterStrength}</li>
                    </ul>
                  </Card>
                </Figure.Caption>
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
                  src={characterImage}
                  className="fighters"
                />
                <Figure.Caption>
                  <Card className="wizard" style={{ width: '18rem' }}>
                    <h3><strong>Wizard!</strong></h3>
                    <ul>
                      <li><strong>Name: </strong>{this.state.characterName}</li>
                      <li><strong>House: </strong>{this.state.house}</li>
                      <li><strong>Strength: </strong>{this.state.userStrength}</li>
                      <li><strong>Lives: </strong>{this.state.lives}</li>
                    </ul>
                  </Card>
                </Figure.Caption>
              </Figure>
            </Col>
          </Row>
          <p>{this.state.spellCode}</p>



          <Row className="justify-content-md-center">
            <Col xs={2}>
              <Button
                id="letterBtn"
                value="haigo"
                onClick={this.handleCode}
              >haigo</Button>
            </Col>

            <Col xs={2}>
              <Button
                id="letterBtn"
                value="won"
                onClick={this.handleCode}
              >won</Button>
            </Col>

            <Col xs={2}>
              <Button
                id="letterBtn"
                value="lidi"
                onClick={this.handleCode}
              >lidi</Button>
            </Col>

            <Col xs={2}>
              <Button
                id="letterBtn"
                value="tan"
                onClick={this.handleCode}
              >tan</Button>
            </Col>

            <Col xs={2}>
              <Button
                id="letterBtn"
                onClick={this.clear}
              >Clear</Button>
            </Col>
          </Row>

        </Container>
      </div >
    );
  }
}

export default Fight;