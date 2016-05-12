import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router'
import { List, ListItem } from 'material-ui/List'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

const styles = {
  card: {
    'margin': 'auto',
    'marginTop': '8px',
    'marginBottom': '8px',
    'maxWidth': '500px',
    'flex': '1'
  },
  title: {
    'paddingBottom': '0px'
  },
  content: {
    'display': 'flex',
    'flexDirection': 'column'
  }
}

class ResultPoll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      question: null,
      pollOptions: null,
      loading: true,
      error: false
    }
  }

  componentWillMount () {
    this.serverRequest = this._fetchPoll.bind(this)()
  }

  componentDidMount() {
    this._timer = setInterval(() => this._fetchPoll.bind(this)(), 4000)
  }

  _fetchPoll () {
    const { pollId } = this.props.params
    return $.get(`/api/poll/${pollId}`, (result) => {
      const { question, pollOptions } = result
      this.setState({
        question,
        pollOptions,
        loading: false
      })
    }).fail(() => {
      this.setState({error: true})
    })
  }

  componentWillUnmount () {
    this.serverRequest.abort()
    clearInterval(this._timer)
  }
  render () {
    const { question, pollOptions, loading, error } = this.state
    const { pollId } = this.props.params
    return (
      <Card style={styles.card}>
        <CardTitle title={error ? null : question} style={styles.title} />
        <CardText style={styles.content}>
          {error ? <h4 style={{color: 'red'}}>Cannot find poll.</h4> : null}
          <List>
            {
              !loading ? pollOptions.map((option, i) => {
                const { optionId, text, voteCount } = option
                return (
                  <ListItem key={i}
                    primaryText={`Option: ${text}`}
                    secondaryText={`Votes: ${voteCount}`}
                    disabled={true}
                  />
                )
              }) : null
            }
          </List>
        </CardText>
        {
            !error ?
              <CardActions>
                <Link to={`/v/${pollId}`}>
                  <FlatButton label='Vote on this poll' primary={true}/>
                </Link>
              </CardActions>
              :
              null
          }
      </Card>
    )
  }
}

module.exports = ResultPoll
