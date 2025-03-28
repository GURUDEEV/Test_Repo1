import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import {UIShell, GlobalFooter, AvatarMenu } from '@citi-icg-172888/icgds-patterns-react';

import CustomizedContent from './CustomizedContent';

import '@citi-icg-172888/icgds/dist/css/icgds.css';
import '@citi-icg-172888/icgds-ag-grid/dist/css/icgds-ag-theme.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {Breadcrumb, Tab, themes, Menu, Switch, Button, El, Card, Select, 
        Icon, Badge, Section, Tag, Popover, Modal} from '@citi-icg-172888/icgds-react';
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
import CustomizeFilter from './DataFetch/AdvanceFilter';


export default function LeftNav() {
    const [selectedTeam, setSelectedTeam] = useState(null);
//     const header = 'Title';
// const content = (
//     <>
//         <p>Content</p>
//         <p>Content</p>
//     </>
// );
    // const states = [teams];
    const [profile, setProfile] = useState('');
    const [logInTime, setLogInTime] = useState(new Date().toLocaleTimeString());
    const [teams, setTeams] = useState([]);
    // console.log('Teams:',teams);
    // const [visible, setVisible] = useState(false);
    // const showModal = () => {
    //     setVisible(true);
    // };

    // const handleApply = () => {
    //     setVisible(false);
    // };

    // const handleCancel = () => {
    //     setVisible(false);
    // };

    useEffect(() => {
        fetch('http://sd-671h-4rv0:3030/api/teams')
            .then(response => response.json())
            .then(data => {
                // console.log('API Response',data);
                if (Array.isArray(data) && data.length > 0) {
                    // const teamNames = data.map(team => ({ id: team[0], name: team[1] }));
                    // console.log('Team Names:', data);
                    setTeams(data.map(item => [item[0], item[1]]));
                } else {
                    console.error('Invalid data received from API');
                }
            })
            .catch(error => {
                console.error('Error fetchig teams:',error);
            });
    }, []);
    

    const states = ['Alabama',
    'Alaska',
    'Arizona'];

    const [theme, setTheme] = useState(themes.LIGHT); 
    const [isFluidContainer, setIsFluidContainer] = useState(true);
    const [isOneCol, setIsOneCol] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [cardHeaderWidth, setCardHeaderWidth] = useState(0);
    const [gridCardWidth, setGridCardWidth] = useState(0);
    const cardHeaderRef = useRef();
    const gridCardRef = useRef();
    const firstRenerRef = useRef(true);
    const gridBreakpoints = [
        { key: 'xs', value: 0 },
        { key: 'sm', value: 584 },
        { key: 'md', value: 784 },
        { key: 'lg', value: 1072 },
        { key: 'xl', value: 1264 },
        { key: '2xl', value: 1680 }
    ];
    const gridBreakpointKeys = gridBreakpoints.map((v) => v.key);
    const gridBreakpointValues = gridBreakpoints.map((v) => v.value);
    //End of responsive

    const links = [
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
            label: 'Our Mision and Value Proposition',
            url: 'https://www.citigroup.com/citi/about/mission-and-value-proposition.html',
        },
    ];


    //Derived state for responsive grid
    let breakpointText = '';
    let rangeText = '';
    let widthText = 'Unset';
    let upperIndex = gridBreakpointValues.findIndex((v, index, arr) => index > 0 && v>windowWidth && windowWidth>=arr[index-1] )
    let lowwerIndex = upperIndex - 1;
    if (upperIndex === -1) {
        lowwerIndex = gridBreakpointValues.length - 1;
        rangeText = `>= ${gridBreakpointValues[lowwerIndex]}px`;
    } else {
        rangeText = `${gridBreakpointValues[lowwerIndex]}px - ${gridBreakpointValues[upperIndex]}px`;
    }
    breakpointText = gridBreakpointKeys[lowwerIndex].toUpperCase();
    widthText = !isFluidContainer && windowWidth >= gridBreakpointValues[1] ? cardHeaderWidth : widthText;
    //End of derived state

    //Handler
    const handleClick = (e) => {
        console.log('click key=', e.key, ' keyPath=', e.keyPath);
        if (e.keyPath.includes('theme')) {
            setTheme(e.key);
        } else if (e.keyPath.includes('profile')) {
            setProfile(e.key);
        }
    };
    const login = () => {
            setLogInTime(new Date().toLocaleTimeString());
        };
        const loginButton = <Button onClick={login}>Log in</Button>;
        const onLogout = () => {
            setLogInTime(undefined);
        }

    const removePadding = isOneCol && (breakpointText === 'SM' || breakpointText === 'XS');

    const updateWidth = () => {
        setWindowWidth(window.innerWidth);
        if (cardHeaderRef && cardHeaderRef.current) {
            setCardHeaderWidth(cardHeaderRef.current.offsetWidth);
        }
        if (gridCardRef && gridCardRef.current) {
            setGridCardWidth(gridCardRef.current.offsetWidth);
        }
    }

    const colCls = isOneCol ? 'lmn-col-2' : 'lmn-col-3 lmn-mt-24px';
    const cardCls = isOneCol ? 'lmn-col-2' : 'lmn-col-12 lmn-mt-0px';
    const sentCls = 'lmn-col-11 lmn-mt-24px' ;
    // const gridCardCls = cx('lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong /*lmn-layer-brand-secondary*/ lmn-card lmn-ui-lg', { 'lmn-p-4px': removePadding });

    useEffect(() => {
        if (firstRenerRef.current === true) {
            firstRenerRef.current = false;
            updateWidth();
        }
    }, [firstRenerRef.current]);

    useEffect(() => {
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);
    
    
    const innerMenu = (
        <Menu mode="vertical" selectable={false} onClick={handleClick}>
            <Menu.SubMenu key="theme" title="Theme">
                <Menu.Item className={theme === 'light' ? 'selected' : ''} key="light">
                    Light
                </Menu.Item>
                <Menu.Item className={theme === 'dark' ? 'selected' : ''} key="dark">
                    Dark
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="profile" title="Profile">
                <Menu.Item key="institutional" className={profile === 'institutional' ? 'selected' : ''}>
                    Institutional
                </Menu.Item>
                <Menu.Item key="corporation" className={profile === 'corporation' ? 'selected' : ''}>
                    Corporation
                </Menu.Item>
                <Menu.SubMenu key="other" title="Other">
                    <Menu.Item key="other1" className={profile === 'other1' ? 'selected' : ''}>
                        Option Other 1
                    </Menu.Item>
                    <Menu.Item key="other2" className={profile === 'other2' ? 'selected' : ''}>
                        Option Other 2
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu.SubMenu>
            <Menu.Item key="newSearch" className="lmn-d-flex">
                <span>New Search</span>
                <Switch wrapperClass="lmn-ml-auto" />
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="openChart">Open Chart</Menu.Item>
            <Menu.Item key="share">Share This Page</Menu.Item>
            <Menu.Item key="homepage">Set Homepage</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="mimic">Mimic</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="reset">Reset Password</Menu.Item>
            <Menu.Item key="switch">Switch Account</Menu.Item>
        </Menu>
    );

    return (
        <div className={`icgds ${theme}-theme`}>
            <UIShell
                fluidContainer = {true}
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
                showAvatar = {AvatarMenu}
                sideBarExpanded={false}
                theme={theme}
                onThemeChange={(crrtheme) => setTheme(crrtheme)}
                showSideBar={false}
                showSideMenu
                sideMenuDefaultVisible
                sideMenuClass="lmn-layer-primary lmn-border-right lmn-border-weak"
                sideMenuStyle={{ minWidth: '270px' }}
                sideMenuHeader={(<El className="lmn-heading-secondary lmn-font-size-24 lmn-mx-16px lmn-my-8px">Menu</El>)}
                sideMenuFooter={<Button color="ghost" className="lmn-mr-8px"><Icon type="setting" />Settings</Button>}
                sideMenuContentRender={(
                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                    >
                        <Menu.Item key="11">
                            <Icon className='lmn-menu-icon' type='home' />
                            <span>Home</span>
                        </Menu.Item>
                        <Menu.SubMenu key="sub1" title={<span><Icon className='lmn-menu-icon' type='components' />Contexts</span>}>
                            <Menu.Item key="1">Sprint</Menu.Item>
                            <Menu.Item key="2">Release</Menu.Item>
                            <Menu.Item key="3">Project</Menu.Item>
                        </Menu.SubMenu>
                        {/* <Menu.Item key="3">
                            <Icon className='lmn-menu-icon' type='chart-line' /><span>Performance</span>
                        </Menu.Item> */}
                        {/* <Menu.Divider /> */}
                        {/* <Menu.SubMenu key="sub2" title={<span><Icon className='lmn-menu-icon' type='paste' />Guidelines</span>}>
                            <Menu.Item key="4">Option 1</Menu.Item>
                            <Menu.Item key="5">Option 2</Menu.Item>
                        </Menu.SubMenu> */}
                        <Menu.Item key="6">
                            <Icon className='lmn-menu-icon' type='stack' />
                            <span>Playlist Builder</span>
                            {/* <Badge size='sm' color="purple" className="lmn-mr-12px">42</Badge> */}
                        </Menu.Item>
                        {/* <Menu.SubMenu key="sub4" title={
                            <>
                                <Icon className='lmn-menu-icon' type='check-circle-o' />
                                <span>Components</span>
                                <Badge size='sm' color="teal" className="lmn-mr-12px">28</Badge>
                            </>
                        }
                        >
                            <Menu.ItemGroup key="g1" title="Item 1">
                                <Menu.Item key="7">Component 1</Menu.Item>
                                <Menu.Item key="8">Component 2</Menu.Item>
                            </Menu.ItemGroup>
                            <Menu.ItemGroup key="g2" title="Item 2">
                                <Menu.Item key="9">Component 3</Menu.Item>
                                <Menu.Item key="10">Component 4</Menu.Item>
                            </Menu.ItemGroup>
                        </Menu.SubMenu> */}
                        <Menu.Item key="11">
                            <Icon className='lmn-menu-icon' type='play-circle-o' />
                            <span>Suggested Playlist</span>
                        </Menu.Item>
                        {/* <Menu.Divider /> */}
                        {/* <Menu.Item key="12">
                            <Icon className='lmn-menu-icon' type='paint' />
                            <span>Themes</span>
                        </Menu.Item> */}
                    </Menu>
                )}
                // sideBarItems={[
                //     {
                //         key: 'menu1',
                //         icon: 'home',
                //         title: 'Home',
                //         tooltip: false,
                //         content: 'Home',
                //         disabled: false,
                //         fluidContainer: { isFluidContainer },
                //     },
                //     {
                //         key: 'menu2',
                //         icon: 'components',
                //         title: false,
                //         tooltip: 'Contexts',
                //         content: (
                //             <div>
                //                 <Menu
                //                     onClick={handleClick}
                //                     style={{ width: 150 }}
                //                     defaultSelectedKeys={['']}
                //                     defaultOpenKeys={['']}
                //                     mode="inline"
                //                 >
                //                     <SubMenu key="sub1" title={<span>Contexts</span>}>
                //                         <Menu.Item key="1">Sprint</Menu.Item>
                //                         <Menu.Item key="2">Release</Menu.Item>
                //                         <Menu.Item key="3">Project</Menu.Item>
                //                     </SubMenu>
                //                 </Menu>
                //             </div>
                //         ),
                //     },
                //     {
                //         key: 'menu4',
                //         icon: 'stack',
                //         title: 'PlaylistBuilder',
                //         tooltip: false,
                //         content: 'Playlist builder',
                //         disabled: false,
                //     },
                //     {
                //         key: 'menu5',
                //         icon: 'play-circle-o',
                //         title: 'SuggestedPlaylist',
                //         tooltip: false,
                //         content: 'Suggested Playlist ',
                //         disabled: false,
                //     },
                // ]}

                footerRender={<GlobalFooter logo={citiLogoFooter} links={links} />}
                avatarRender={
                    <AvatarMenu
                        displayType="anonymous"
                        soeId="tn12345"
                        fullName="Test"
                        email="test@citi.com"
                        loginTime={logInTime}
                        loggedOutRender={loginButton}
                        menu={innerMenu}
                        onLogout={onLogout}
                    />
                }
                >
                    <div>
                    {/* <Section className="lmn-mt-8px"
                        sectionTitle="Perspective"
                        // sectionSubTitle="Section sub title"
                        // collapsible
                        // isCollapsed={isCollapsed}
                        // onIsCollapsedChange={setIsCollapsed}
                        > */}
                        {/* <Tag size={15} color="blue" className="lmn-mx-4px">Blue</Tag> */}
                        <Tab defaultActiveKey="1" 
                        // className="lmn-p-12px lmn-px-sm-0 icgds-responsive-demo"
                        // tabBarStyle={{
                        //     background: 'white',
                        //     // color: 'black',
                        //     // borderBottom: '1px solid #e8e8e8',
                        //     // marginBottom: '0px',
                        //     padding: '4px',
                        //     gap: '8px',
                        //     boarderRadius: '8px'
                        // }}
                        >
                            <Tab.TabPane tab=
                            {
                                <Badge highContrast color="default" className="lmn-mr-12px lmn-font-size-md">Perspective {' >'}</Badge>
                                }>
                            </Tab.TabPane>
                            <Tab.TabPane tab="Activity" key="1">
                                <El className="lmn-p-12px lmn-px-sm-0 icgds-responsive-demo">
                                    <Card
                                        hover
                                        ref={cardHeaderRef}
                                        className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-4px"
                                    >
                                        <Card body>
                                            <div id='app-content' className="lmn-d-flex lmn-justify-content-between lmn-align-items-center">
                                                <div className="lmn-d-flex lmn-justify-content-center lmn-flex-grow-1">
                                                    <div className="lmn-pr-24px lmn-row lmn-p-8px icgds-responsive-demo lmn-font-weight-bold">
                                                        Team Name:
                                                    </div>
                                                    {teams.length > 0 && (
                                                        <CustomizedContent
                                                            teams={teams.map((item) => [item[0], item[1]])}
                                                            onTeamSelect={(teamId) => setSelectedTeam(teamId)}
                                                        />
                                                    )}
                                                    <div>   
                                                    <Popover id="popover20" placement="rightTop" content={CustomizeFilter} trigger={['click']} withArrow={false}>
                                                        <Button color='outline' className="lmn-ml-24px"><Icon type="filter-alt" className="lmn-mr-8px" />
                                                        Advance Filter</Button>
                                                    </Popover>
                                                    </div>
                                                    <div>
                                        {/* <Modal
                                            width="25em"
                                            title="Extended Filters"
                                            visible={visible}
                                            onApply={handleApply}
                                            onCancel={handleCancel}
                                        >
                                        // ... your code ...

                                        // Call the AdvanceFilter component or function
                                        <CustomizeFilter />
                                        </Modal> */}
                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                                {/* <El className="lmn-border lmn-background-layer-primary lmn-p-24px lmn-mt-24px lmn-border-radius-xl">
                                                    <Button color='outline' className="lmn-mr-8px lmn-mt-8px">Advance Filter</Button>
                                                </El> */}

                                    </Card>
                                    {/* <El>
                                        <Modal
                                            width="25em"
                                            title="Extended Filters"
                                            visible={visible}
                                            onApply={handleApply}
                                            onCancel={handleCancel}
                                        >
                                        // ... your code ...

                                        // Call the AdvanceFilter component or function
                                        <CustomizeFilter />
                                        </Modal>
                                    </El> */}
                                    <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                        <El key={`card_column_1`} className={colCls}>
                                            <Card
                                                hover
                                                style={{ height: '300px' }}
                                                className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo"
                                            >
                                                <p header className="lmn-h3 lmn-pb-24px">
                                                    Success Rate
                                                </p>
                                                <Card body>
                                                    <div style={{ padding: '0px', marginTop: '0px' }}>
                                                        <SuccessRate
                                                            selectedTeam={selectedTeam}
                                                            isStyleMode={false}
                                                            themeConfig={{}}
                                                        />
                                                    </div>
                                                </Card>
                                            </Card>
                                        </El>
                                        <El key={`card_column_2`} className={colCls}>
                                            <Card
                                                hover
                                                style={{ height: '300px' }}
                                                className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo"
                                            >
                                                <p header className="lmn-h3 lmn-pb-24px">
                                                    Backlog Health
                                                </p>
                                                <Card body>
                                                    <div style={{ padding: '0px', marginTop: '0px' }}>
                                                        <FetchData
                                                            selectedTeam={selectedTeam}
                                                            isStyleMode={false}
                                                            themeConfig={{}}
                                                        />
                                                    </div>
                                                </Card>
                                            </Card>
                                        </El>
                                        <El key={`card_column_3`} className={colCls}>
                                            <Card
                                                hover
                                                style={{ height: '300px' }}
                                                className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo"
                                            >
                                                <p header className="lmn-h3 lmn-pb-24px ">
                                                    Churn Rate
                                                </p>
                                                <Card body>
                                                    <div style={{ padding: '0px', marginTop: '0px' }}>
                                                        <ChurnRate
                                                            selectedTeam={selectedTeam}
                                                            isStyleMode={false}
                                                            themeConfig={{}}
                                                        />
                                                    </div>
                                                </Card>
                                            </Card>
                                        </El>
                                        <El key={`card_column_4`} className={colCls}>
                                            <Card
                                                hover
                                                style={{ height: '300px' }}
                                                className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo"
                                            >
                                                <p header className="lmn-h3 lmn-pb-24px">
                                                    Capacity Utilization
                                                    {/* {console.log('CapacityUtil:', CapacityUtil)} */}
                                                </p>
                                                <Card body>
                                                    <div style={{ padding: '0px', marginTop: '0px' }}>
                                                        <CapacityUtil
                                                            selectedTeam={selectedTeam}
                                                            isStyleMode={false}
                                                            themeConfig={{}}
                                                        />
                                                    </div>
                                                </Card>
                                            </Card>
                                        </El>
                                    </El>
                                    <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                        <El className={sentCls}>
                                            <Card
                                                style={{ height: '250px' }}
                                                className="lmn-px-2px lmn-p-12px lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong"
                                            >
                                                <div className="lmn-px-12px lmn-p-12px">
                                                    {/* <LineChart selectedTeam={selectedTeam} isStyleMode={false} themeConfig={{}} /> */}
                                                    <SentimentBarChart
                                                        selectedTeam={selectedTeam}
                                                        isStyleMode={false}
                                                        themeConfig={{}}
                                                    />
                                                </div>
                                            </Card>
                                        </El>
                                    </El>
                                    {/* <El className={cardCls}>
                                        <Card
                                            hover
                                            ref={cardHeaderRef}
                                            style={{ height: '450px' }}
                                            className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-24px lmn-page-card icgds-responsive-demo"
                                        >
                                            <p header className="lmn-h2 lmn-pb-24px">
                                                Chart Section
                                            </p>
                                            <Card body>
                                                <div style={{ padding: '20px', marginTop: '20px' }}>
                                                    <LineChart
                                                        selectedTeam={selectedTeam}
                                                        isStyleMode={false}
                                                        themeConfig={{}}
                                                    />
                                                </div>
                                            </Card>
                                        </Card>
                                    </El> */}
                                </El>
                                {/* <El>
                                <Modal
                                    width="25em"
                                    title="Extended Filters"
                                    visible={visible}
                                    onApply={handleApply}
                                    onCancel={handleCancel}
                                >

                                <CustomizeFilter />
                                </Modal>
                                </El> */}
                            </Tab.TabPane>
                            <Tab.TabPane tab="Engineering" key="2">
                                Perspective: Engineering
                            </Tab.TabPane>
                            <Tab.TabPane tab="Finance" key="3">
                                <El className="lmn-p-12px lmn-px-sm-0 icgds-responsive-demo">
                                    <Card
                                        hover
                                        ref={cardHeaderRef}
                                        className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-4px"
                                    >
                                        <Card body>
                                            <div id="app-content" className="lmn-d-flex lmn-justify-content-center">
                                                <div className="lmn-pr-24px lmn-row lmn-p-8px icgds-responsive-demo lmn-font-weight-bold">
                                                    Team Name:
                                                </div>
                                                {teams.length > 0 && (
                                                    <CustomizedContent
                                                        teams={teams.map((item) => [item[0], item[1]])}
                                                        onTeamSelect={(teamId) => setSelectedTeam(teamId)}
                                                    />
                                                )}
                                            </div>
                                            
                                        </Card>
                                    </Card>
                                    {/* <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                        <El key={`card_column_1`} className={colCls}>
                                            <Card
                                                hover
                                                style={{ height: '300px' }}
                                                className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo"
                                            >
                                                <p header className="lmn-h3 lmn-pb-24px">
                                                    Success Rate
                                                </p>
                                                <Card body>
                                                    <div style={{ padding: '0px', marginTop: '0px' }}>
                                                        <SuccessRate
                                                            selectedTeam={selectedTeam}
                                                            isStyleMode={false}
                                                            themeConfig={{}}
                                                        />
                                                    </div>
                                                </Card>
                                            </Card>
                                        </El>
                                        <El key={`card_column_2`} className={colCls}>
                                            <Card
                                                hover
                                                style={{ height: '300px' }}
                                                className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo"
                                            >
                                                <p header className="lmn-h3 lmn-pb-24px">
                                                    Backlog Health
                                                </p>
                                                <Card body>
                                                    <div style={{ padding: '0px', marginTop: '0px' }}>
                                                        <FetchData
                                                            selectedTeam={selectedTeam}
                                                            isStyleMode={false}
                                                            themeConfig={{}}
                                                        />
                                                    </div>
                                                </Card>
                                            </Card>
                                        </El>
                                        <El key={`card_column_3`} className={colCls}>
                                            <Card
                                                hover
                                                style={{ height: '300px' }}
                                                className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo"
                                            >
                                                <p header className="lmn-h3 lmn-pb-24px ">
                                                    Churn Rate
                                                </p>
                                                <Card body>
                                                    <div style={{ padding: '0px', marginTop: '0px' }}>
                                                    </div>
                                                </Card>
                                            </Card>
                                        </El>
                                        <El key={`card_column_4`} className={colCls}>
                                            <Card
                                                hover
                                                style={{ height: '300px' }}
                                                className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo"
                                            >
                                                <p header className="lmn-h3 lmn-pb-24px">
                                                    Capacity Utilization
                                                </p>
                                                <Card body>
                                                    <div style={{ padding: '0px', marginTop: '0px' }}>
                                                        <CapacityUtil
                                                            selectedTeam={selectedTeam}
                                                            isStyleMode={false}
                                                            themeConfig={{}}
                                                        />
                                                    </div>
                                                </Card>
                                            </Card>
                                        </El>
                                    </El> */}
                                    {/* <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                        <El className={sentCls}>
                                            <Card
                                                style={{ height: '250px' }}
                                                className="lmn-px-2px lmn-p-12px lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong"
                                            >
                                                <div className="lmn-px-12px lmn-p-12px">
                                                    <SentimentBarChart
                                                        selectedTeam={selectedTeam}
                                                        isStyleMode={false}
                                                        themeConfig={{}}
                                                    />
                                                </div>
                                            </Card>
                                        </El>
                                    </El> */}
                                    <El>                                {/* // ... your code ...

                                // Call the AdvanceFilter component or function */}
                                <CustomizeFilter />
                                </El>
                                    <El className={cardCls}>
                                        <Card
                                            hover
                                            ref={cardHeaderRef}
                                            style={{ height: '450px' }}
                                            className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-24px lmn-page-card icgds-responsive-demo"
                                        >
                                            <p header className="lmn-h2 lmn-pb-24px">
                                                Chart Section
                                            </p>
                                            <Card body>
                                                <div style={{ padding: '20px', marginTop: '20px' }}>
                                                    <LineChart
                                                        selectedTeam={selectedTeam}
                                                        isStyleMode={false}
                                                        themeConfig={{}}
                                                    />
                                                    {/* <SentimentBarChart selectedTeam={selectedTeam} isStyleMode={false} themeConfig={{}} /> */}
                                                </div>
                                            </Card>
                                        </Card>
                                    </El>
                                </El>
                            </Tab.TabPane>
                        </Tab>
                        {/* </Section> */}
                    </div>
                </UIShell>
                </div>
    );
}