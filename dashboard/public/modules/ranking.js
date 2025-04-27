import * as API from './api.js';

const rankingTable = document.getElementById('ranking-table').querySelector('tbody');
const rankingButtons = document.querySelectorAll('[data-ranking-type]');

export const loadRanking = async (type = 'total') => {
    const ranking = await API.getRanking(type);
    rankingTable.innerHTML = '';
    ranking.forEach((user, index) => {
        const row = createRankingRow(user, index + 1);
        rankingTable.appendChild(row);
    });
};

const createRankingRow = (user, position) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${position}</td>
        <td>${user.userId}</td>
        <td>${user.total}</td>
    `;
    return row;
};

rankingButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.rankingType;
        loadRanking(type)
    })
})