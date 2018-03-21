const React = require('react');
const TimeDisplay = require('./TimeDisplay');
const BookmarkTray = require('./BookmarkTray');
const RestaurantList = require('./RestaurantList');
const BusList = require('./BusList');
const SettingsPanel = require('./SettingsPanel');
const LoadingScreen = require('./LoadingScreen');
const SettingsSectionConstants = require('./SettingsSectionConstants');
const NoticeBoard = require('./NoticeBoard');

const DefaultBookmarks = require('../data/default-bookmarks.json');
const DefaultOptions = require('../data/default-options.json');

const BACKGROUNDS = [
  {
    image: 'overhead.jpg',
    source: 'Occidental College',
    link: 'https://www.oxy.edu/maps-directions',
  },
  {
    image: 'thornehall.jpg',
    source: 'Occidental College',
    link: 'https://www.oxy.edu/life-oxy/our-campus/gallery/web-tour',
  },
  {
    image: 'erdman.jpg',
    source: 'Creative College Connections',
    link: 'http://www.creativecollegeconnections.com/blog/occidental-college',
  },
  {
    image: 'roses.jpg',
    source: 'Wikimedia',
    link: 'http://occidentalcollege.tumblr.com/',
  },
  {
    image: 'fowler.jpg',
    source: 'Occidental College',
    link: 'http://occidentalcollege.tumblr.com/',
  },
  {
    image: 'knitting.jpg',
    source: 'Occidental College',
    link: 'http://occidentalcollege.tumblr.com/',
  },
  {
    image: 'treesbynewcomb.jpg',
    source: 'Occidental College',
    link: 'http://occidentalcollege.tumblr.com/',
  }
];

const FADE_DURATION = 400;

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingImage: true,
      loadingData: true,
      settings: {
        bookmarks:[],
        options:{},
      },
      backgroundIndex: -1,
    }
  }

  componentWillMount() {
    this._initializeSettings();
  }

  _setBackground() {
    const index = Math.floor(Math.random() * BACKGROUNDS.length);
    let path = 'src/assets/backgrounds/' + BACKGROUNDS[index].image;
    this.setState({
      backgroundIndex: index,
    });

    var img = new Image();
    img.onload = () => {
      document.body.style.backgroundImage = 'url(' + path + ')';
      document.getElementById('loading-screen').classList.add('fade');
      setTimeout(() => {
        this.setState({
          loadingImage: false,
        });
      }, FADE_DURATION);
    };
    img.src = path;
  }

  _initializeSettings() {
    chrome.storage.sync.get('tabduke-settings', (data) => {
      let isEmpty = true;
      Object.keys(data).forEach((key) => {
        if (data.hasOwnProperty(key)) {
          isEmpty = false;
        }
      });

      if (isEmpty) {
        this.setState({
          loadingData: false,
          settings: {
            bookmarks: DefaultBookmarks.items,
            options: DefaultOptions.items,
          },
        }, () => {
          this._setBackground();
          chrome.storage.sync.set({'tabduke-settings': this.state.settings});
        });
      } else {
        this.setState({
          loadingData: false,
          settings: data['tabduke-settings'],
        }, () => {
          this._setBackground();
        });
      }
    });
  }

  updateSettings(settingType, key, newValue) {
    let newOptions = this.state.settings.options;
    let newBookmarks = this.state.settings.bookmarks;
    if (settingType === SettingsSectionConstants.OPTIONS) {
      newOptions[key].value = String(newValue);
    } else if (settingType === SettingsSectionConstants.BOOKMARKS) {
      newBookmarks = newValue;
    }

    this.setState({
      settings: {
        bookmarks: newBookmarks,
        options: newOptions,
      }
    }, () => {
      chrome.storage.sync.set({'tabduke-settings': this.state.settings});
    });
  }

  render() {
    let background = BACKGROUNDS[this.state.backgroundIndex];
    return (
      <div className='app'>
        {
          this.state.loadingImage
          ? <LoadingScreen/>
          : null
        }
        {
          this.state.loadingData
          ? null
          : (
            <div className='app-content'>
              <SettingsPanel
                dashboardSettings={this.state.settings}
                updateSettings={this.updateSettings.bind(this)}/>
              <TimeDisplay
                dashboardSettings={this.state.settings}
                updateSettings={this.updateSettings.bind(this)}/>
              <BookmarkTray
                dashboardSettings={this.state.settings}
                updateSettings={this.updateSettings.bind(this)}/>
              <div className='info-container'>
                <RestaurantList dashboardSettings={this.state.settings}/>
                <BusList/>
              </div>
            </div>
          )
        }
        {
          background
          ? (
            <div className='background-source'>
              {'Photo by '}
              <a href={background.link}>
                <strong>{background.source}</strong>
              </a>
            </div>
          ) : null
        }
        <div className='credits'>
          {'Thought of by '}
          <strong>Louis Li</strong>
          {' | Developed by '}
          <strong>Kevin He</strong>
        </div>
      </div>
    );
  }
}

module.exports = App;
