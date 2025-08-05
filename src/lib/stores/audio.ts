import { writable } from 'svelte/store';

export interface AudioState {
  isPlaying: boolean;
  volume: number;
  audio: HTMLAudioElement | null;
}

export const audioStore = writable<AudioState>({
  isPlaying: false,
  volume: 1,
  audio: null
});

export function initializeAudio(audioSrc: string) {
  const audio = new Audio(audioSrc);
  audio.loop = true;
  
  audioStore.update(state => ({
    ...state,
    audio
  }));

  audio.addEventListener('playing', () => {
    audioStore.update(state => ({ ...state, isPlaying: true }));
  });
  
  audio.addEventListener('pause', () => {
    audioStore.update(state => ({ ...state, isPlaying: false }));
  });

  return audio;
}

export function togglePlayback() {
  audioStore.update(state => {
    if (state.audio) {
      if (state.isPlaying) {
        state.audio.pause();
      } else {
        state.audio.play().catch(error => {
          console.warn('Playback prevented:', error);
        });
      }
    }
    return state;
  });
}

export function setVolume(volume: number) {
  audioStore.update(state => {
    if (state.audio) {
      state.audio.volume = volume;
    }
    return { ...state, volume };
  });
}