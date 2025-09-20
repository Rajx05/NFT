// 🔥 Testing version with direct frontend fetch
const API_KEY = "6c4b4e8d54e04e58b718fdfc55242db2";

const grid = document.getElementById("nftGrid");
const walletInput = document.getElementById("walletInput");
const loadBtn = document.getElementById("loadBtn");

// Button click
loadBtn.addEventListener("click", () => {
  const wallet = walletInput.value.trim();
  if (!wallet) return alert("Please enter a wallet address!");
  fetchNFTs(wallet);
});

// Optional: load example wallet on page load
window.onload = () => {
  fetchNFTs("0x495f947276749Ce646f68AC8c248420045cb7b5e");
};

async function fetchNFTs(wallet) {
  grid.innerHTML = "<p>Loading NFTs...</p>";

  try {
    const res = await fetch(`https://api.opensea.io/api/v1/assets?owner=${wallet}&limit=9`, {
      headers: { "X-API-KEY": API_KEY }
    });

    if (!res.ok) throw new Error(`OpenSea API error: ${res.status}`);
    const data = await res.json();

    if (!data.assets || data.assets.length === 0) {
      grid.innerHTML = "<p>No NFTs found for this wallet.</p>";
      return;
    }

    grid.innerHTML = "";
    data.assets.forEach(nft => {
      const card = document.createElement("div");
      card.className = "nft-card";
      card.innerHTML = `
        <img src="${nft.image_url || 'https://via.placeholder.com/400x300'}" alt="${nft.name || 'NFT'}">
        <div class="info">
          <h3>${nft.name || 'Unnamed NFT'}</h3>
          <p>Collection: ${nft.collection?.name || 'Unknown'}</p>
          <p>Price: ${nft.last_sale?.total_price || 'N/A'} ETH</p>
        </div>
      `;
      grid.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p>Error loading NFTs: ${err.message}</p>`;
  }
}
