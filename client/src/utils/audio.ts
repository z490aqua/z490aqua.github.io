class AudioManager {
  private sounds: Map<string, HTMLAudioElement>;
  private musicTracks: Map<string, HTMLAudioElement>;
  private currentMusic: HTMLAudioElement | null;
  private isMuted: boolean;
  
  constructor() {
    this.sounds = new Map();
    this.musicTracks = new Map();
    this.currentMusic = null;
    this.isMuted = false;
  }
  
  loadSound(id: string, url: string) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds.set(id, audio);
  }
  
  loadMusic(id: string, url: string) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.loop = true;
    this.musicTracks.set(id, audio);
  }
  
  playSound(id: string) {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(id);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.error('Error playing sound:', e));
    }
  }
  
  playMusic(id: string) {
    if (this.isMuted) return;
    
    // Stop current music if playing
    this.stopMusic();
    
    const music = this.musicTracks.get(id);
    if (music) {
      music.currentTime = 0;
      music.play().catch(e => console.error('Error playing music:', e));
      this.currentMusic = music;
    }
  }
  
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    // Mute/unmute all sounds
    this.sounds.forEach(sound => {
      sound.muted = this.isMuted;
    });
    
    // Mute/unmute all music
    this.musicTracks.forEach(music => {
      music.muted = this.isMuted;
    });
    
    return this.isMuted;
  }
  
  setMute(mute: boolean) {
    if (this.isMuted !== mute) {
      this.toggleMute();
    }
  }
  
  isMutedStatus(): boolean {
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();

// Preload common game sounds
audioManager.loadSound('jump', 'https://assets.mixkit.co/active_storage/sfx/941/941-preview.mp3');
audioManager.loadSound('collect', 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
audioManager.loadSound('complete', 'https://assets.mixkit.co/active_storage/sfx/218/218-preview.mp3');
audioManager.loadSound('collision', 'https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3');
