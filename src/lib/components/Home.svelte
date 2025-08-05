import schizodio_sq from '../../assets/images/schizodio_sq.jpg';
import danceGif from '../../assets/images/dance-schizo.gif';
import CopyButton from './CopyButton.svelte';
import AudioPlayer from './AudioPlayer.svelte';
import { togglePlayback } from '../stores/audio';
import VolumeSlider from './VolumeSlider.svelte';
import { link } from 'svelte-spa-router';
import { onMount } from 'svelte';

  hasSeenPopover = true;
  showEnterPopover = false;
  // Trigger audio play
  togglePlayback();
}
</script>

      </Window>
      <Window title="💿schizo.mp3" width="full">
        <AudioPlayer bind:this={audioPlayerRef} />
      </Window>
      <img src={schizodio_sq} alt="SCHIZODIO" width="auto" class="" />
    </div>