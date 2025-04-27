export const getRequests = async () => {
    const response = await fetch('/api/requests');
    return await response.json();
};

export const getUsers = async () => {
    const response = await fetch('/api/users');
    return await response.json();
};

export const getRanking = async (type) => {
    const response = await fetch(`/api/ranking?type=${type}`);
    return await response.json();
};

export const acceptRequest = async (token) => {
    const response = await fetch(`/api/requests/${token}/accept`, { method: 'POST' });
    return await response.json();
};

export const rejectRequest = async (token) => {
    const response = await fetch(`/api/requests/${token}/reject`, { method: 'POST' });
    return await response.json();
};

export const getBlacklist = async () => {
    const response = await fetch(`/api/blacklist`);
    return await response.json();
};