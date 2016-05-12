import React from 'react'
import $ from 'jquery'
import { browserHistory, Link } from 'react-router'
import Formsy from 'formsy-react'
import { FormsyRadio, FormsyRadioGroup } from 'formsy-material-ui/lib'
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

class VotePoll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      question: null,
      pollOptions: null,
      loading: true,
      error: false,
      optionIdChecked: ''
    }
  }
  componentWillMount () {
    this.serverRequest = this._fetchPoll.bind(this)()
  }

  componentWillUnmount () {
    this.serverRequest.abort()
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

  render () {
    const { question, pollOptions, loading, error } = this.state
    const { pollId } = this.props.params
    return (
      <Card style={styles.card}>
        {
          error ? <h4 className='text-center' style={{color: 'red', 'marginLeft': '16px'}}>Cannot find poll</h4>
          :
          <div>
            <CardTitle title={`&VOTE! - ${question}`} style={styles.title} />
            <Formsy.Form onValidSubmit={this.createVote.bind(this)}>
              <FormsyRadioGroup name='options'>
                {
                  !loading ?
                  pollOptions.map((pollOption, i) => {
                    const { optionId, text } = pollOption
                    return (
                      <FormsyRadio
                        key={i}
                        onClick={this.checkedOption.bind(this, optionId)}
                        value={`${optionId}`}
                        label={text}
                        style={{margin: 16}}
                      />
                    )
                  }) : null
                }
              </FormsyRadioGroup>
              <CardActions>
                <FlatButton type='submit' label='Vote' primary={true} />
                <Link to={`/r/${pollId}`}>
                  <FlatButton label='Poll Results' />
                </Link>
              </CardActions>
            </Formsy.Form>
          </div>
        }
      </Card>
    )
  }

  createVote () {
    const { pollId } = this.props.params
    const { optionIdChecked } = this.state
    const data = {
      pollOptionId: optionIdChecked
    }

    if (!optionIdChecked) {
      return alert('Please select an option.')
    }

    $.ajax({
      method: 'POST',
      url: '/api/vote/',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json'
    }).always((result) => {
      if (result.status === 400) {
        return alert(JSON.parse(result.responseText).message)
      } else {
        if (screen.width <= 800) {
          window.location = `/r/${pollId}`;
        } else {
          browserHistory.push(`/r/${pollId}`)
        }
      }
    })
  }

  checkedOption (id) {
    this.setState({optionIdChecked: id})
  }
}

module.exports = VotePoll
