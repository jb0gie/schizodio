<script lang="ts">
  import Window from './Window.svelte';
  import Button from './Button.svelte';
  import { currentTheme } from '../stores/theme';
  import schizodio_title from '../../assets/images/schizodio.png';
  import schizodio_sq from '../../assets/images/schizodio_sq.jpg';
  import danceGif from '../../assets/images/dance-schizo.gif';
  import CopyButton from './CopyButton.svelte';
  import AudioPlayer from './AudioPlayer.svelte';
  import VolumeSlider from './VolumeSlider.svelte';
  import { link } from 'svelte-spa-router';
  import { onMount } from 'svelte';

  let volumeValue = 1;
  let blinkState = true;

  $: ({
    colors: { background, window, text, highlight, highlightText },
  } = $currentTheme);

  onMount(() => {
    // Start blinking animation
    setInterval(() => {
      blinkState = !blinkState;
    }, 1000);
  });
</script>

<!-- MAIN COLUMN -->
<div
  class="gap-4 flex flex-col justify-center items-center w-full min-h-screen overflow-x-hidden"
>
  <!-- TOP NAVIGATION -->
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <Window title="🚀 DIMENSIONAL TRAVEL 🚀" width="full">
      <div class="flex gap-4 justify-center p-2">
        <a href="/mint" use:link>
          <Button>
            <span class="mega-text {blinkState ? 'blink' : ''} glitch shake">
              🎨 ENTER THE MINT DIMENSION! 🎨
            </span>
          </Button>
        </a>
      </div>
    </Window>
  </div>

  <div class="w-full max-w-screen-xl mx-auto px-4 flex justify-center">
    <img
      src={schizodio_title}
      alt="Schizodio"
      class="max-w-full h-auto rainbow"
      style="max-width: 500px;"
    />
  </div>

  <!-- FIRST ROW -->
  <div
    class="container flex flex-col max-sm:items-center sm:flex-row gap-2 w-full justify-center"
  >
    <!-- FIRST WINDOW -->
    <Window title="✨ SCHIZODIO BROTHERS HEADQUARTERS ✨" width="full">
      <style>
        .bliss {
          background-image: URL('https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png');
          background-size: cover;
          background-position: center;
        }
      </style>
      <div class="bliss w-full sm:w-96">
        <img src={danceGif} alt="SCHIZODIO" width="auto" />
      </div>
      <div class="flex gap-1 w-full mt-1.5">
        <a class="w-full" href="https://x.com/schizodio">
          <Button>Twitter</Button>
        </a>
        <a
          class="w-full"
          href="https://app.avnu.fi/en?mode=simple&tokenFrom=0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d&tokenTo=0xacc2fa3bb7f6a6726c14d9e142d51fe3984dbfa32b5907e1e76425177875e2&amount=0.001"
        >
          <Button>Buy</Button>
        </a>
        <a
          class="w-full"
          href="https://dexscreener.com/starknet/0x00acc2fa3bb7f6a6726c14d9e142d51fe3984dbfa32b5907e1e76425177875e2-0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d-2347948331754475397897284791279200659-5982-0x0"
        >
          <Button>Chart</Button>
        </a>
      </div>
    </Window>
    <div class="flex flex-col gap-2 max-w-96 w-full sm:w-64">
      <Window title="😵schizodio.exe" width="full">
        <div class="relative">
          <label class="text-xs block mb-1">How schizo you are?</label>
          <div class="flex text-xs gap-2">
            <span>Low</span>
            <VolumeSlider bind:value={volumeValue} steps={10} />
            <span>High</span>
          </div>
        </div>
      </Window>
      <Window title="💿schizo.mp3" width="full">
        <AudioPlayer audioSrc="./canttakemyeyesoffyou.mp3" />
      </Window>
      <img src={schizodio_sq} alt="SCHIZODIO" width="auto" class="" />
    </div>
  </div>

  <!-- CONTRACT ADDRESS -->
  <div
    class="container flex mb-3 flex-col max-sm:items-center sm:flex-row gap-2 w-full justify-center"
  >
    <Window title="📄Contract Address" width="full">
      <div class="max-sm:flex-col flex justify-center gap-2">
        <CopyButton />
        <p class="text-xxs sm:text-lg text-center">
          0x00acc2fa3bb7f6a6726c14d9e142d51fe3984dbfa32b5907e1e76425177875e2
        </p>
      </div>
    </Window>
  </div>

  <!-- SCHIZO ANNOUNCEMENT -->
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <Window title="📢 BREAKING NEWS 📢" width="full">
      <div
        class="matrix text-center mega-text {blinkState
          ? 'blink'
          : ''} glitch-text"
      >
        🔥 999 SCHIZO BROTHERS AVAILABLE FOR ADOPTION! ONLY $30! 🔥
      </div>
    </Window>
  </div>

  <!-- DISCLAIMER -->
  <div class="w-full max-w-screen-xl mx-auto px-4 mt-4">
    <Window title="⚠️ REALITY CHECK ⚠️" width="full">
      <div
        class="p-3 matrix text-center schizo-text {blinkState ? 'blink' : ''}"
      >
        🎭 REMINDER: You are currently inside a computer simulation. Your NFTs
        are also simulated. Everything is fine. 🎭
      </div>
    </Window>
  </div>
</div>

<!-- SCHIZO STYLES -->
<style>
  .schizo-text {
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow:
      2px 2px 0px #ff00ff,
      -2px -2px 0px #00ffff;
  }

  .mega-text {
    font-size: 1.8rem;
    font-weight: bold;
  }

  .blink {
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  .rainbow {
    background: linear-gradient(
      45deg,
      #ff0000,
      #ff7700,
      #ffdd00,
      #00ff00,
      #0099ff,
      #6600ff,
      #ff0099
    );
    background-size: 400% 400%;
    animation: rainbow 2s ease-in-out infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @keyframes rainbow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .matrix {
    background: #000;
    color: #00ff00;
    font-family: 'Courier New', monospace;
    padding: 10px;
    border: 2px solid #00ff00;
  }

  /* MAXIMUM SCHIZO EFFECTS */
  .glitch {
    animation: glitch 2s infinite;
  }

  @keyframes glitch {
    0%,
    90%,
    100% {
      transform: translate(0);
    }
    10% {
      transform: translate(-2px, 2px);
    }
    20% {
      transform: translate(2px, -2px);
    }
    30% {
      transform: translate(-2px, -2px);
    }
    40% {
      transform: translate(2px, 2px);
    }
    50% {
      transform: translate(-2px, 2px);
    }
    60% {
      transform: translate(2px, -2px);
    }
    70% {
      transform: translate(-2px, -2px);
    }
    80% {
      transform: translate(2px, 2px);
    }
  }

  .spinning {
    animation: spin 10s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .shake {
    animation: shake 0.5s infinite;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }

  .glitch-text {
    position: relative;
    animation: text-glitch 3s infinite;
  }

  @keyframes text-glitch {
    0%,
    93%,
    100% {
      transform: translate(0);
    }
    1% {
      transform: translate(-2px, 1px);
    }
    2% {
      transform: translate(2px, -1px);
    }
    3% {
      transform: translate(-1px, 2px);
    }
    4% {
      transform: translate(1px, -2px);
    }
    5% {
      transform: translate(-1px, 1px);
    }
    6% {
      transform: translate(2px, 1px);
    }
    7% {
      transform: translate(-2px, -1px);
    }
    8% {
      transform: translate(1px, 2px);
    }
    9% {
      transform: translate(-1px, -2px);
    }
    10% {
      transform: translate(2px, -2px);
    }
  }
</style>
