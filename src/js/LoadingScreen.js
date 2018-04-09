const React = require('react');

export class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id='loading-screen' className='loading-extension'>
        <div id='oxy-logo' className='oxy-logo'>
          {'O'}
        </div>
        <div className='loading-info'>
          Loading your dashboard...
        </div>
      </div>
    );
  }
}

module.exports = LoadingScreen;
