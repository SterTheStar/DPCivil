import * as API from './modules/api.js';
import * as Requests from './modules/requests.js';
import * as Users from './modules/users.js';
import * as Ranking from './modules/ranking.js';
import * as Blacklist from './modules/blacklist.js';

document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('nav button');
    const modules = document.querySelectorAll('.module');

    const showModule = (moduleName) => {
        modules.forEach(module => {
            module.classList.add('hidden');
        });
        document.getElementById(moduleName).classList.remove('hidden');
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleName = button.dataset.module;
            showModule(moduleName);
            if (moduleName === 'requests') {
                Requests.loadRequests();
            } else if (moduleName === 'users') {
                Users.loadUsers();
            } else if (moduleName === 'ranking') {
                Ranking.loadRanking();
            }else if (moduleName === 'blacklist'){
                Blacklist.loadBlacklist();
            }
        });
    });

    showModule('requests');
    Requests.loadRequests();
});
