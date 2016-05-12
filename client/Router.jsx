import React from 'react'
import {render} from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'

import Layout from './modules/shared/Layout.jsx'
import NotFoundPage from './modules/shared/NotFoundPage.jsx'
import CreatePoll from './modules/poll/CreatePoll.jsx'
import ResultPoll from './modules/poll/ResultPoll.jsx'
import VotePoll from './modules/poll/VotePoll.jsx'

const rootRoute = (
  <Router history={browserHistory}>
      <Route path='/' component={Layout}>
          <IndexRoute component={CreatePoll} />
          <Route path='v/:pollId' component={VotePoll} />
          <Route path='r/:pollId' component={ResultPoll} />
          <Route path='*' component={NotFoundPage} />
      </Route>
  </Router>
)

injectTapEventPlugin();

render(
	rootRoute,
	document.getElementById('app')
)
