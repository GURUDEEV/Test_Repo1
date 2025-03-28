import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { UIShell, GlobalFooter, AvatarMenu } from '@citi-icg-172888/icgds-patterns-react';
import { 
  Breadcrumb, Tab, themes, Menu, Switch, Button, El, Card, 
  Select, Icon, Badge, Section, Tag, Popover, Modal 
} from '@citi-icg-172888/icgds-react';

// Custom Components
import CustomizedContent from './CustomizedContent';
import LineChart from './DataFetch/LineChart';
import FetchData from './DataFetch/FetchData';
import SuccessRate from './DataFetch/SuccessRate';
import ChurnRate from './DataFetch/ChurnRate';
import CapacityUtil from './DataFetch/CapacityUtil';
import SentimentBarChart from './DataFetch/SentimentAnalysis';
import CustomizeFilter from './DataFetch/AdvanceFilter';

// Assets
import citiLogoFooter from '@citi-icg-172888/icgds-icons/logos/Citi_Logo.svg';
import citiLogo from '@citi-icg-172888/icgds-icons/logos/28px/Citi_Logo.svg';
import citiLogoAlt from '@citi-icg-172888/icgds-icons/logos/28px/Citi_Logo_Alternative.svg';

// Styles
import '@citi-icg-172888/icgds/dist/css/icgds.css';
import '@citi-icg-172888/icgds-ag-grid/dist/css/icgds-ag-theme.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Constants
const GRID_BREAKPOINTS = [
  { key: 'xs', value: 0 },
  { key: 'sm', value: 584 },
  { key: 'md', value: 784 },
  { key: 'lg', value: 1072 },
  { key: 'xl', value: 1264 },
  { key: '2xl', value: 1680 }
];

const FOOTER_LINKS = [
  {
    label: 'Terms and Conditions',
    url: 'https://secure.citi.com/brandcentral/site/assets/downloads/footer/citi_brand_central_terms_and_conditions.pdf',
  },
  {
    label: 'Privacy',
    url: 'https://secure.citi.com/brandcentral/site/assets/downloads/footer/citi_brand_central_privacy_policy.pdf',
  },
  { label: 'Contact Us', url: 'https://secure.citi.com/brandcentral/site/contact' },
  {
    label: 'Our Mission and Value Proposition',
    url: 'https://www.citigroup.com/citi/about/mission-and-value-proposition.html',
  },
];

const DashboardCard = ({ title, children, className }) => (
  <Card
    hover
    className={cx(
      'lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo',
      className
    )}
  >
    <p header className="lmn-h3 lmn-pb-24px">{title}</p>
    <Card body>{children}</Card>
  </Card>
);

