// Your Ethereum API key or endpoint
const ethPriceApi = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
const walletAddresses = [
  "0xWallet1AddressHere",
  "0xWallet2AddressHere"
];

// Fetch wallet balances and ETH prices
async function fetchData() {
  try {
    const balancePromises = walletAddresses.map(addr => 
      fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${addr}&tag=latest&apikey=YourEtherscanAPIKey`)
        .then(res => res.json())
        .then(data => parseFloat(data.result) / 1e18)
    );

    const ethPriceResponse = await fetch(ethPriceApi);
    const ethPriceData = await ethPriceResponse.json();
    const ethPrice = ethPriceData.ethereum.usd;

    const balances = await Promise.all(balancePromises);
    const totalEth = balances.reduce((acc, balance) => acc + balance, 0);

    document.getElementById("eth-balance").textContent = totalEth.toFixed(2);
    document.getElementById("eth-value").textContent = (totalEth * ethPrice).toFixed(2);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Update every 60 seconds
fetchData();
setInterval(fetchData, 60000);
