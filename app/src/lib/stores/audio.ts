import { writable } from 'svelte/store';

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  audioSrc: string;
}

const createAudioStore = () => {
  const { subscribe, set, update } = writable<AudioState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    audioSrc: './canttakemyeyesoffyou_1.mp3'
  });

  let audio: HTMLAudioElement | null = null;

  const initializeAudio = () => {
    if (!audio) {
      audio = new Audio('./canttakemyeyesoffyou_1.mp3');
      audio.loop = true;
      audio.volume = 1;
      
      audio.addEventListener('playing', () => {
        update(state => ({ ...state, isPlaying: true }));
      });
      
      audio.addEventListener('pause', () => {
        update(state => ({ ...state, isPlaying: false }));
      });
      
      audio.addEventListener('ended', () => {
        update(state => ({ ...state, isPlaying: false }));
      });
    }
  };

  const play = async () => {
    initializeAudio();
    if (audio && !audio.paused) return;
    
    try {
      await audio?.play();
      update(state => ({ ...state, isPlaying: true }));
    } catch (error) {
      console.warn('Audio play failed:', error);
    }
  };

  const pause = () => {
    audio?.pause();
    update(state => ({ ...state, isPlaying: false }));
  };

  const togglePlay = async () => {
    if (audio?.paused) {
      await play();
    } else {
      pause();
    }
  };

  const setVolume = (volume: number) => {
    if (audio) {
      audio.volume = volume;
    }
    update(state => ({ ...state, volume }));
  };

  const toggleMute = () => {
    update(state => {
      const newMuted = !state.isMuted;
      if (audio) {
        audio.muted = newMuted;
      }
      return { ...state, isMuted: newMuted };
    });
  };

  const setMuted = (muted: boolean) => {
    if (audio) {
      audio.muted = muted;
    }
    update(state => ({ ...state, isMuted: muted }));
  };

  const destroy = () => {
    audio?.pause();
    audio = null;
  };

  return {
    subscribe,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    setMuted,
    destroy
  };
};

export const audioStore = createAudioStore(); 