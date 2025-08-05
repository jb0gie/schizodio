<script lang="ts">
  export let value = 0;
  export let max = 100;

  $: progressPercentage = (value / max) * 100;
  $: isSchizo75 = progressPercentage >= 75;
  $: isSchizo90 = progressPercentage >= 90;
</script>

<div
  class="progress-container {isSchizo90
    ? 'schizo-90'
    : isSchizo75
      ? 'schizo-75'
      : ''}"
>
  <div
    class="progress-bar win95-border-inset h-8 bg-win95-light relative overflow-hidden"
  >
    <div
      class="progress-fill h-full transition-all duration-500 ease-out {isSchizo90
        ? 'schizo-90-fill'
        : isSchizo75
          ? 'schizo-75-fill'
          : 'bg-win95-blue'}"
      style="width: {progressPercentage}%"
    ></div>

    <!-- Progress text overlay -->
    <div
      class="progress-text absolute inset-0 flex items-center justify-center"
    >
      <span
        class="progress-percentage {isSchizo90
          ? 'schizo-90-text'
          : isSchizo75
            ? 'schizo-75-text'
            : 'text-win95-blue'} font-bold text-sm"
      >
        {Math.round(progressPercentage)}%
      </span>
    </div>

    <!-- Schizo effects overlay -->
    {#if isSchizo75}
      <div class="schizo-overlay absolute inset-0 pointer-events-none">
        <div class="schizo-particles"></div>
        {#if isSchizo90}
          <div class="schizo-lines"></div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .progress-container {
    position: relative;
    width: 100%;
  }

  .progress-bar {
    border: 3px solid;
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .progress-fill {
    position: relative;
    border-radius: 2px;
  }

  .progress-text {
    z-index: 10;
  }

  .progress-percentage {
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  }

  /* 75% Schizo Effects */
  .schizo-75 {
    animation: schizo-pulse 2s infinite;
  }

  .schizo-75-fill {
    background: linear-gradient(45deg, #00ff00, #ffff00, #00ff00);
    background-size: 200% 200%;
    animation: schizo-gradient 1s ease-in-out infinite;
  }

  .schizo-75-text {
    color: #ff0000;
    animation: schizo-blink 0.5s infinite;
  }

  .schizo-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
        circle at 20% 50%,
        #ff0000 1px,
        transparent 1px
      ),
      radial-gradient(circle at 80% 20%, #00ff00 1px, transparent 1px),
      radial-gradient(circle at 40% 80%, #0000ff 1px, transparent 1px);
    background-size:
      50px 50px,
      30px 30px,
      40px 40px;
    animation: schizo-particles 3s linear infinite;
    opacity: 0.6;
  }

  /* 90% Schizo Effects */
  .schizo-90 {
    animation: schizo-intense 1s infinite;
    box-shadow:
      0 0 20px #ff0000,
      0 0 40px #00ff00,
      0 0 60px #0000ff;
  }

  .schizo-90-fill {
    background: linear-gradient(
      45deg,
      #ff0000,
      #00ff00,
      #0000ff,
      #ffff00,
      #ff00ff,
      #00ffff
    );
    background-size: 300% 300%;
    animation: schizo-intense-gradient 0.5s ease-in-out infinite;
  }

  .schizo-90-text {
    color: #ffffff;
    text-shadow:
      0 0 10px #ff0000,
      0 0 20px #00ff00,
      0 0 30px #0000ff;
    animation: schizo-intense-blink 0.2s infinite;
  }

  .schizo-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        #ff0000 2px,
        #ff0000 4px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        #00ff00 2px,
        #00ff00 4px
      );
    animation: schizo-lines 0.5s linear infinite;
    opacity: 0.3;
  }

  /* Animations */
  @keyframes schizo-pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  @keyframes schizo-gradient {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes schizo-blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0.3;
    }
  }

  @keyframes schizo-particles {
    0% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(-50px);
    }
  }

  @keyframes schizo-intense {
    0%,
    100% {
      transform: scale(1) rotate(0deg);
      box-shadow:
        0 0 20px #ff0000,
        0 0 40px #00ff00,
        0 0 60px #0000ff;
    }
    25% {
      transform: scale(1.05) rotate(1deg);
      box-shadow:
        0 0 30px #ff0000,
        0 0 50px #00ff00,
        0 0 70px #0000ff;
    }
    50% {
      transform: scale(1.02) rotate(-1deg);
      box-shadow:
        0 0 25px #ff0000,
        0 0 45px #00ff00,
        0 0 65px #0000ff;
    }
    75% {
      transform: scale(1.05) rotate(1deg);
      box-shadow:
        0 0 30px #ff0000,
        0 0 50px #00ff00,
        0 0 70px #0000ff;
    }
  }

  @keyframes schizo-intense-gradient {
    0%,
    100% {
      background-position: 0% 50%;
    }
    25% {
      background-position: 100% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    75% {
      background-position: 0% 100%;
    }
  }

  @keyframes schizo-intense-blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0.1;
    }
  }

  @keyframes schizo-lines {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(10px);
    }
  }
</style>
