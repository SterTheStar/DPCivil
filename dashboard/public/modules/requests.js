import * as API from './api.js';

const requestsTable = document.getElementById('requests-table').querySelector('tbody');

export const loadRequests = async () => {
    const requests = await API.getRequests();
    requestsTable.innerHTML = '';
    requests.forEach(request => {
        const row = createRequestRow(request);
        requestsTable.appendChild(row);
    });
};

const createRequestRow = (request) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${request.token}</td>
        <td>${request.memberId}</td>
        <td>${request.type}</td>
        <td>${request.quantity}</td>
        <td>${request.accepted ? 'Accepted' : request.rejected ? 'Rejected' : 'Pending'}</td>
    `;
    const actionsCell = document.createElement('td');
    if (!request.accepted && !request.rejected) {
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.classList.add('accept-btn')
        acceptButton.addEventListener('click', async () => {
            await API.acceptRequest(request.token);
            loadRequests();
        });
        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject';
        rejectButton.classList.add('reject-btn')
        rejectButton.addEventListener('click', async () => {
            await API.rejectRequest(request.token);
            loadRequests();
        });
        actionsCell.appendChild(acceptButton);
        actionsCell.appendChild(rejectButton);
    }
    row.appendChild(actionsCell);
    return row;
};