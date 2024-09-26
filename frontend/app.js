let web3;
let BugTracker;
let contractAddress = '0x70a736B1dBD4A56BF240f8Ba5d92cCeb018235E0';

// Function to check if user is logged in
function checkLogin() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = 'welcome.html';
    }
}

window.addEventListener('load', async () => {
    checkLogin();

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            BugTracker = new web3.eth.Contract([
                {
                    "constant": true,
                    "inputs": [],
                    "name": "getBugs",
                    "outputs": [
                        {
                            "components": [
                                { "name": "title", "type": "string" },
                                { "name": "application", "type": "string" },
                                { "name": "os", "type": "string" },
                                { "name": "severity", "type": "string" },
                                { "name": "description", "type": "string" },
                                { "name": "reporter", "type": "address" },
                                { "name": "timestamp", "type": "uint256" }
                            ],
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        { "name": "_title", "type": "string" },
                        { "name": "_application", "type": "string" },
                        { "name": "_os", "type": "string" },
                        { "name": "_severity", "type": "string" },
                        { "name": "_description", "type": "string" }
                    ],
                    "name": "logBug",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ], contractAddress);

            document.getElementById('bugForm')?.addEventListener('submit', logBug);
            if (document.getElementById('bugList')) {
                loadBugs();
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

async function logBug(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const title = document.getElementById('title').value;
    const application = document.getElementById('application').value;
    const os = document.getElementById('os').value;
    const severity = document.getElementById('severity').value;
    const description = document.getElementById('description').value;

    // Check if the bug already exists
    const bugs = await BugTracker.methods.getBugs().call();
    const exists = bugs.some(bug => 
        bug.title === title && 
        bug.application === application && 
        bug.os === os
    );

    if (exists) {
        alert('Bug already exists!');
        return;
    }

    try {
        await BugTracker.methods.logBug(title, application, os, severity, description).send({ from: accounts[0] });
        alert('Bug logged successfully!');
        loadBugs();
    } catch (error) {
        console.error('Error logging bug:', error);
        alert('There was an error logging the bug.');
    }
}

async function loadBugs() {
    const bugs = await BugTracker.methods.getBugs().call();
    displayBugs(bugs);
}

function displayBugs(bugs) {
    const bugList = document.getElementById('bugList');
    bugList.innerHTML = '';
    bugs.forEach((bug, index) => {
        const row = document.createElement('tr');
        const date = new Date(bug.timestamp * 1000).toLocaleString();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${bug.title}</td>
            <td>${bug.application}</td>
            <td>${bug.os}</td>
            <td>${bug.severity}</td>
            <td>${bug.description}</td>
            <td>${date}</td>
        `;
        bugList.appendChild(row);
    });
}

function searchBugs() {
    const searchTerm = document.getElementById('searchField').value.toLowerCase();
    const rows = document.querySelectorAll('#bugList tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const containsTerm = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(searchTerm));
        if (containsTerm) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
