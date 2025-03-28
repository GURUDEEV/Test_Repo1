import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { UIShell, GlobalFooter, AvatarMenu } from '@citi-icg-172888/icgds-patterns-react';

import CustomizedContent from './CustomizedContent'; // Assuming this contains the Select dropdown

import '@citi-icg-172888/icgds/dist/css/icgds.css';
import '@citi-icg-172888/icgds-ag-grid/dist/css/icgds-ag-theme.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {
    Breadcrumb, Tab, themes, Menu, Switch, Button, El, Card, Select,
    Icon, Badge, Section, Tag, Popover, Modal // Ensure Popover is imported
} from '@citi-icg-172888/icgds-react';
import LineChart from './DataFetch/LineChart';
import FetchData from './DataFetch/FetchData';
import SuccessRate from './DataFetch/SuccessRate';
import ChurnRate from './DataFetch/ChurnRate';

import citiLogoFooter from '@citi-icg-172888/icgds-icons/logos/Citi_Logo.svg';
import citiLogo from '@citi-icg-172888/icgds-icons/logos/28px/Citi_Logo.svg';
import citiLogoAlt from '@citi-icg-172888/icgds-icons/logos/28px/Citi_Logo_Alternative.svg';
// import Item from 'antd/es/list/Item';
import CapacityUtil from './DataFetch/CapacityUtil';
import SentimentBarChart from './DataFetch/SentimentAnalysis';
import CustomizeFilter from './DataFetch/AdvanceFilter'; // Ensure this is the correct path

