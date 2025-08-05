@@ .. @@
 <script lang="ts">
   import router from 'svelte-spa-router';
   import { currentTheme } from './lib/stores/theme';
+  import { initializeAudio } from './lib/stores/audio';
+  import { onMount } from 'svelte';
   import Home from './lib/components/Home.svelte';
   import Mint from './lib/Mint/+page.svelte';

   const routes = {
     '/': Home,
     '/mint': Mint,
     '*': Home,
   };

   $: ({
     colors: { background, window, text, highlight, highlightText },
   } = $currentTheme);
+
+  onMount(() => {
+    // Initialize audio in the layout so it persists across routes
+    initializeAudio('./canttakemyeyesoffyou_1.mp3');
+  });
 </script>