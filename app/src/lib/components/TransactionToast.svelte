<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  export let visible = false;
  export let transactionHash = '';
  export let tokenId: number | null = null;
  export let price = '';
  export let token = '';
  export let imageUrl = '';

  const dispatch = createEventDispatcher();

  function closeToast() {
    visible = false;
    dispatch('close');
  }

  function openVoyager() {
    const voyagerUrl = `https://voyager.online/tx/${transactionHash}`;
    window.open(voyagerUrl, '_blank');
  }

  function copyTransactionHash() {
    navigator.clipboard.writeText(transactionHash);
    // You could add a temporary "Copied!" message here
  }

  // Auto-hide after 10 seconds
  $: if (visible) {
    setTimeout(() => {
      closeToast();
    }, 10000);
  }
</script>

{#if visible}
  <div
    class="transaction-toast"
    transition:fly={{ y: 50, duration: 300, easing: quintOut }}
  >
    <div class="toast-header">
      <div class="success-icon">🎉</div>
      <div class="toast-title">MINT SUCCESSFUL!</div>
      <button class="close-btn" on:click={closeToast}>×</button>
    </div>

    <div class="toast-content">
      <div class="nft-preview">
        <img src={imageUrl} alt="Schizo NFT #{tokenId}" class="nft-image" />
        <div class="nft-info">
          <div class="nft-title">Schizo NFT #{tokenId}</div>
          <div class="nft-price">{price} {token}</div>
        </div>
      </div>

      <div class="transaction-info">
        <div class="tx-hash">
          <span class="label">Transaction:</span>
          <span class="hash">
            {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
          </span>
          <button class="copy-btn" on:click={copyTransactionHash}>📋</button>
        </div>
      </div>

      <div class="toast-actions">
        <button class="voyager-btn" on:click={openVoyager}>
          🔍 View on Voyager
        </button>
        <button class="close-action-btn" on:click={closeToast}>✕ Close</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .transaction-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 400px;
    max-width: 90vw;
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    border: 3px solid #00ff00;
    border-radius: 12px;
    box-shadow:
      0 10px 30px rgba(0, 255, 0, 0.3),
      0 0 20px rgba(0, 255, 0, 0.2);
    z-index: 10000;
    font-family: 'Courier New', monospace;
    animation: toast-glow 2s ease-in-out infinite;
  }

  @keyframes toast-glow {
    0%,
    100% {
      box-shadow:
        0 10px 30px rgba(0, 255, 0, 0.3),
        0 0 20px rgba(0, 255, 0, 0.2);
    }
    50% {
      box-shadow:
        0 10px 30px rgba(0, 255, 0, 0.5),
        0 0 30px rgba(0, 255, 0, 0.4);
    }
  }

  .toast-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background: linear-gradient(90deg, #00ff00, #00cc00);
    border-radius: 9px 9px 0 0;
    color: #000;
    font-weight: bold;
  }

  .success-icon {
    font-size: 1.5rem;
    animation: bounce 1s ease-in-out infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .toast-title {
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .close-btn {
    background: none;
    border: none;
    color: #000;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }

  .toast-content {
    padding: 20px;
  }

  .nft-preview {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
    padding: 15px;
    background: rgba(0, 255, 0, 0.1);
    border: 2px solid #00ff00;
    border-radius: 8px;
  }

  .nft-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 2px solid #00ff00;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }

  .nft-info {
    flex: 1;
  }

  .nft-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #00ff00;
    margin-bottom: 5px;
    text-shadow: 0 0 5px #00ff00;
  }

  .nft-price {
    font-size: 0.9rem;
    color: #ccc;
  }

  .transaction-info {
    margin-bottom: 15px;
  }

  .tx-hash {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: #ccc;
  }

  .label {
    color: #00ff00;
    font-weight: bold;
  }

  .hash {
    font-family: 'Courier New', monospace;
    background: rgba(0, 0, 0, 0.3);
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #00ff00;
  }

  .copy-btn {
    background: none;
    border: none;
    color: #00ff00;
    cursor: pointer;
    font-size: 1rem;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .copy-btn:hover {
    background: rgba(0, 255, 0, 0.2);
    transform: scale(1.1);
  }

  .toast-actions {
    display: flex;
    gap: 10px;
  }

  .voyager-btn,
  .close-action-btn {
    flex: 1;
    padding: 10px 15px;
    border: 2px solid #00ff00;
    border-radius: 6px;
    background: linear-gradient(135deg, #00ff00, #00cc00);
    color: #000;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
  }

  .voyager-btn:hover {
    background: linear-gradient(135deg, #00cc00, #009900);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);
  }

  .close-action-btn {
    background: linear-gradient(135deg, #ff4444, #cc0000);
    border-color: #ff4444;
  }

  .close-action-btn:hover {
    background: linear-gradient(135deg, #cc0000, #990000);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 68, 68, 0.4);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .transaction-toast {
      right: 10px;
      left: 10px;
      width: auto;
      max-width: none;
    }

    .toast-content {
      padding: 15px;
    }

    .nft-preview {
      flex-direction: column;
      text-align: center;
    }

    .toast-actions {
      flex-direction: column;
    }
  }
</style>