export default function LeftNav() {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [profile, setProfile] = useState('');
    const [logInTime, setLogInTime] = useState(new Date().toLocaleTimeString());
    const [teams, setTeams] = useState([]);

    // Removed modal state as we are using Popover
    // const [visible, setVisible] = useState(false);
    // const showModal = () => setVisible(true);
    // const handleApply = () => setVisible(false);
    // const handleCancel = () => setVisible(false);


    useEffect(() => {
        fetch('http://sd-671h-4rv0:3030/api/teams')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setTeams(data.map(item => [item[0], item[1]]));
                } else {
                    console.error('Invalid data received from API');
                }
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    }, []);


    const states = ['Alabama', 'Alaska', 'Arizona']; // Example states for search

    const [theme, setTheme] = useState(themes.LIGHT);
    const [isFluidContainer, setIsFluidContainer] = useState(true);
    // ... other state variables (isOneCol, windowWidth, etc.) ...
    const [isOneCol, setIsOneCol] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [cardHeaderWidth, setCardHeaderWidth] = useState(0);
    const [gridCardWidth, setGridCardWidth] = useState(0);
    const cardHeaderRef = useRef();
    const gridCardRef = useRef();
    const firstRenerRef = useRef(true);

    // ... gridBreakpoints, gridBreakpointKeys, gridBreakpointValues ...
    const gridBreakpoints = [
        { key: 'xs', value: 0 }, { key: 'sm', value: 584 }, { key: 'md', value: 784 },
        { key: 'lg', value: 1072 }, { key: 'xl', value: 1264 }, { key: '2xl', value: 1680 }
    ];
    const gridBreakpointKeys = gridBreakpoints.map((v) => v.key);
    const gridBreakpointValues = gridBreakpoints.map((v) => v.value);

    const links = [
        // ... footer links ...
        { label: 'Terms and Conditions', url: '#' }, { label: 'Privacy', url: '#' },
        { label: 'Contact Us', url: '#' }, { label: 'Our Mission and Value Proposition', url: '#' },
    ];

    // ... Derived state for responsive grid ...
    let breakpointText = '';
    let rangeText = '';
    let widthText = 'Unset';
    let upperIndex = gridBreakpointValues.findIndex((v, index, arr) => index > 0 && v > windowWidth && windowWidth >= arr[index - 1])
    let lowwerIndex = upperIndex - 1;
    if (upperIndex === -1) {
        lowwerIndex = gridBreakpointValues.length - 1;
        rangeText = `>= ${gridBreakpointValues[lowwerIndex]}px`;
    } else {
        rangeText = `${gridBreakpointValues[lowwerIndex]}px - ${gridBreakpointValues[upperIndex]}px`;
    }
    breakpointText = gridBreakpointKeys[lowwerIndex].toUpperCase();
    widthText = !isFluidContainer && windowWidth >= gridBreakpointValues[1] ? cardHeaderWidth : widthText;

    // Handler
    const handleClick = (e) => {
        // ... handleClick logic ...
        console.log('click key=', e.key, ' keyPath=', e.keyPath);
        if (e.keyPath.includes('theme')) {
            setTheme(e.key);
        } else if (e.keyPath.includes('profile')) {
            setProfile(e.key);
        }
    };
    const login = () => setLogInTime(new Date().toLocaleTimeString());
    const loginButton = <Button onClick={login}>Log in</Button>;
    const onLogout = () => setLogInTime(undefined);

    const removePadding = isOneCol && (breakpointText === 'SM' || breakpointText === 'XS');

    const updateWidth = () => {
        // ... updateWidth logic ...
        setWindowWidth(window.innerWidth);
        if (cardHeaderRef && cardHeaderRef.current) setCardHeaderWidth(cardHeaderRef.current.offsetWidth);
        if (gridCardRef && gridCardRef.current) setGridCardWidth(gridCardRef.current.offsetWidth);
    }

    const colCls = isOneCol ? 'lmn-col-2' : 'lmn-col-3 lmn-mt-24px';
    const cardCls = isOneCol ? 'lmn-col-2' : 'lmn-col-12 lmn-mt-0px';
    const sentCls = 'lmn-col-11 lmn-mt-24px';

    // ... useEffect hooks for width and resizing ...
    useEffect(() => {
        if (firstRenerRef.current === true) {
            firstRenerRef.current = false;
            updateWidth();
        }
    }, [firstRenerRef.current]);

    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);


    const innerMenu = (
        // ... Avatar innerMenu definition ...
        <Menu mode="vertical" selectable={false} onClick={handleClick}>
            {/* ... menu items ... */}
        </Menu>
    );

    return (
        <div className={`icgds ${theme}-theme`}>
            <UIShell
                // ... UIShell props ...
                fluidContainer={true}
                showMenu={true}
                logoSrc={[citiLogo, citiLogoAlt]}
                logoHeight={28}
                appTitle="Engineering Productivity Portal"
                showSearch={true}
                isSearchAnimated={true}
                searchOptions={states}
                navClasses='lmn-sticky-top'
                showThemeSwitch={true}
                showAppSwitch={false}
                showAvatar={AvatarMenu}
                sideBarExpanded={false}
                theme={theme}
                onThemeChange={(crrtheme) => setTheme(crrtheme)}
                showSideBar={false} // Assuming you want the collapsible side menu, not the icon-only sidebar
                showSideMenu
                sideMenuDefaultVisible
                sideMenuClass="lmn-layer-primary lmn-border-right lmn-border-weak"
                sideMenuStyle={{ minWidth: '270px' }}
                sideMenuHeader={(<El className="lmn-heading-secondary lmn-font-size-24 lmn-mx-16px lmn-my-8px">Menu</El>)}
                sideMenuFooter={<Button color="ghost" className="lmn-mr-8px"><Icon type="setting" />Settings</Button>}
                sideMenuContentRender={(
                    // ... Side Menu Content ...
                     <Menu defaultSelectedKeys={['11']} defaultOpenKeys={['sub1']} mode="inline">
                         <Menu.Item key="11"><Icon className='lmn-menu-icon' type='home' /><span>Home</span></Menu.Item>
                         <Menu.SubMenu key="sub1" title={<span><Icon className='lmn-menu-icon' type='components' />Contexts</span>}>
                             <Menu.Item key="1">Sprint</Menu.Item>
                             <Menu.Item key="2">Release</Menu.Item>
                             <Menu.Item key="3">Project</Menu.Item>
                         </Menu.SubMenu>
                         <Menu.Item key="6"><Icon className='lmn-menu-icon' type='stack' /><span>Playlist Builder</span></Menu.Item>
                         <Menu.Item key="11"><Icon className='lmn-menu-icon' type='play-circle-o' /><span>Suggested Playlist</span></Menu.Item>
                     </Menu>
                )}
                footerRender={<GlobalFooter logo={citiLogoFooter} links={links} />}
                avatarRender={
                    <AvatarMenu
                        // ... AvatarMenu props ...
                        displayType="anonymous" soeId="tn12345" fullName="Test" email="test@citi.com"
                        loginTime={logInTime} loggedOutRender={loginButton} menu={innerMenu} onLogout={onLogout}
                    />
                }
            >
                <div>
                    <Tab defaultActiveKey="1">
                        <Tab.TabPane tab={<Badge highContrast color="default" className="lmn-mr-12px lmn-font-size-md">Perspective {' >'}</Badge>}>
                            {/* Empty tab pane for the perspective label */}
                        </Tab.TabPane>

                        <Tab.TabPane tab="Activity" key="1">
                            <El className="lmn-p-12px lmn-px-sm-0 icgds-responsive-demo">
                                {/* --- START: Modified Card for Team Selection and Filter --- */}
                                <Card
                                    hover
                                    ref={cardHeaderRef} // Keep ref if needed elsewhere
                                    className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-4px"
                                >
                                    <Card body>
                                        {/* Use flexbox to position items */}
                                        <div id='app-content' className="lmn-d-flex lmn-justify-content-between lmn-align-items-center">

                                            {/* Left side: Team selection */}
                                            <div className="lmn-d-flex lmn-align-items-center">
                                                <div className="lmn-pr-24px lmn-font-weight-bold"> {/* Removed row/p-8px for simplicity */}
                                                    Team Name:
                                                </div>
                                                {teams.length > 0 ? (
                                                    <CustomizedContent
                                                        teams={teams.map((item) => [item[0], item[1]])}
                                                        onTeamSelect={(teamId) => setSelectedTeam(teamId)}
                                                    />
                                                ) : (
                                                     <Select placeholder="Loading teams..." disabled style={{ width: 200 }}/> // Placeholder while loading
                                                )}
                                            </div>

                                            {/* Right side: Advance Filter Button with Popover */}
                                            <div> {/* Wrapper div for the button/popover */}
                                                <Popover
                                                    id="advance-filter-popover" // Give it a unique ID
                                                    placement="bottomEnd" // Position below and aligned to the end (right)
                                                    content={<CustomizeFilter />} // The component to show in the popover
                                                    trigger={['click']} // Open on click
                                                    withArrow={true} // Optional: adds a small arrow pointing to the button
                                                    // overlayClassName="your-custom-popover-class" // Optional: for custom styling
                                                >
                                                    <Button color='outline'>
                                                        <Icon type="filter-alt" className="lmn-mr-8px" />
                                                        Advance Filter
                                                    </Button>
                                                </Popover>
                                            </div>

                                        </div>
                                    </Card>
                                </Card>
                                {/* --- END: Modified Card --- */}

                                {/* Rest of the chart cards */}
                                <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                    {/* Success Rate Card */}
                                    <El key={`card_column_1`} className={colCls}>
                                        <Card hover style={{ height: '300px' }} className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo">
                                            <p header className="lmn-h3 lmn-pb-24px">Success Rate</p>
                                            <Card body><div style={{ padding: '0px', marginTop: '0px' }}><SuccessRate selectedTeam={selectedTeam} isStyleMode={false} themeConfig={{}} /></div></Card>
                                        </Card>
                                    </El>
                                    {/* Backlog Health Card */}
                                    <El key={`card_column_2`} className={colCls}>
                                         <Card hover style={{ height: '300px' }} className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo">
                                            <p header className="lmn-h3 lmn-pb-24px">Backlog Health</p>
                                            <Card body><div style={{ padding: '0px', marginTop: '0px' }}><FetchData selectedTeam={selectedTeam} isStyleMode={false} themeConfig={{}} /></div></Card>
                                        </Card>
                                    </El>
                                    {/* Churn Rate Card */}
                                    <El key={`card_column_3`} className={colCls}>
                                        <Card hover style={{ height: '300px' }} className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo">
                                            <p header className="lmn-h3 lmn-pb-24px ">Churn Rate</p>
                                            <Card body><div style={{ padding: '0px', marginTop: '0px' }}><ChurnRate selectedTeam={selectedTeam} isStyleMode={false} themeConfig={{}} /></div></Card>
                                        </Card>
                                    </El>
                                     {/* Capacity Utilization Card */}
                                    <El key={`card_column_4`} className={colCls}>
                                         <Card hover style={{ height: '300px' }} className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo">
                                            <p header className="lmn-h3 lmn-pb-24px">Capacity Utilization</p>
                                            <Card body><div style={{ padding: '0px', marginTop: '0px' }}><CapacityUtil selectedTeam={selectedTeam} isStyleMode={false} themeConfig={{}} /></div></Card>
                                        </Card>
                                    </El>
                                </El>

                                {/* Sentiment Analysis Card */}
                                <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                    <El className={sentCls}>
                                        <Card style={{ height: '250px' }} className="lmn-px-2px lmn-p-12px lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong">
                                            <div className="lmn-px-12px lmn-p-12px">
                                                 <SentimentBarChart selectedTeam={selectedTeam} isStyleMode={false} themeConfig={{}} />
                                            </div>
                                        </Card>
                                    </El>
                                </El>

                                {/* Removed commented out Modal and extra LineChart Card */}

                            </El>
                        </Tab.TabPane>

                        <Tab.TabPane tab="Engineering" key="2">
                            Perspective: Engineering
                            {/* Add content specific to Engineering perspective */}
                        </Tab.TabPane>

                        <Tab.TabPane tab="Finance" key="3">
                            {/* You might want a similar structure here if you need the filter */}
                             <El className="lmn-p-12px lmn-px-sm-0 icgds-responsive-demo">
                                <Card
                                    hover
                                    // ref={cardHeaderRef} // Reuse ref if needed, or use a different one
                                    className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-4px"
                                >
                                    <Card body>
                                         {/* Use flexbox to position items */}
                                        <div className="lmn-d-flex lmn-justify-content-between lmn-align-items-center">
                                            {/* Left side: Team selection */}
                                            <div className="lmn-d-flex lmn-align-items-center">
                                                <div className="lmn-pr-24px lmn-font-weight-bold">
                                                    Team Name:
                                                </div>
                                                {teams.length > 0 ? (
                                                    <CustomizedContent
                                                        teams={teams.map((item) => [item[0], item[1]])}
                                                        onTeamSelect={(teamId) => setSelectedTeam(teamId)} // Ensure selection updates state
                                                    />
                                                ) : (
                                                    <Select placeholder="Loading teams..." disabled style={{ width: 200 }}/>
                                                )}
                                            </div>
                                            {/* Right side: Advance Filter Button with Popover */}
                                            <div>
                                                <Popover
                                                    id="advance-filter-popover-finance" // Different ID if needed
                                                    placement="bottomEnd"
                                                    content={<CustomizeFilter />} // Reuse or create a specific filter?
                                                    trigger={['click']}
                                                    withArrow={true}
                                                >
                                                    <Button color='outline'>
                                                        <Icon type="filter-alt" className="lmn-mr-8px" />
                                                        Advance Filter
                                                    </Button>
                                                </Popover>
                                            </div>
                                        </div>
                                    </Card>
                                </Card>

                                {/* Add Finance specific charts/data */}
                                <El className={cardCls}>
                                    <Card
                                        hover
                                        // ref={cardHeaderRef} // Use different ref if needed
                                        style={{ height: '450px' }}
                                        className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-24px lmn-page-card icgds-responsive-demo"
                                    >
                                        <p header className="lmn-h2 lmn-pb-24px">
                                            Finance Chart Section
                                        </p>
                                        <Card body>
                                            <div style={{ padding: '20px', marginTop: '20px' }}>
                                                {/* Add Finance specific charts */}
                                                <LineChart selectedTeam={selectedTeam} isStyleMode={false} themeConfig={{}} />
                                            </div>
                                        </Card>
                                    </Card>
                                </El>
                            </El>
                        </Tab.TabPane>
                    </Tab>
                </div>
            </UIShell>
        </div>
    );
}
