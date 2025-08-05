import { writable } from 'svelte/store';

export type AudioPlayerState = 'playing' | 'paused';

export interface AudioStore {
  state: AudioPlayerState;
  volume: number;
  audio: HTMLAudioElement | null;
}

export const audioStore = writable<AudioStore>({
  state: 'paused',
  volume: 1,
  audio: null
});

export function initializeAudio(audioSrc: string, autoplay: boolean = true) {
  const audio = new Audio(audioSrc);
  audio.loop = true;
  
  audioStore.update(store => {
    store.audio = audio;
    audio.volume = store.volume;
    return store;
  });
  
  audio.addEventListener('playing', () => {
    audioStore.update(store => ({ ...store, state: 'playing' }));
  });
  
  audio.addEventListener('pause', () => {
    audioStore.update(store => ({ ...store, state: 'paused' }));
  });
  
  if (autoplay) {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Autoplay prevented:', error);
        audioStore.update(store => ({ ...store, state: 'paused' }));
      });
    }
  }
  
  return audio;
}

export function toggleAudio() {
  audioStore.update(store => {
    if (store.audio) {
      if (store.state === 'playing') {
        store.audio.pause();
      } else {
        store.audio.play();
      }
    }
    return store;
  });
}

export function setVolume(volume: number) {
  audioStore.update(store => {
    store.volume = volume;
    if (store.audio) {
      store.audio.volume = volume;
    }
    return store;
  });
}