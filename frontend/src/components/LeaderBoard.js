import React from 'react';
import {OK} from 'http-status-codes';

import {Card, Dropdown, Grid, Icon, Menu} from 'semantic-ui-react';

import defaultUIConfig from '../config/defaultUIConfig';
import APIHandler from '../handlers/APIHandler';
import getLoadingScreen from './getLoadingScreen';

export default class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      trophyColors: new Map([[1, 'golden'], [2, 'silver'], [3, 'bronze']]),
      leaderBoard: [],
      executionId: 1,
      executions: [],
      execution: 'execution1',
      teacher: window.location.pathname.includes('teacher')
    };
  }

  componentDidMount() {
    this.getExecutions();
    this.getLeaderBoard(this.state.executionId);
  }

  getExecutions = () => {
    APIHandler.getExecutions().then(resData => {
      const executions = resData.data.content
        .map(element => {
          let returnValue = {};
          returnValue.key = element.id;
          returnValue.text = element.id + ' - ' + element.name;
          returnValue.value = element.id;
          return returnValue;
        })
        .sort((a, b) => a.key > b.key);
      this.setState({executions});
    });
  };

  getLeaderBoard = executionId => {
    APIHandler.getLeaderBoard(executionId).then(resData => {
      if (resData.status === OK) {
        let {leaderBoard, scoreList} = this.calculateLeaderBoard(resData.data);
        leaderBoard = this.checkMoreParticipants(leaderBoard, scoreList);
        this.setState({leaderBoard, loading: false});
      }
    });
  };

  checkMoreParticipants = (leaderBoard, scoreList) => {
    if (this.state.teacher) {
      leaderBoard = leaderBoard.concat(scoreList);
    } else if (!leaderBoard.some(element => element[1].me)) {
      leaderBoard = leaderBoard.concat(
        scoreList.filter(element => element[1].me)
      );
    }
    return leaderBoard;
  };

  calculateLeaderBoard = scoreData => {
    let rankingStartPosition = 0;
    let rankingCurrentScore = 0;
    const scoreList = this.sortLeaderBoard(scoreData).map((element, index) => {
      if (element[1].userScore !== rankingCurrentScore) {
        rankingCurrentScore = element[1].userScore;
        rankingStartPosition += 1;
      }
      element.ranking = rankingStartPosition;
      return element;
    });
    let leaderBoard = scoreList.splice(0, defaultUIConfig.maxTrophyValue);
    return {leaderBoard, scoreList};
  };

  sortLeaderBoard = scoreData => {
    return Object.entries(scoreData).sort(
      (a, b) => a[1].userScore < b[1].userScore || b[1].me
    );
  };

  getScore = rankingValue => {
    return (rankingValue * 100).toFixed(2) + '%';
  };

  changeExecutionState = (event, data) => {
    this.setState({loading: true, executionId: data.value});
    this.getLeaderBoard(data.value);
  };

  render() {
    return (
      <Grid padded>
        <Grid.Row>
          <Dropdown
            fluid
            search
            selection
            closeOnBlur
            scrolling
            options={this.state.executions}
            onChange={this.changeExecutionState}
            defaultValue={this.state.executionId}
          />
        </Grid.Row>
        <Grid.Row centered>
          {this.state.loading ? (
            getLoadingScreen()
          ) : (
            <Card.Group centered>
              {this.state.leaderBoard.map((element, index) => (
                <Card
                  key={'scoreCard' + element[1].userName}
                  color={element[1].me && !this.state.teacher ? 'green' : null}
                  fluid={index >= defaultUIConfig.maxTrophyValue}
                >
                  <Card.Content>
                    <Card.Header>
                      <Menu text>
                        <Menu.Item content={'Rang: ' + element.ranking} />
                        {element.ranking <= defaultUIConfig.maxTrophyValue && (
                          <Menu.Item>
                            <Icon
                              name="trophy"
                              className={
                                this.state.trophyColors.get(element.ranking) +
                                'Trophy'
                              }
                            />
                          </Menu.Item>
                        )}
                        <Menu.Item
                          position="right"
                          content={this.getScore(element[1].userScore)}
                        />
                      </Menu>
                    </Card.Header>
                    <Card.Description
                      className="userScoreName"
                      content={element[1].userName}
                    />
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Row>
      </Grid>
    );
  }
}