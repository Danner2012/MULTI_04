import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-viewer360',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './viewer360.component.html',
  styleUrl: './viewer360.component.scss'
})
export class Viewer360Component implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  private scene!: THREE.Scene;
  private cssScene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cssRenderer!: CSS3DRenderer;
  private controls!: OrbitControls;
  private animationId!: number;

  ngAfterViewInit() {
    this.initThree();
  }

  private initThree() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    this.camera.position.set(0, 0, 0.1); 

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(width, height);
    this.cssRenderer.domElement.style.position = 'absolute';
    this.cssRenderer.domElement.style.top = '0';
    this.cssRenderer.domElement.style.pointerEvents = 'none'; 
    this.rendererContainer.nativeElement.appendChild(this.cssRenderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = -0.4; 

    const geometry = new THREE.SphereGeometry(1000, 60, 40);
    geometry.scale(-1, 1, 1);
    const texture = new THREE.TextureLoader().load('360-paisaje.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    this.scene.add(sphere);

    // Capturamos el login-card que está dentro del componente login
    const loginElement = document.getElementById('login-card-3d');
    if (loginElement) {
      loginElement.style.pointerEvents = 'auto'; 
      const cssObject = new CSS3DObject(loginElement);
      cssObject.position.set(0, 0, -600); 
      this.cssScene.add(cssObject);
    }

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.cssRenderer.render(this.cssScene, this.camera);
    };
    animate();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.camera && this.renderer && this.cssRenderer) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.cssRenderer.setSize(width, height);
    }
  }

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
  }
}
