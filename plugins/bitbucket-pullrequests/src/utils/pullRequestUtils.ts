import { BitbucketPullRequest, PullRequestStatus } from '../types/BitbucketPullRequest';

// Helper function to determine the PR status for display
export const determinePullRequestStatus = (pr: BitbucketPullRequest): PullRequestStatus => {
  if (pr.state === 'MERGED') {
    return 'MERGED';
  }
  if (pr.state === 'DECLINED') {
    return 'DECLINED';
  }
  
  // For open PRs, check review status
  if (pr.open) {
    // If at least one reviewer has approved
    const hasApprovals = pr.reviewers.some(reviewer => reviewer.approved);
    
    // If there are reviewers but no approvals yet
    if (pr.reviewers.length > 0 && !hasApprovals) {
      return 'REVIEW_IN_PROGRESS';
    }
    
    // If all reviewers have approved
    const allApproved = pr.reviewers.length > 0 && 
      pr.reviewers.every(reviewer => reviewer.approved);
    
    if (allApproved) {
      return 'APPROVED';
    }
    
    // Default for open PRs with no reviewers
    return 'OPEN';
  }
  
  return 'OPEN';
};

// Format timestamp to relative time (e.g., "3 months ago")
export const formatRelativeTime = (timestamp: number): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  if (diffInSeconds < minute) {
    return 'just now';
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < week) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < month) {
    const weeks = Math.floor(diffInSeconds / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < year) {
    const months = Math.floor(diffInSeconds / month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / year);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}; 