export default function LeftNav() {
  // State Management
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [profile, setProfile] = useState('');
  const [logInTime, setLogInTime] = useState(new Date().toLocaleTimeString());
  const [teams, setTeams] = useState([]);
  const [theme, setTheme] = useState(themes.LIGHT);
  const [windowWidth, setWindowWidth] = useState(0);
  const [cardHeaderWidth, setCardHeaderWidth] = useState(0);
  const [gridCardWidth, setGridCardWidth] = useState(0);

  // Refs
  const cardHeaderRef = useRef();
  const gridCardRef = useRef();
  const firstRenderRef = useRef(true);

  // Effects
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://sd-671h-4rv0:3030/api/teams');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setTeams(data.map(item => [item[0], item[1]));
        } else {
          console.error('Invalid data received from API');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (cardHeaderRef.current) setCardHeaderWidth(cardHeaderRef.current.offsetWidth);
      if (gridCardRef.current) setGridCardWidth(gridCardRef.current.offsetWidth);
    };

    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      handleResize();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleMenuClick = (e) => {
    if (e.keyPath.includes('theme')) {
      setTheme(e.key);
    } else if (e.keyPath.includes('profile')) {
      setProfile(e.key);
    }
  };

  const handleLogin = () => setLogInTime(new Date().toLocaleTimeString());
  const handleLogout = () => setLogInTime(undefined);

  // Derived Values
  const getBreakpointInfo = () => {
    const upperIndex = GRID_BREAKPOINTS.findIndex(
      (v, index, arr) => index > 0 && v.value > windowWidth && windowWidth >= arr[index-1].value
    );
    
    const lowerIndex = upperIndex - 1;
    const rangeText = upperIndex === -1 
      ? `>= ${GRID_BREAKPOINTS[GRID_BREAKPOINTS.length - 1].value}px`
      : `${GRID_BREAKPOINTS[lowerIndex].value}px - ${GRID_BREAKPOINTS[upperIndex].value}px`;

    return {
      breakpoint: GRID_BREAKPOINTS[lowerIndex].key.toUpperCase(),
      range: rangeText,
      width: cardHeaderWidth
    };
  };

  const { breakpoint: breakpointText } = getBreakpointInfo();
  const removePadding = breakpointText === 'SM' || breakpointText === 'XS';

  // Render Helpers
  const renderMainContent = () => (
    <Tab defaultActiveKey="1">
      <Tab.TabPane tab={<Badge highContrast color="default" className="lmn-mr-12px lmn-font-size-md">Perspective {'>'}</Badge>} />
      
      <Tab.TabPane tab="Activity" key="1">
        <El className="lmn-p-12px lmn-px-sm-0 icgds-responsive-demo">
          <Card ref={cardHeaderRef} className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-4px">
            <Card body>
              <div className="lmn-d-flex lmn-justify-content-between lmn-align-items-center">
                <div className="lmn-d-flex lmn-justify-content-center lmn-flex-grow-1">
                  <div className="lmn-pr-24px lmn-row lmn-p-8px icgds-responsive-demo lmn-font-weight-bold">
                    Team Name:
                  </div>
                  {teams.length > 0 && (
                    <CustomizedContent
                      teams={teams}
                      onTeamSelect={setSelectedTeam}
                    />
                  )}
                  <Popover content={CustomizeFilter} trigger={['click']}>
                    <Button color='outline' className="lmn-ml-24px">
                      <Icon type="filter-alt" className="lmn-mr-8px" />
                      Advance Filter
                    </Button>
                  </Popover>
                </div>
              </div>
            </Card>
          </Card>

          <El className="lmn-row lmn-p-12px lmn-px-sm-0">
            {[
              { title: 'Success Rate', Component: SuccessRate },
              { title: 'Backlog Health', Component: FetchData },
              { title: 'Churn Rate', Component: ChurnRate },
              { title: 'Capacity Utilization', Component: CapacityUtil }
            ].map(({ title, Component }, index) => (
              <El key={`card-column-${index}`} className="lmn-col-3 lmn-mt-24px">
                <DashboardCard title={title}>
                  <Component selectedTeam={selectedTeam} themeConfig={{}} />
                </DashboardCard>
              </El>
            ))}
          </El>

          <El className="lmn-row lmn-p-12px lmn-px-sm-0">
            <El className="lmn-col-11 lmn-mt-24px">
              <DashboardCard title="Sentiment Analysis" className="lmn-px-2px lmn-p-12px">
                <SentimentBarChart selectedTeam={selectedTeam} themeConfig={{}} />
              </DashboardCard>
            </El>
          </El>
        </El>
      </Tab.TabPane>

      {/* Add other TabPanes following similar structure */}
    </Tab>
  );

  return (
    <div className={`icgds ${theme}-theme`}>
      <UIShell
        fluidContainer
        logoSrc={[citiLogo, citiLogoAlt]}
        logoHeight={28}
        appTitle="Engineering Productivity Portal"
        searchOptions={teams}
        theme={theme}
        onThemeChange={setTheme}
        footerRender={<GlobalFooter logo={citiLogoFooter} links={FOOTER_LINKS} />}
        avatarRender={
          <AvatarMenu
            displayType="anonymous"
            soeId="tn12345"
            fullName="Test"
            email="test@citi.com"
            loginTime={logInTime}
            loggedOutRender={<Button onClick={handleLogin}>Log in</Button>}
            menu={renderMenuContent()}
            onLogout={handleLogout}
          />
        }
      >
        {renderMainContent()}
      </UIShell>
    </div>
  );
}
