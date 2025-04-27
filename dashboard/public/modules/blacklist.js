import * as API from './api.js';

const blacklistTable = document.getElementById('blacklist-table').querySelector('tbody');

export const loadBlacklist = async () => {
    const blacklist = await API.getBlacklist();
    blacklistTable.innerHTML = '';
    blacklist.forEach((userId) => {
        const row = createBlacklistRow(userId);
        blacklistTable.appendChild(row);
    });
};

const createBlacklistRow = (userId) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${userId}</td>
    `;
    return row;
};