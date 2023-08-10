import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import Experience from '../Experience';

import { SoftGlitchPass } from '../shader/passes/SoftGlitch';

import vertexPars from '../shader/organicSplitShaders/vertex_pars.glsl'
import vertexMain from '../shader/organicSplitShaders/vertex_main.glsl'
import fragmentPars from '../shader/organicSplitShaders/fragment_pars.glsl'
import fragmentMain from '../shader/organicSplitShaders/fragment_main.glsl'

import vertexAudio from '../shader/audioShaders/vertexAudio.glsl'
import fragmentAudio from '../shader/audioShaders/fragmentAudio.glsl'

import vertexDisplex from '../shader/displexShaders/vertexDisplex.glsl'
import fragmentDisplex from '../shader/displexShaders/fragmentDisplex.glsl'


export default class ShaderMaterials {
    constructor() {
        this.experience = new Experience();
        this.time = this.experience.time.animatedTime;
        
    }

    /**
     * Organic material
     * @returns 
     */
    createOrganicMaterial() {
        this.orgaMaterial = new THREE.MeshStandardMaterial({
            onBeforeCompile: (shader) => {
              // storing a reference to the shader object
              this.orgaMaterial.userData.shader = shader

              //uniforms
              shader.uniforms.uTime = {value: 0}
        
              const parseVertexString = /* glsl */`#include <displacementmap_pars_vertex>`;
              shader.vertexShader = shader.vertexShader.replace(parseVertexString, parseVertexString + /* glsl */`
              ` + vertexPars)
              
              const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`
              shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + /* glsl */`
              ` + vertexMain)
        
              const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`
              shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString, mainFragmentString + /* glsl */`
              ` + fragmentMain)
        
              const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`
              shader.fragmentShader = shader.fragmentShader.replace(parsFragmentString, parsFragmentString + /* glsl */`
              ` + fragmentPars)
        
            }
        });

        return this.orgaMaterial;
    }

    /**
     * Audio material
     */
    createAudioMaterial() {
        this.audMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexAudio,
            fragmentShader: fragmentAudio,
            uniforms: {
              uTime: {value: 0},
            }
          })

          return this.audMaterial;
    }

    /**
     * Displex material
     */
    createDisplexMaterial() {
        this.displexMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexDisplex,
            fragmentShader: fragmentDisplex,
            side: THREE.DoubleSide,
            wireframe: false,
            uniforms: {
              uTime: { value: 0 },
              uResolution: { value: new THREE.Vector2() },
              uDisplace: { value: 2 },
              uSpread: { value: 1.2 },
              uNoise: { value: 16 },
            },
        })

        return this.displexMaterial
    }

    /**
     * Add some wireframe lines around mesh
     * @param {THREE.geometry} geometry 
     * @param {THREE.material} material 
     * @param {THREE.mesh} mesh 
     * @param {number} delta 
     */
    addWireLines(geometry, material, mesh, delta = 0.015) {
        this.wireLines = new THREE.LineSegments(geometry, material);
        this.wireLines.scale.setScalar(1 + delta);
        mesh.add(this.wireLines);
    }

    addPostProcessingComposer() {
        this.renderScene = new RenderPass( this.experience.scene, this.experience.camera.perspectiveCamera );
        this.composer = new EffectComposer( this.experience.renderer.renderer );
        this.composer.addPass( this.renderScene );
        this.composer.setSize(this.experience.sizes.width, this.experience.sizes.height);
    }

    /**
     * Create postprocessing Glitch effect
     * @returns 
     */
    createGlitchEffect() {
        this.renderScene = new RenderPass( this.experience.scene, this.experience.camera.perspectiveCamera );

        this.softGlitch = new SoftGlitchPass();
        /* this.softGlitch.factor = 1; */

        this.composer = new EffectComposer( this.experience.renderer.renderer );
        this.composer.addPass( this.renderScene );
        this.composer.addPass( this.softGlitch );

        this.composer.setSize(this.experience.sizes.width, this.experience.sizes.height);

        return this.softGlitch;
    }

    createBloomPassEffect() {
        this.addPostProcessingComposer()

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.4,
            0.0001,
            0.01
          );

          this.composer.addPass(this.bloomPass);
    }

    //RESIZE
    resize() {
    }

    //UPDATE
    update() {
        this.time = this.experience.time.animatedTime;
        
        // Only if organic is create
        //if(this.orgaMaterial) this.orgaMaterial.userData.shader.uniforms.uTime.value = this.time * .04;
        
        if(this.audMaterial) this.audMaterial.uniforms.uTime.value = this.time / 2;

        if(this.displexMaterial) this.displexMaterial.uniforms.uTime.value = this.time;

        if(this.composer) {      
            this.composer.render();
        }
    }
}