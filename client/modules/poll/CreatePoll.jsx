import React from 'react'
import $ from 'jquery'
import { browserHistory } from 'react-router'
import { Card, CardActions, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'

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
    'flexDirection': 'column',
    'margin': '24px',
    'marginTop': '0px'
  }
}

class CreatePoll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      optionsCount: 2
    }
  }
  render () {
    const options = this.createOptions.bind(this)()

    return (
      <Card style={styles.card}>
        <CardTitle title='Create Poll' style={styles.title} />
        <Formsy.Form onValidSubmit={this.createPoll.bind(this)} >
          <div style={styles.content}>
            <FormsyText
              name='question'
              ref='question'
              hintText='Enter a question...'
              floatingLabelText='Question'
            />
            {options}
          </div>
          <CardActions>
            <FlatButton type='submit' label='Create' primary={true} />
          </CardActions>
        </Formsy.Form>
      </Card>
    )
  }

  createOptions () {
    const { optionsCount } = this.state
    let options = []

    for (var i = 0; i < optionsCount; i++) {
      const index = i + 1
      let addOption
      let removeOption

      if (i === optionsCount - 1) {
        addOption = this.addOption.bind(this)
      }
      if (i === optionsCount - 2) {
        removeOption = this.removeOption.bind(this)
      }

      const optionElement = (
        <FormsyText
          key={index}
          name={`option${index}`}
          ref={`option${index}`}
          onFocus={addOption}
          onBlur={removeOption}
          hintText={`Enter option ${index}...`}
          floatingLabelText={`Option ${index}`}
        />
      )
      options.push(optionElement)
    }
    return options
  }

  addOption () {
    const { optionsCount } = this.state
    this.setState({optionsCount: optionsCount + 1})
  }

  removeOption () {
    const { optionsCount } = this.state
    const lastOption = this.refs[`option${optionsCount - 1}`]
    if (!lastOption.getValue() && optionsCount > 2) {
      this.setState({optionsCount: optionsCount - 1})
    }
  }

  createPoll () {
    const { question } = this.refs

    let data = {
      question: question.getValue().trim(),
      options: []
    }

    for (let option in this.refs) {
      let optionValue = this.refs[option].getValue().trim()
      if (option !== 'question' && optionValue) {
        data.options.push(optionValue)
      }
    }

    const checkValidPoll = this.validatePoll(data)
    if (checkValidPoll) {
      return alert(checkValidPoll)
    }

    $.ajax({
      method: 'POST',
      url: '/api/poll',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json'
    }).done((result) => {
      browserHistory.push(`/v/${result.createdPollId}`)
    }).fail((er) => {
      console.log(er)
    })
  }

  validatePoll (pollData) {
    if (pollData.question.length <= 8) {
      return 'Question must be longer than 8 characters.'
    }
    if (pollData.options.length < 2) {
      return 'Must enter atleast 2 options.'
    }
    if (pollData.options.length > 16) {
      return 'Cannot enter more than 16 options'
    }
  }
}

module.exports = CreatePoll
