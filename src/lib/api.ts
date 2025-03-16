'use-client';
import { API_URL } from '@/constant/env';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null; // Or any default value you want
};

const createNoneAuthorizedFetch = () => {
  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    console.log('=======headers', headers);
    return await fetch(API_URL + url, {
      ...options,
      headers,
    });
  };
};

export const nonAuthorizedFetch = createNoneAuthorizedFetch();

const createAuthorizedFetch = () => {
  const authToken = getAuthToken() || '';
  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    };
    console.log('=======headers', headers);
    return fetch(url, {
      ...options,
      headers,
    });
  };
};

const authorizedFetch = createAuthorizedFetch();

export const fetchTodayViolations = async () => {
  try {
    const response = await authorizedFetch(
      API_URL + '/api/v1/points-history/violations/today'
    );
    if (!response.ok) {
      console.error("Failed to fetch today's violations:", response.status);
      return []; // Return empty array on failure
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching today's violations:", error);
    return []; // Return empty array on error
  }
};

export const fetchOnYourHand = async () => {
  try {
    const response = await authorizedFetch(
      API_URL + '/api/v1/rewards/in-your-hand'
    );
    if (!response.ok) {
      console.error('Failed to fetch on your hand:', response.status);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching on your hand:', error);
    return [];
  }
};

export const fetchPointsHistory = async () => {
  try {
    const response = await authorizedFetch(
      API_URL + '/api/v1/points-history/rewarded/today'
    );
    if (!response.ok) {
      console.error('Failed to fetch points history:', response.status);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching points history:', error);
    return [];
  }
};

export const fetchEarnedPointsHistory = async () => {
  try {
    const response = await authorizedFetch(
      API_URL + '/api/v1/points-history/earned/today'
    );
    if (!response.ok) {
      console.error('Failed to fetch earned points history:', response.status);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching earned points history:', error);
    return [];
  }
};

export const redeemReward = async (rewardId: number) => {
  try {
    const response = await authorizedFetch(
      API_URL + '/api/v1/rewards/redeem?reward_id=' + rewardId,
      {
        method: 'POST',
        body: JSON.stringify({ rewardId }),
      }
    );
    if (!response.ok) {
      console.error('Failed to redeem reward:', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return false;
  }
};

export const fetchPointsStatus = async () => {
  try {
    const response = await authorizedFetch(API_URL + '/api/v1/points/status');
    if (!response.ok) {
      console.error('Failed to fetch points status:', response.status);
      return { currentPoints: 0, todayEarnedPoints: 0, allTimeUsedPoints: 0 };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching points status:', error);
    return { currentPoints: 0, todayEarnedPoints: 0, allTimeUsedPoints: 0 };
  }
};

export const fetchChallenges = async () => {
  try {
    console.log('====fetchChallenges');
    const response = await authorizedFetch(API_URL + '/api/v1/challenges');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi tải lịch sử điểm kiếm được:', error);
  }
};

export const finishChallenge = async (challengeId: number) => {
  try {
    const response = await authorizedFetch(
      API_URL + '/api/v1/challenges/finish?challengeId=' + challengeId,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error finishing challenge:', error);
    return false;
  }
};

export const fetchRewards = async () => {
  try {
    const response = await authorizedFetch(API_URL + '/api/v1/rewards');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải danh sách phần thưởng:', error);
  }
};

export const fetchViolations = async () => {
  try {
    const response = await authorizedFetch(API_URL + '/api/v1/violations');

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải danh sách vi phạm:', error);
  }
};

export const reportViolation = async (violationId: any) => {
  try {
    const response = await authorizedFetch(
      API_URL + '/api/v1/violations/apply',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ violationId }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error reporting violation:', error);
    return false;
  }
};
