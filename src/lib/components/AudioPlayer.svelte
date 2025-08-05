@@ .. @@
 <script lang="ts">
-  import { onMount } from 'svelte';
-  import type { AudioPlayerState } from './types';
+  import { audioStore, toggleAudio, setVolume } from '../stores/audio';
   import VolumeSlider from './VolumeSlider.svelte';
   import Button from './Button.svelte';
   
-  export let audioSrc: string;
   export let title = 'Audio Player';
-  export let autoplay = true;
   
-  let audio: HTMLAudioElement;
-  let state: AudioPlayerState = 'paused';
-
-  let volume = 1;
-  
-  onMount(() => {
-    audio = new Audio(audioSrc);
-    audio.loop = true;
-    audio.volume = volume;
-    
-    audio.addEventListener('playing', () => state = 'playing');
-    audio.addEventListener('pause', () => state = 'paused');
-    
-    if (autoplay) {
-      // We need to handle autoplay with user interaction due to browser policies
-      const playPromise = audio.play();
-      if (playPromise !== undefined) {
-        playPromise.catch(error => {
-          console.warn('Autoplay prevented:', error);
-          state = 'paused';
-        });
-      }
-    }
-    
-    return () => {
-      audio.pause();
-      audio.remove();
-    };
-  });
+  $: ({ state, volume } = $audioStore);
   
   function togglePlay() {
-    if (state === 'playing') {
-      audio.pause();
-    } else {
-      audio.play();
-    }
+    toggleAudio();
   }
 
   // Export the togglePlay function so parent components can call it
   export { togglePlay };
 
   function handleVolumeChange(event: CustomEvent<number>) {
-    volume = event.detail;
-    if (audio) {
-      audio.volume = volume;
-    }
+    setVolume(event.detail);
   }
 </script>