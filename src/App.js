import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames'; // Use classnames consistently

// --- ICGDS Imports ---
// Patterns
import { UIShell, GlobalFooter, AvatarMenu } from '@citi-icg-172888/icgds-patterns-react';
// Components
import { Tab, themes, Menu, Switch, Button, El, Card, Icon, Badge, Popover } from '@citi-icg-172888/icgds-react';
// Icons
import citiLogoFooter from '@citi-icg-172888/icgds-icons/logos/Citi_Logo.svg';
import citiLogo from '@citi-icg-172888/icgds-icons/logos/28px/Citi_Logo.svg';
import citiLogoAlt from '@citi-icg-172888/icgds-icons/logos/28px/Citi_Logo_Alternative.svg';

// --- App Specific Imports ---
import CustomizedContent from './CustomizedContent';
import LineChart from './DataFetch/LineChart';
import FetchData from './DataFetch/FetchData'; // Consider renaming for clarity (e.g., BacklogHealthChart)
import SuccessRate from './DataFetch/SuccessRate';
import ChurnRate from './DataFetch/ChurnRate';
import CapacityUtil from './DataFetch/CapacityUtil';
import SentimentBarChart from './DataFetch/SentimentAnalysis';
import CustomizeFilter from './DataFetch/AdvanceFilter'; // Renamed? (e.g., AdvancedFilterPopoverContent)

// --- Styles ---
import '@citi-icg-172888/icgds/dist/css/icgds.css';
import '@citi-icg-172888/icgds-ag-grid/dist/css/icgds-ag-theme.css';
// Keep Ag-Grid styles if used by any child component, otherwise remove
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// --- Constants ---
// Suggestion: Use environment variables for API endpoints
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://sd-671h-4rv0:3030/api'; // Example using env var
const TEAMS_API_ENDPOINT = `${API_BASE_URL}/teams`;

const FOOTER_LINKS = [
    { label: 'Terms and Conditions', url: 'https://secure.citi.com/brandcentral/site/assets/downloads/footer/citi_brand_central_terms_and_conditions.pdf' },
    { label: 'Privacy', url: 'https://secure.citi.com/brandcentral/site/assets/downloads/footer/citi_brand_central_privacy_policy.pdf' },
    { label: 'Contact Us', url: 'https://secure.citi.com/brandcentral/site/contact' },
    { label: 'Our Mision and Value Proposition', url: 'https://www.citigroup.com/citi/about/mission-and-value-proposition.html' },
];

const GRID_BREAKPOINTS = [
    { key: 'xs', value: 0 },
    { key: 'sm', value: 584 },
    { key: 'md', value: 784 },
    { key: 'lg', value: 1072 },
    { key: 'xl', value: 1264 },
    { key: '2xl', value: 1680 },
];
const GRID_BREAKPOINT_KEYS = GRID_BREAKPOINTS.map((v) => v.key);
const GRID_BREAKPOINT_VALUES = GRID_BREAKPOINTS.map((v) => v.value);

const CARD_COMMON_CLASSES = 'lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong icgds-responsive-demo';
const CHART_CARD_STYLE = { height: '300px' };
const SENTIMENT_CARD_STYLE = { height: '250px' };

