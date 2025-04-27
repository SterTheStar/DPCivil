import * as API from './api.js';

const usersTable = document.getElementById('users-table').querySelector('tbody');

export const loadUsers = async () => {
    const users = await API.getUsers();
    usersTable.innerHTML = '';
    Object.entries(users).forEach(([userId, userData]) => {
        const row = createUserRow(userId, userData);
        usersTable.appendChild(row);
    });
};

const createUserRow = (userId, userData) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${userId}</td>
        <td>${userData.Recrutamentos || 0}</td>
        <td>${userData.Prisões || 0}</td>
        <td>${userData.monthly?.Recrutamentos || 0}</td>
        <td>${userData.monthly?.Prisões || 0}</td>
    `;
    return row;
};