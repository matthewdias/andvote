import React from 'react'
import { Link } from 'react-router'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import PlaylistAdd from 'material-ui/svg-icons/av/playlist-add'
import Navbar from './Navbar.jsx'

const lightMuiTheme = getMuiTheme(lightBaseTheme);

const styles = {
	app: {
		'height': '100%'
	},
  contents: {
    'display': 'flex',
    'alignItems': 'center',
  	'paddingTop': '64px'
  },
  fab: {
  	'position': 'fixed',
  	'margin': '24px',
  	'bottom': '0px',
  	'right': '0px',
    'zIndex': '1'
  }
}

class Layout extends React.Component {
  render () {
    const content = this.props.children
    return (
      <MuiThemeProvider muiTheme={lightMuiTheme}>
	    	<div style={styles.app}>
	    		<Navbar />
	    		<div style={styles.contents}>
	  	    	{content}
	  	    </div>
          <Link to='/'>
            <FloatingActionButton style={styles.fab}>
              <PlaylistAdd />
            </FloatingActionButton>
          </Link>
	    	</div>
	    </MuiThemeProvider>
    )
  }
}

module.exports = Layout