// Rename component for clarity
export default function ProductivityDashboard() {
    // --- State ---
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [teams, setTeams] = useState([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(false);
    const [fetchTeamsError, setFetchTeamsError] = useState(null);
    const [theme, setTheme] = useState(themes.LIGHT); // Default to LIGHT from themes constant
    const [logInTime, setLogInTime] = useState(undefined); // Initialize as undefined for logged out state
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0); // Initial width

    // --- Refs ---
    const cardHeaderRef = useRef();
    // const gridCardRef = useRef(); // Ref not used in the current JSX, comment out or remove if not needed

    // --- Derived State & Calculations for Responsiveness ---
    const { breakpointKey, rangeText } = useMemo(() => {
        let upperIndex = GRID_BREAKPOINT_VALUES.findIndex((v, index, arr) => index > 0 && v > windowWidth && windowWidth >= arr[index - 1]);
        let lowerIndex = upperIndex - 1;
        let key = '';
        let range = '';

        if (upperIndex === -1 && GRID_BREAKPOINT_VALUES.length > 0) {
            // Handle case where windowWidth is larger than the largest breakpoint
            lowerIndex = GRID_BREAKPOINT_VALUES.length - 1;
            key = GRID_BREAKPOINT_KEYS[lowerIndex];
            range = `>= ${GRID_BREAKPOINT_VALUES[lowerIndex]}px`;
        } else if (lowerIndex >= 0 && lowerIndex < GRID_BREAKPOINT_KEYS.length) {
            // Handle cases within defined ranges
            key = GRID_BREAKPOINT_KEYS[lowerIndex];
            range = `${GRID_BREAKPOINT_VALUES[lowerIndex]}px - ${GRID_BREAKPOINT_VALUES[upperIndex]}px`;
        } else {
             // Handle edge case or initial state before width is properly set (optional)
             key = 'unknown';
             range = 'unknown';
        }
        return { breakpointKey: key.toUpperCase(), rangeText: range };
    }, [windowWidth]);

    // Define column classes based on layout state (isOneCol seems unused, simplifying)
    // Assuming a default 2x2 grid layout for charts
    const chartColClasses = 'lmn-col-6 lmn-col-md-3 lmn-mt-24px'; // Example: 2 cols on small, 4 on medium+
    const sentimentColClasses = 'lmn-col-12 lmn-mt-24px'; // Full width

    // --- Effects ---
    // Fetch Teams Data
    useEffect(() => {
        const fetchTeams = async () => {
            setIsLoadingTeams(true);
            setFetchTeamsError(null);
            try {
                const response = await fetch(TEAMS_API_ENDPOINT);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    // Assuming data format is [ [id1, name1], [id2, name2], ...]
                    setTeams(data.map(item => ({ id: item[0], name: item[1] })));
                } else {
                    console.error('Invalid data format received from teams API:', data);
                    setFetchTeamsError('Received invalid data format for teams.');
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                setFetchTeamsError(`Failed to fetch teams: ${error.message}`);
            } finally {
                setIsLoadingTeams(false);
            }
        };

        fetchTeams();
    }, []); // Runs once on mount

    // Window Resize Listener
    const updateWidth = useCallback(() => {
        setWindowWidth(window.innerWidth);
        // If cardHeaderWidth or gridCardWidth state were needed, update them here
        // Example: if (cardHeaderRef.current) setCardHeaderWidth(cardHeaderRef.current.offsetWidth);
    }, []); // No dependencies needed if it only calls setWindowWidth

    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        // Initial call to set width
        updateWidth();

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, [updateWidth]); // Dependency on the memoized updateWidth function

    // --- Handlers ---
    const handleThemeChange = useCallback((newTheme) => {
        setTheme(newTheme);
    }, []);

    const handleTeamSelect = useCallback((teamId) => {
        setSelectedTeamId(teamId);
    }, []);

    const handleLogin = useCallback(() => {
        // Add actual login logic here if needed
        setLogInTime(new Date().toLocaleTimeString());
    }, []);

    const handleLogout = useCallback(() => {
        // Add actual logout logic here
        setLogInTime(undefined);
    }, []);

    // Generic handler for menu clicks if needed for other actions
    const handleMenuClick = useCallback((e) => {
        console.log('Menu click key=', e.key, ' keyPath=', e.keyPath);
        // Add specific actions based on e.key or e.keyPath if necessary
    }, []);

    // --- Render Helpers ---
    const renderLoginButton = useMemo(() => <Button onClick={handleLogin}>Log in</Button>, [handleLogin]);

    // Avatar Menu Content
    const avatarInnerMenu = useMemo(() => (
        <Menu mode="vertical" selectable={false} onClick={handleMenuClick}>
            {/* Keep only relevant items, removed theme/profile switch as theme is handled by UIShell */}
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
    ), [handleMenuClick]);

    // Side Menu Content
    const sideMenuContent = useMemo(() => (
        <Menu defaultSelectedKeys={['home']} mode="inline">
            <Menu.Item key="home">
                <Icon className='lmn-menu-icon' type='home' />
                <span>Home</span>
            </Menu.Item>
            <Menu.SubMenu key="contexts" title={<> <Icon className='lmn-menu-icon' type='components' /><span>Contexts</span> </>}>
                <Menu.Item key="sprint">Sprint</Menu.Item>
                <Menu.Item key="release">Release</Menu.Item>
                <Menu.Item key="project">Project</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="playlistBuilder">
                <Icon className='lmn-menu-icon' type='stack' />
                <span>Playlist Builder</span>
            </Menu.Item>
            <Menu.Item key="suggestedPlaylist">
                <Icon className='lmn-menu-icon' type='play-circle-o' />
                <span>Suggested Playlist</span>
            </Menu.Item>
            {/* Add other menu items as needed */}
        </Menu>
    ), []);

    // Team Selector Component (can be further extracted if reused)
    const renderTeamSelector = () => (
        <>
            <div className="lmn-pr-24px lmn-row lmn-p-8px icgds-responsive-demo lmn-font-weight-bold">
                Team Name:
            </div>
            {isLoadingTeams && <span>Loading teams...</span>}
            {fetchTeamsError && <span style={{ color: 'red' }}>Error: {fetchTeamsError}</span>}
            {!isLoadingTeams && !fetchTeamsError && teams.length > 0 && (
                <CustomizedContent
                    teams={teams} // Pass the id/name map
                    onTeamSelect={handleTeamSelect}
                    selectedTeamId={selectedTeamId} // Pass selected ID if needed by CustomizedContent
                />
            )}
            {!isLoadingTeams && !fetchTeamsError && teams.length === 0 && (
                <span>No teams available.</span>
            )}
        </>
    );

    return (
        <div className={`icgds ${theme}-theme`}>
            <UIShell
                fluidContainer={true} // Keep fluid layout
                showMenu={true}
                logoSrc={[citiLogo, citiLogoAlt]}
                logoHeight={28}
                appTitle="Engineering Productivity Portal"
                showSearch={true}
                isSearchAnimated={true}
                // searchOptions={states} // Removed unused 'states' array
                navClasses='lmn-sticky-top'
                showThemeSwitch={true}
                showAppSwitch={false} // Explicitly false
                showAvatar={true} // Use boolean, AvatarMenu is passed via avatarRender
                sideBarExpanded={false} // Explicitly false
                theme={theme}
                onThemeChange={handleThemeChange}
                showSideBar={false} // Keep side menu, not the icon-only sidebar
                showSideMenu
                sideMenuDefaultVisible
                sideMenuClass="lmn-layer-primary lmn-border-right lmn-border-weak"
                sideMenuStyle={{ minWidth: '270px' }}
                sideMenuHeader={(<El className="lmn-heading-secondary lmn-font-size-24 lmn-mx-16px lmn-my-8px">Menu</El>)}
                sideMenuFooter={<Button color="ghost" className="lmn-mr-8px"><Icon type="setting" />Settings</Button>}
                sideMenuContentRender={sideMenuContent}
                footerRender={<GlobalFooter logo={citiLogoFooter} links={FOOTER_LINKS} />}
                avatarRender={
                    <AvatarMenu
                        displayType="anonymous" // Or determine dynamically based on actual auth state
                        soeId="tn12345" // Placeholder or dynamically set
                        fullName="Test User" // Placeholder or dynamically set
                        email="test.user@citi.com" // Placeholder or dynamically set
                        loginTime={logInTime}
                        loggedOutRender={renderLoginButton}
                        menu={avatarInnerMenu}
                        onLogout={handleLogout}
                    />
                }
            >
                {/* Main Content Area */}
                <div>
                    <Tab defaultActiveKey="activity" /* className="lmn-p-12px lmn-px-sm-0" Optional styling */ >
                        <Tab.TabPane
                            tab={ <Badge highContrast color="default" className="lmn-mr-12px lmn-font-size-md">Perspective {' >'}</Badge> }
                            key="perspectiveHeader" // Give it a unique key, disable if needed
                            disabled // Make this non-interactive if it's just a label
                        />
                        <Tab.TabPane tab="Activity" key="activity">
                            <El className="lmn-p-12px lmn-px-sm-0">
                                {/* --- Team Selector Card --- */}
                                <Card
                                    hover
                                    ref={cardHeaderRef}
                                    className={cx(CARD_COMMON_CLASSES, 'lmn-col-12 lmn-mt-4px')}
                                >
                                    <Card body>
                                        <div className="lmn-d-flex lmn-justify-content-between lmn-align-items-center lmn-flex-wrap"> {/* Added flex-wrap */}
                                            <div className="lmn-d-flex lmn-justify-content-center lmn-align-items-center lmn-flex-grow-1 lmn-mb-3 lmn-mb-md-0"> {/* Added margin-bottom */}
                                                {renderTeamSelector()}
                                            </div>
                                            <div>
                                                <Popover
                                                    id="advanced-filter-popover"
                                                    placement="rightTop"
                                                    content={<CustomizeFilter />} // Ensure this component exists and works
                                                    trigger={['click']}
                                                    withArrow={false}
                                                >
                                                    <Button color='outline' className="lmn-ml-md-24px"> {/* Margin only on medium+ */}
                                                        <Icon type="filter-alt" className="lmn-mr-8px" />
                                                        Advance Filter
                                                    </Button>
                                                </Popover>
                                            </div>
                                        </div>
                                    </Card>
                                </Card>

                                {/* --- Chart Grid --- */}
                                <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                    {/* Chart Cards - using map might be cleaner if data structure allows */}
                                    <El key="success-rate-col" className={chartColClasses}>
                                        <Card hover style={CHART_CARD_STYLE} className={CARD_COMMON_CLASSES}>
                                            <p header className="lmn-h3 lmn-pb-24px">Success Rate</p>
                                            <Card body>
                                                <SuccessRate selectedTeam={selectedTeamId} isStyleMode={false} themeConfig={{}} />
                                            </Card>
                                        </Card>
                                    </El>
                                    <El key="backlog-health-col" className={chartColClasses}>
                                        <Card hover style={CHART_CARD_STYLE} className={CARD_COMMON_CLASSES}>
                                            <p header className="lmn-h3 lmn-pb-24px">Backlog Health</p>
                                            <Card body>
                                                {/* Consider renaming FetchData component */}
                                                <FetchData selectedTeam={selectedTeamId} isStyleMode={false} themeConfig={{}} />
                                            </Card>
                                        </Card>
                                    </El>
                                    <El key="churn-rate-col" className={chartColClasses}>
                                        <Card hover style={CHART_CARD_STYLE} className={CARD_COMMON_CLASSES}>
                                            <p header className="lmn-h3 lmn-pb-24px">Churn Rate</p>
                                            <Card body>
                                                <ChurnRate selectedTeam={selectedTeamId} isStyleMode={false} themeConfig={{}} />
                                            </Card>
                                        </Card>
                                    </El>
                                    <El key="capacity-util-col" className={chartColClasses}>
                                        <Card hover style={CHART_CARD_STYLE} className={CARD_COMMON_CLASSES}>
                                            <p header className="lmn-h3 lmn-pb-24px">Capacity Utilization</p>
                                            <Card body>
                                                <CapacityUtil selectedTeam={selectedTeamId} isStyleMode={false} themeConfig={{}} />
                                            </Card>
                                        </Card>
                                    </El>
                                </El>

                                {/* --- Sentiment Analysis Row --- */}
                                <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                    <El className={sentimentColClasses}>
                                        <Card style={SENTIMENT_CARD_STYLE} className={cx(CARD_COMMON_CLASSES, 'lmn-p-12px')}> {/* Adjusted padding */}
                                            {/* Assuming Sentiment chart needs a header */}
                                            <p header className="lmn-h3 lmn-pb-12px">Sentiment Analysis</p>
                                             <Card body>
                                                <SentimentBarChart selectedTeam={selectedTeamId} isStyleMode={false} themeConfig={{}} />
                                             </Card>
                                        </Card>
                                    </El>
                                </El>

                                {/* Optional: Larger chart section (removed based on commented code) */}
                                {/* <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                    <El className="lmn-col-12 lmn-mt-24px">
                                        <Card hover style={{ height: '450px' }} className={CARD_COMMON_CLASSES}>
                                             <p header className="lmn-h2 lmn-pb-24px">Detailed Chart Section</p>
                                            <Card body>
                                                <LineChart selectedTeam={selectedTeamId} isStyleMode={false} themeConfig={{}} />
                                            </Card>
                                        </Card>
                                    </El>
                                </El> */}
                            </El>
                        </Tab.TabPane>

                        <Tab.TabPane tab="Engineering" key="engineering">
                            <El className="lmn-p-24px">
                                Perspective: Engineering Content Goes Here
                                {/* Add relevant components/layout for this tab */}
                            </El>
                        </Tab.TabPane>

                        <Tab.TabPane tab="Finance" key="finance">
                             <El className="lmn-p-12px lmn-px-sm-0">
                                {/* Re-using Team Selector Card for this tab - Consider extracting if identical */}
                                <Card hover className={cx(CARD_COMMON_CLASSES, 'lmn-col-12 lmn-mt-4px')}>
                                    <Card body>
                                        <div className="lmn-d-flex lmn-justify-content-center lmn-align-items-center">
                                            {renderTeamSelector()}
                                            {/* Add Finance specific filters/controls here if needed */}
                                        </div>
                                    </Card>
                                </Card>

                                {/* Add Finance specific charts/data */}
                                <El className="lmn-p-24px lmn-mt-24px">
                                     Finance Perspective Content Goes Here.
                                     <br />
                                     Selected Team ID: {selectedTeamId || 'None'}
                                </El>

                                {/* Example: A chart specific to finance */}
                                {/* <El className="lmn-row lmn-p-12px lmn-px-sm-0">
                                    <El className="lmn-col-12 lmn-mt-24px">
                                        <Card hover style={{ height: '450px' }} className={CARD_COMMON_CLASSES}>
                                             <p header className="lmn-h2 lmn-pb-24px">Financial Performance Chart</p>
                                            <Card body>
                                                <LineChart selectedTeam={selectedTeamId} isStyleMode={false} themeConfig={{}} />
                                            </Card>
                                        </Card>
                                    </El>
                                </El> */}
                                <CustomizeFilter /> {/* This seems misplaced here, was it intended for a popover/modal? */}

                             </El>
                        </Tab.TabPane>
                    </Tab>
                </div>
            </UIShell>
        </div>
    );
}
