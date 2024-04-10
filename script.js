const walletGroupsContainer = document.getElementById('wallet-groups');
const sumarryBar = document.getElementById('sumarry-bar');
const summaryText = document.getElementById('sumarry-text');
const summaryTextC = document.getElementById('sumarry-text-c');;
sumarryBar.style.width = `${0}%`;

const extraSmallGiversMaxVolume = 4485000000
const smallGiversMaxVolume = 1380000000
const mediumGiversMaxVolume = 690000000
const largeGiversMaxVolume = 345000000

const givers = {
    "largeGivers": [
        { "mainAddress": "EQB8SW8qZtvwuU_5LKuk2CZ4yQVvLLMHYPKUyWpEMssDFF3E", "jettonAddress": "EQC_HpeyO7HfICBJkxzoRkPHpDNaTxiyGwYkZNCj1Jzqph7S"},
    ],
    "medium_givers": [
        { "mainAddress": "EQDrtlyVn7Q_1pheIgyJZn0neMyG5TizQ3b6lCP89B6LuePY", "jettonAddress": "EQAoc3fAw57oHsNgiypnbKwqPYiqLO8ysqsnJtmhCIxQCvEA"},
    ],
    "small_givers": [
        { "mainAddress": "EQDl1Rk1Lz8MwpUsTgKjhMWX3ad2F0R4UDnjsl4-z3ExZZq7", "jettonAddress": "EQDHIiRDOj8nd0hMa4hhMsIJbT3k1nJvrVIzbxhZDc92X07z"},
    ],
    "extra_small_givers": [
        { "mainAddress": "EQD6dEF4pPrbyz4SeQOkiXUcelcR72rstlZv_2CY6-YyCKR7", "jettonAddress": "EQBkue5MC1O9-IXVGKfozwYnXjHRpwz9KZHmO5P6ZI82ytCw"},
    ]
};

// Function to fetch wallet balance (remains the same)
async function getWalletBalance(address) {
    const response = await fetch('https://mainnet.tonhubapi.com/runGetMethod', {
        method: 'POST',
        body: JSON.stringify({
            address,
            method: 'get_wallet_data',
            stack: []
        })
    });
    const data = await response.json();
    const balanceHex = data.result.stack[0][1];
    return parseInt(balanceHex, 16); // Convert hex to decimal
}

