import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { gsap } from 'gsap';

import TRACK from '/public/audio/fire.mp3';

export default class VisualizerAudio {
    constructor(mesh, frequencyUniformName) {
      // mesh setup
      this.mesh = mesh;
      this.frequencyUniformName = frequencyUniformName;
      this.mesh.material.uniforms[this.frequencyUniformName] = {value: 0};
  
      this.track = TRACK;
  
      // audio listener
      this.listener = new THREE.AudioListener();
      this.mesh.add(this.listener);
  
      //global audio source
      this.sound = new THREE.Audio(this.listener);
      this.loader = new THREE.AudioLoader();
  
      // analyser
      this.analyser = new THREE.AudioAnalyser(this.sound, 32)
    }
  
    /**
     * Load function
     */
    load(audioStatus) {
      this.loader.load(this.track, (buffer) => {
        this.sound.setBuffer(buffer)
        this.sound.setLoop(true)
        this.sound.setVolume(0.5)

      })
    }
  
    /**
     * getFrenquency function
     * @returns 
     */
    getFrequency() {
      return this.analyser.getAverageFrequency()
    }
  
    /**
     * Update
     */
    update() {
        this.freq = Math.max(this.getFrequency() - 100, 0) / 50;
        const freqUniform = this.mesh.material.uniforms[this.frequencyUniformName];
        
        gsap.to(freqUniform, {
            duration: 1.5,
            ease: 'Slow.easeOut',
            value: this.freq,
        })
    
        return this.freq
    }
  }
  