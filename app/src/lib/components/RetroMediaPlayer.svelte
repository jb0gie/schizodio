<script lang="ts">
  import { onMount } from 'svelte';
  import Button from './Button.svelte';
  import VolumeSlider from './VolumeSlider.svelte';

  export let audioSrc: string;
  export let title = '🎵 SCHIZO RADIO 🎵';

  let audio: HTMLAudioElement;
  let isPlaying = false;
  let volume = 0.5;
  let currentTime = 0;
  let duration = 0;
  let progress = 0;

  onMount(() => {
    audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = volume;

    audio.addEventListener('loadedmetadata', () => {
      duration = audio.duration;
    });

    audio.addEventListener('timeupdate', () => {
      currentTime = audio.currentTime;
      progress = (currentTime / duration) * 100;
    });

    audio.addEventListener('play', () => {
      isPlaying = true;
    });

    audio.addEventListener('pause', () => {
      isPlaying = false;
    });

    return () => {
      audio.pause();
      audio.remove();
    };
  });

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function handleVolumeChange(event: CustomEvent<number>) {
    volume = event.detail;
    if (audio) {
      audio.volume = volume;
    }
  }

  function seek(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;
    audio.currentTime = seekTime;
  }
</script>

<div class="retro-media-player">
  <div class="player-display">
    <div class="display-text">
      {#if isPlaying}
        <span class="playing-indicator">▶</span>
      {:else}
        <span class="paused-indicator">⏸</span>
      {/if}
      {title}
    </div>
    <div class="progress-bar" on:click={seek}>
      <div class="progress-fill" style="width: {progress}%"></div>
    </div>
  </div>

  <div class="player-controls">
    <Button on:click={togglePlay} width="40px" height="32px">
      {#if isPlaying}
        <span class="control-icon">⏸</span>
      {:else}
        <span class="control-icon">▶</span>
      {/if}
    </Button>

    <div class="volume-control">
      <span class="volume-icon">🔊</span>
      <VolumeSlider value={volume} steps={10} on:change={handleVolumeChange} />
    </div>
  </div>
</div>

<style>
  .retro-media-player {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: linear-gradient(145deg, #c0c0c0, #e0e0e0);
    border: 2px solid #808080;
    border-radius: 8px;
    box-shadow:
      inset 2px 2px 4px rgba(255, 255, 255, 0.8),
      inset -2px -2px 4px rgba(0, 0, 0, 0.2),
      2px 2px 4px rgba(0, 0, 0, 0.3);
    min-width: 280px;
    max-width: 320px;
  }

  .player-display {
    background: #000;
    border: 2px inset #808080;
    padding: 8px;
    border-radius: 4px;
  }

  .display-text {
    color: #00ff00;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 8px;
    text-shadow: 0 0 5px #00ff00;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .playing-indicator {
    color: #ff0000;
    animation: blink 1s infinite;
  }

  .paused-indicator {
    color: #ffff00;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0.3;
    }
  }

  .progress-bar {
    width: 100%;
    height: 12px;
    background: #333;
    border: 1px inset #808080;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff00, #00cc00);
    transition: width 0.1s ease;
    box-shadow: inset 0 0 4px rgba(0, 255, 0, 0.5);
  }

  .player-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .volume-icon {
    font-size: 14px;
    color: #333;
  }

  .control-icon {
    font-size: 16px;
    font-weight: bold;
  }

  /* Retro button styling override */
  :global(.retro-media-player button) {
    background: linear-gradient(145deg, #d0d0d0, #f0f0f0);
    border: 2px outset #808080;
    border-radius: 4px;
    font-weight: bold;
    color: #333;
  }

  :global(.retro-media-player button:hover) {
    background: linear-gradient(145deg, #e0e0e0, #f8f8f8);
  }

  :global(.retro-media-player button:active) {
    border-style: inset;
    background: linear-gradient(145deg, #c0c0c0, #d0d0d0);
  }
</style>