function formatN(n) {
    const unitList = ['y', 'z', 'a', 'f', 'p', 'n', 'u', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    const zeroIndex = 8;
    const nn = n.toExponential(2).split(/e/);
    let u = Math.floor(+nn[1] / 3) + zeroIndex;
    if (u > unitList.length - 1) {
        u = unitList.length - 1;
    } else
    if (u < 0) {
        u = 0;
    }
    return nn[0] * Math.pow(10, +nn[1] - (u - zeroIndex) * 3) + unitList[u];
}

async function createProgressBar(giver,name) {
    const groupElement = document.createElement('div');
    groupElement.classList.add('wallet-group');
    const link = document.createElement('a');
    link.href = 'https://tonviewer.com/' + giver.mainAddress;
    link.classList.add('regular-text');
    link.classList.add('address')
    link.target = '_blank';

    var text = document.createElement('p');
    text.innerHTML = `${name}: WAITING DATA`;
    text.id = `text-${giver.mainAddress}%`;
    link.appendChild(text)
    groupElement.appendChild(link)

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');

    const progressBarFill = document.createElement('div');
    progressBarFill.id =  `progres-bar-${giver.mainAddress}%`;
    progressBarFill.classList.add('progress-bar-fill');
    progressBarFill.style.width = `${0}%`;
    progressBar.appendChild(progressBarFill);

    groupElement.appendChild(progressBar);

    walletGroupsContainer.appendChild(groupElement);
}

async function fillProgressBar(giver, balance, percentage, name, maxVolume) {

    const text = document.getElementById(`text-${giver.mainAddress}%`);
    const progressBarFill = document.getElementById(`progres-bar-${giver.mainAddress}%`);
    if(percentage < 80) {
        progressBarFill.classList.add('progress-bar-fill-less-80');
    } else if(percentage < 30) {
        progressBarFill.classList.add('progress-bar-fill-less-30');
    }
    text.innerHTML = `${name}: ${balance.toLocaleString('en-US')}/${maxVolume.toLocaleString('en-US')} VOTE<br>Mining progress: ${(100-percentage).toFixed(2)}%`;
    progressBarFill.style.width = `${percentage}%`;

}

async function createSeparator() {
    const div = document.createElement('div')
    walletGroupsContainer.appendChild(div)
}


// Function to create and display wallet groups
async function createWalletGroups() {
    createSeparator()

    for (let i = 0; i < givers.largeGivers.length; i++) {createProgressBar(givers.largeGivers[i],"Large Giver #"+ (i+1).toString())}
    for (let i = 0; i < givers.medium_givers.length; i++) {createProgressBar(givers.medium_givers[i],"Medium Giver #"+(i+1).toString())}
    for (let i = 0; i < givers.small_givers.length; i++) {createProgressBar(givers.small_givers[i],"Small Giver #"+ (i+1).toString())}
    for (let i = 0; i < givers.extra_small_givers.length; i++) {createProgressBar(givers.extra_small_givers[i],"Extra Small Giver #"+ (i+1).toString())}
}

async function displayWalletGroups() {
    var summa= 0;
    var minedSumm = 0;


    for (let i = 0; i < givers.largeGivers.length; i++) {
        const giver = givers.largeGivers[i]
        const balance = await getWalletBalance(giver.jettonAddress) / 1000000000;
        const percentage = (balance / largeGiversMaxVolume) * 100;

        fillProgressBar(giver, balance, percentage, "Large Giver #" + (i+1).toString(), largeGiversMaxVolume)
        await new Promise(r => setTimeout(r, 1000));

        summa += largeGiversMaxVolume;
        minedSumm+=balance;
    }

    for (let i = 0; i < givers.medium_givers.length; i++) {
        const giver = givers.medium_givers[i]
        const balance = await getWalletBalance(giver.jettonAddress) / 1000000000;
        const percentage = ((balance) / mediumGiversMaxVolume) * 100;

        fillProgressBar(giver, balance, percentage, "Medium Giver #" + (i+1).toString(), mediumGiversMaxVolume)
        await new Promise(r => setTimeout(r, 1000));

        summa += mediumGiversMaxVolume;
        minedSumm+=balance;
    }

    for (let i = 0; i < givers.small_givers.length; i++) {
        const giver = givers.small_givers[i]
        const balance = await getWalletBalance(giver.jettonAddress) / 1000000000;
        const percentage = ((balance) / smallGiversMaxVolume) * 100;

        fillProgressBar(giver, balance, percentage, "Small Giver #" + (i+1).toString(), smallGiversMaxVolume)
        await new Promise(r => setTimeout(r, 1000));

        summa += smallGiversMaxVolume;
        minedSumm+=balance;
    }
    for (let i = 0; i < givers.extra_small_givers.length; i++) {
        const giver = givers.extra_small_givers[i]
        const balance = await getWalletBalance(giver.jettonAddress) / 1000000000;
        const percentage = ((balance) / extraSmallGiversMaxVolume) * 100;

        fillProgressBar(giver, balance, percentage, "Extra Small Giver #" + (i+1).toString(), extraSmallGiversMaxVolume)
        await new Promise(r => setTimeout(r, 1000));

        summa += extraSmallGiversMaxVolume;
        minedSumm+=balance;
    }

    let barPercentage = ((minedSumm/summa)*100);
    sumarryBar.style.width = `${barPercentage}%`;
    summaryTextC.textContent = `Mining progress: ${(100 - (minedSumm/summa)*100).toFixed(2)}%`;
    summaryText.textContent = `Total Givers Balance: ${minedSumm.toLocaleString('en-US')}/${summa.toLocaleString('en-US')} VOTE`;
    if(barPercentage < 80) {
        sumarryBar.classList.add('progress-bar-fill-less-80');
    } else if(barPercentage < 30) {
        sumarryBar.classList.add('progress-bar-fill-less-30');
    }
}

document.body.classList.add('dark-theme')

createWalletGroups();
// Initial data fetching and display
displayWalletGroups();

