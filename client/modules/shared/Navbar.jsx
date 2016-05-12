import React from 'react'
import AppBar from 'material-ui/AppBar'

class Navbar extends React.Component {
  render () {
    return (
    	<AppBar
    		title='&amp;Vote'
        style={{'position': 'fixed'}}
        showMenuIconButton={false}
			/>
    )
  }
}

module.exports = Navbar
