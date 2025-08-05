<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Button from './Button.svelte';

  export let tokenId: number;
  export let walletAddress: string;
  export let price: string;
  export let token: string;
  export let visible: boolean = false;
  export let onClose: () => void;

  const dispatch = createEventDispatcher();

  let timeRemaining = 180; // 3 minutes in seconds
  let audio: HTMLAudioElement | null = null;
  let intervalId: ReturnType<typeof setInterval>;

  // Sound effects for adoption celebration
  const adoptionSounds = [
    'https://www.myinstants.com/media/sounds/mktoasty.mp3',
    'https://www.myinstants.com/media/sounds/schizolobotomy.mp3',
    'https://www.myinstants.com/media/sounds/perfect-street-fighter-sound-effect.mp3',
    'https://www.myinstants.com/media/sounds/shoryureppa-02-ken.mp3',
    'https://www.myinstants.com/media/sounds/street-fighter-the-movie-arcade-insert-coin-sound-effect.mp3',
  ];

  function playAdoptionSound() {
    const randomIndex = Math.floor(Math.random() * adoptionSounds.length);
    const audioUrl = adoptionSounds[randomIndex];

    audio = new Audio(audioUrl);
    audio.volume = 0.4;

    audio.play().catch(error => {
      console.log('Audio play failed:', error);
    });
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function shareToSocial() {
    const shareText = `🎭 Just adopted my Schizo Brother #${tokenId} on @Starknet! The blockchain is trembling! 🚀 #Schizodio #NFT #Starknet`;
    const shareUrl = `https://schizodio.xyz`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Schizodio NFT Adoption',
          text: shareText,
          url: shareUrl,
        })
        .catch(console.error);
    } else {
      // Fallback: copy to clipboard
      const fullText = `${shareText}\n${shareUrl}`;
      navigator.clipboard
        .writeText(fullText)
        .then(() => {
          alert('Share text copied to clipboard! 📋');
        })
        .catch(console.error);
    }
  }

  function takeScreenshot() {
    // Create a canvas element to capture the toast
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const toastElement = document.querySelector(
      '.adoption-toast'
    ) as HTMLElement;

    if (ctx && toastElement) {
      // Set canvas size to match toast
      canvas.width = toastElement.offsetWidth;
      canvas.height = toastElement.offsetHeight;

      // Use html2canvas-like approach (simplified)
      // In a real implementation, you'd use html2canvas library
      alert(
        '📸 Screenshot feature would capture your adoption moment! (Feature placeholder)'
      );
    }
  }

  function closeToast() {
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (audio) {
      audio.pause();
      audio = null;
    }
    onClose();
    dispatch('close');
  }

  onMount(() => {
    if (visible) {
      // Play random sound on mount
      playAdoptionSound();

      // Start countdown timer
      intervalId = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
          closeToast();
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (audio) {
        audio.pause();
      }
    };
  });
</script>

