import React, { useState, useEffect } from 'react';
import {
  Paper,
  Tabs,
  Tab,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import SecurityIcon from '@material-ui/icons/Security';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { useStyles } from './styles';
import { RepositoryUsersTab } from './RepositoryUsersTab';
import { BranchRestrictionsTab } from './BranchRestrictionsTab';
import { DefaultReviewersTab } from './DefaultReviewersTab';

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`permissions-tabpanel-${index}`}
      aria-labelledby={`permissions-tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export const EntityBitbucketPermissionsContent = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    repoUsers: true, // Start with loading for the first tab
    branchRestrictions: false,
    defaultReviewers: false,
  });

  // Simulate initial API call for the first tab
  useEffect(() => {
    // Simulate initial loading for Repository Users tab
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, repoUsers: false }));
    }, 1500); // Slightly longer initial load
  }, []);

  const handleTabChange = async (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
    
    // Simulate API calls based on the selected tab
    const tabNames = ['repoUsers', 'branchRestrictions', 'defaultReviewers'] as const;
    const currentTab = tabNames[newValue];
    
    // Only show loading if we haven't loaded this tab's data yet
    if (newValue !== 0 && !loadingStates[currentTab]) { // Skip for first tab since it loads on mount
      setLoadingStates(prev => ({ ...prev, [currentTab]: true }));
      
      // Simulate API call delay
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [currentTab]: false }));
        
        // Here you would make the actual API calls:
        // if (newValue === 0) {
        //   // Call repository users API
        //   fetchRepositoryUsers();
        // } else if (newValue === 1) {
        //   // Call branch restrictions API
        //   fetchBranchRestrictions();
        // } else if (newValue === 2) {
        //   // Call default reviewers API
        //   fetchDefaultReviewers();
        // }
      }, 1200); // Simulate network delay
    }
  };

  const a11yProps = (index: number) => {
    return {
      id: `permissions-tab-${index}`,
      'aria-controls': `permissions-tabpanel-${index}`,
    };
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.tabsContainer} elevation={2}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Bitbucket permissions tabs"
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            icon={<PersonIcon />}
            label="Repository Users"
            {...a11yProps(0)}
          />
          <Tab
            icon={<SecurityIcon />}
            label="Branch Permissions"
            {...a11yProps(1)}
          />
          <Tab
            icon={<RateReviewIcon />}
            label="Default Reviewers"
            {...a11yProps(2)}
          />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <RepositoryUsersTab loading={loadingStates.repoUsers} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <BranchRestrictionsTab loading={loadingStates.branchRestrictions} />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <DefaultReviewersTab loading={loadingStates.defaultReviewers} />
      </TabPanel>
    </div>
  );
}; 