{#if visible}
  <div class="adoption-toast">
    <div class="toast-content">
      <!-- Header with countdown -->
      <div class="toast-header">
        <div class="adoption-title">🎭 FRESHLY ADOPTED! 🎭</div>
        <div class="countdown">⏰ {formatTime(timeRemaining)}</div>
      </div>

      <!-- NFT Display Section -->
      <div class="nft-showcase">
        <div class="nft-image-container">
          <img
            src="/api/nft-image/{tokenId}"
            alt="Schizo Brother #{tokenId}"
            class="nft-image"
            on:error={e => {
              if (e.target && e.target instanceof HTMLImageElement) {
                e.target.src = '/placeholder.webp';
              }
            }}
          />
          <div class="nft-overlay">
            <div class="nft-id">#{tokenId}</div>
          </div>
        </div>

        <div class="nft-details">
          <div class="nft-name">Schizo Brother #{tokenId}</div>
          <div class="adoption-info">
            Adopted for {price}
            {token}
          </div>
          <div class="wallet-info">
            by {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        </div>
      </div>

      <!-- Social Sharing Section -->
      <div class="social-section">
        <div class="share-text">🎪 Share your adoption with the world! 🎪</div>

        <div class="share-buttons">
          <button class="share-btn" on:click={shareToSocial}>📤 Share</button>
          <button class="screenshot-btn" on:click={takeScreenshot}>
            📸 Screenshot
          </button>
          <button class="sound-btn" on:click={playAdoptionSound}>
            🔊 Play Sound
          </button>
        </div>
      </div>

      <!-- Close button -->
      <div class="close-section">
        <button class="close-btn" on:click={closeToast}>✕ Close</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .adoption-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 3px solid #ff00ff;
    border-radius: 15px;
    padding: 20px;
    box-shadow:
      0 0 20px rgba(255, 0, 255, 0.5),
      0 0 40px rgba(0, 255, 255, 0.3);
    max-width: 400px;
    min-width: 350px;
    animation:
      toastSlideIn 0.5s ease-out,
      glowPulse 2s ease-in-out infinite;
    font-family: 'Courier New', monospace;
    color: #ffffff;
  }

  .toast-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .toast-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #ff00ff;
    padding-bottom: 10px;
  }

  .adoption-title {
    font-size: 1.4rem;
    font-weight: bold;
    text-shadow: 2px 2px 0px #ff00ff;
    animation: textGlow 1.5s ease-in-out infinite alternate;
  }

  .countdown {
    font-size: 1.1rem;
    color: #00ffff;
    font-weight: bold;
    animation: pulse 1s ease-in-out infinite;
  }

  .nft-showcase {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .nft-image-container {
    position: relative;
    width: 120px;
    height: 120px;
    border: 2px solid #00ffff;
    border-radius: 10px;
    overflow: hidden;
    background: #000;
  }

  .nft-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: imageGlow 2s ease-in-out infinite;
  }

  .nft-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: 5px;
  }

  .nft-id {
    color: #ff00ff;
    font-weight: bold;
    text-align: center;
    font-size: 0.9rem;
  }

  .nft-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .nft-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #00ffff;
  }

  .adoption-info {
    font-size: 1rem;
    color: #ffffff;
  }

  .wallet-info {
    font-size: 0.9rem;
    color: #cccccc;
    font-style: italic;
  }

  .social-section {
    border-top: 1px solid #333;
    padding-top: 15px;
  }

  .share-text {
    text-align: center;
    font-size: 1rem;
    margin-bottom: 10px;
    color: #ff00ff;
  }

  .share-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .share-btn,
  .screenshot-btn,
  .sound-btn {
    font-size: 0.9rem;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .share-btn {
    background: linear-gradient(45deg, #ff00ff, #ff0080);
  }

  .screenshot-btn {
    background: linear-gradient(45deg, #00ffff, #0080ff);
  }

  .sound-btn {
    background: linear-gradient(45deg, #ffff00, #ff8000);
  }

  .close-section {
    text-align: center;
    border-top: 1px solid #333;
    padding-top: 10px;
  }

  .close-btn {
    background: linear-gradient(45deg, #ff0000, #800000);
    font-size: 0.9rem;
    padding: 6px 12px;
  }

  @keyframes toastSlideIn {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes glowPulse {
    0%,
    100% {
      box-shadow:
        0 0 20px rgba(255, 0, 255, 0.5),
        0 0 40px rgba(0, 255, 255, 0.3);
    }
    50% {
      box-shadow:
        0 0 30px rgba(255, 0, 255, 0.8),
        0 0 60px rgba(0, 255, 255, 0.6);
    }
  }

  @keyframes textGlow {
    0% {
      text-shadow: 2px 2px 0px #ff00ff;
    }
    100% {
      text-shadow:
        2px 2px 0px #ff00ff,
        0 0 10px #ff00ff;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes imageGlow {
    0%,
    100% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.2) saturate(1.2);
    }
  }

  /* Responsive design */
  @media (max-width: 480px) {
    .adoption-toast {
      right: 10px;
      left: 10px;
      max-width: none;
      min-width: auto;
    }

    .nft-showcase {
      flex-direction: column;
      text-align: center;
    }

    .share-buttons {
      flex-direction: column;
    }
  }
</style>
