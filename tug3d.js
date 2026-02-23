
// ===================================
// Brain Tug - 3D Tug of War Scene
// Fully Realistic & Physically Accurate
// Using Three.js WebGL
// ===================================

class TugOfWar3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.rope = null;
        this.characterLeft = null;
        this.characterRight = null;

        // Physics
        this.teamAStrength = 5;
        this.teamBStrength = 5;
        this.ropePosition = 0;
        this.maxPullDistance = 2;
        this.gameOver = false;
        this.winnerTeam = null;

        // Spring physics
        this.velocity = 0;
        this.springStrength = 0.015; // Reduced for smoother motion
        this.damping = 0.94; // Increased for more gradual movement
        this.ropeTarget = 0;

        // Drag-and-drop state
        this.raycaster = null;
        this.mouse = new THREE.Vector2();
        this.dragPlane = null;
        this.draggedCharacter = null;
        this.isDragging = false;
        this.dragOffset = new THREE.Vector3();
        this.dragStartPos = new THREE.Vector3();
        this.originalPositions = {};
        this.liftHeight = 0.6;
        this.snapBackSpeed = 0.08;
        this.isSnappingBack = { left: false, right: false };
        this.snapTargets = { left: null, right: null };

        this.init();
    }

    // INIT
    init() {
        const container = document.querySelector('.tug-arena');
        if (!container) { console.error('Container .tug-arena not found!'); return; }

        const width = container.clientWidth || 800;
        const height = container.clientHeight || 400;
        if (width === 0 || height === 0) { console.error('Container has 0 size!'); return; }

        this.scene = new THREE.Scene();
        this.scene.background = null;

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, 3.8, 11);
        this.camera.lookAt(0, 1.4, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        const canvas = document.getElementById('tugCanvas');
        if (canvas) canvas.remove();
        container.appendChild(this.renderer.domElement);
        this.renderer.domElement.id = 'tugCanvas';
        this.renderer.domElement.className = 'tug-canvas-3d';

        this.setupLighting();
        this.createGround();
        this.createRope();
        this.createCharacters();
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize());
        this.setupKeyboardControls();
        this.setupDragControls();
        this.startAutoPull();
    }

    // DRAG & DROP CONTROLS
    setupDragControls() {
        this.raycaster = new THREE.Raycaster();
        // Invisible drag plane (XZ at variable Y)
        this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        const dom = this.renderer.domElement;

        dom.addEventListener('pointerdown', (e) => this._onPointerDown(e));
        dom.addEventListener('pointermove', (e) => this._onPointerMove(e));
        dom.addEventListener('pointerup', (e) => this._onPointerUp(e));
        dom.addEventListener('pointerleave', (e) => this._onPointerUp(e));

        // Touch support
        dom.style.touchAction = 'none';
    }

    _getPointerNDC(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        return new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
    }

    _getAllMeshes(obj) {
        var meshes = [];
        obj.traverse(function(child) {
            if (child.isMesh) meshes.push(child);
        });
        return meshes;
    }

    _onPointerDown(e) {
        var ndc = this._getPointerNDC(e);
        this.raycaster.setFromCamera(ndc, this.camera);

        // Test both characters
        var chars = [
            { obj: this.characterLeft, key: 'left' },
            { obj: this.characterRight, key: 'right' }
        ];

        var closestDist = Infinity;
        var picked = null;

        for (var i = 0; i < chars.length; i++) {
            if (!chars[i].obj) continue;
            var meshes = this._getAllMeshes(chars[i].obj);
            var hits = this.raycaster.intersectObjects(meshes, false);
            if (hits.length > 0 && hits[0].distance < closestDist) {
                closestDist = hits[0].distance;
                picked = chars[i];
            }
        }

        if (picked) {
            this.isDragging = true;
            this.draggedCharacter = picked;

            // Stop snap-back if re-grabbed
            this.isSnappingBack[picked.key] = false;

            // Store original position for snap-back
            this.dragStartPos.copy(picked.obj.position);
            if (!this.originalPositions[picked.key]) {
                this.originalPositions[picked.key] = picked.obj.position.clone();
            }

            // Calculate offset between character and intersection on a world plane
            var planeIntersect = new THREE.Vector3();
            var camPlane = new THREE.Plane();
            camPlane.setFromNormalAndCoplanarPoint(
                this.camera.getWorldDirection(new THREE.Vector3()).negate(),
                picked.obj.position
            );
            this.raycaster.ray.intersectPlane(camPlane, planeIntersect);
            this.dragOffset.subVectors(picked.obj.position, planeIntersect);

            // Visual feedback: lift up, add glow
            picked.obj.userData.preDragY = picked.obj.position.y;
            this.renderer.domElement.style.cursor = 'grabbing';

            // Pause auto-pull during drag
            this.stopAutoPull();
        }
    }

    _onPointerMove(e) {
        // Hover cursor
        if (!this.isDragging) {
            var ndc = this._getPointerNDC(e);
            this.raycaster.setFromCamera(ndc, this.camera);
            var allMeshes = [];
            if (this.characterLeft) allMeshes = allMeshes.concat(this._getAllMeshes(this.characterLeft));
            if (this.characterRight) allMeshes = allMeshes.concat(this._getAllMeshes(this.characterRight));
            var hits = this.raycaster.intersectObjects(allMeshes, false);
            this.renderer.domElement.style.cursor = hits.length > 0 ? 'grab' : 'default';
            return;
        }

        if (!this.draggedCharacter) return;

        var ndc2 = this._getPointerNDC(e);
        this.raycaster.setFromCamera(ndc2, this.camera);

        var planeIntersect = new THREE.Vector3();
        var camPlane = new THREE.Plane();
        camPlane.setFromNormalAndCoplanarPoint(
            this.camera.getWorldDirection(new THREE.Vector3()).negate(),
            this.draggedCharacter.obj.position
        );

        if (this.raycaster.ray.intersectPlane(camPlane, planeIntersect)) {
            var newPos = planeIntersect.add(this.dragOffset);
            this.draggedCharacter.obj.position.x = newPos.x;
            this.draggedCharacter.obj.position.z = newPos.z;
            // Lift character up while dragging
            this.draggedCharacter.obj.position.y = (this.draggedCharacter.obj.userData.preDragY || 0) + this.liftHeight;

            // Tilt slightly toward drag direction
            var dx = this.draggedCharacter.obj.position.x - this.dragStartPos.x;
            this.draggedCharacter.obj.rotation.z = -dx * 0.04;

            // Fade shadows while lifted
            var key = this.draggedCharacter.key;
            if (key === 'left' && this.leftFootShadow) {
                this.leftFootShadow.material.opacity = 0.08;
                this.leftFootShadow.position.x = this.draggedCharacter.obj.position.x;
                this.leftFootShadow.position.z = this.draggedCharacter.obj.position.z;
            }
            if (key === 'right' && this.rightFootShadow) {
                this.rightFootShadow.material.opacity = 0.08;
                this.rightFootShadow.position.x = this.draggedCharacter.obj.position.x;
                this.rightFootShadow.position.z = this.draggedCharacter.obj.position.z;
            }
        }
    }

    _onPointerUp(e) {
        if (!this.isDragging || !this.draggedCharacter) {
            this.isDragging = false;
            this.draggedCharacter = null;
            return;
        }

        var key = this.draggedCharacter.key;
        // Set snap-back target
        this.snapTargets[key] = this.dragStartPos.clone();
        this.isSnappingBack[key] = true;

        // Restore cursor
        this.renderer.domElement.style.cursor = 'grab';

        // Reset tilt
        this.draggedCharacter.obj.rotation.z = 0;

        // Restore shadow opacity
        if (key === 'left' && this.leftFootShadow) this.leftFootShadow.material.opacity = 0.22;
        if (key === 'right' && this.rightFootShadow) this.rightFootShadow.material.opacity = 0.22;

        this.isDragging = false;
        this.draggedCharacter = null;

        // Resume auto-pull
        this.startAutoPull();
    }

    // AUTO PULL & KEYBOARD
    startAutoPull() {
        this.autoPullInterval = setInterval(() => {
            if (!this.gameOver) {
                this.teamAStrength = 4 + Math.random() * 3;
                this.teamBStrength = 4 + Math.random() * 3;
                if (Math.random() > 0.9) this.teamAStrength += 2;
                if (Math.random() > 0.9) this.teamBStrength += 2;
            }
        }, 500);
    }
    stopAutoPull() {
        if (this.autoPullInterval) { clearInterval(this.autoPullInterval); this.autoPullInterval = null; }
    }
    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            if (e.key === 'a' || e.key === 'A') this.ropeTarget -= 0.3;
            if (e.key === 'l' || e.key === 'L') this.ropeTarget += 0.3;
            if (e.key === 'r' || e.key === 'R') this.resetGame();
        });
    }

    // LIGHTING - 6-point studio + AO approximation
    setupLighting() {
        const hemi = new THREE.HemisphereLight(0x9ecfff, 0xc9a96e, 0.50);
        this.scene.add(hemi);

        const key = new THREE.DirectionalLight(0xfff0d8, 1.35);
        key.position.set(5, 14, 7);
        key.castShadow = true;
        key.shadow.mapSize.width = 2048;
        key.shadow.mapSize.height = 2048;
        key.shadow.camera.near = 0.5;
        key.shadow.camera.far = 50;
        key.shadow.camera.left = -10;
        key.shadow.camera.right = 10;
        key.shadow.camera.top = 10;
        key.shadow.camera.bottom = -4;
        key.shadow.bias = -0.0004;
        key.shadow.normalBias = 0.025;
        this.scene.add(key);

        const fill = new THREE.DirectionalLight(0xb8d4f0, 0.38);
        fill.position.set(-7, 4, -3);
        this.scene.add(fill);

        const rim = new THREE.DirectionalLight(0xffddb5, 0.30);
        rim.position.set(0, 9, -11);
        this.scene.add(rim);

        const underFill = new THREE.DirectionalLight(0xd4c4a0, 0.12);
        underFill.position.set(0, -2, 4);
        this.scene.add(underFill);

        const handLight = new THREE.PointLight(0xffeacc, 0.35, 7);
        handLight.position.set(0, 1.6, 2.5);
        this.scene.add(handLight);
    }

    // GROUND
    createGround() {
        const groundGeo = new THREE.PlaneGeometry(28, 16);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0xd4c8a0, roughness: 0.95, metalness: 0.0,
            transparent: true, opacity: 0.45
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        this.scene.add(ground);

        const blobGeo = new THREE.PlaneGeometry(1.6, 0.9);
        const blobMat = new THREE.MeshBasicMaterial({
            color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false
        });
        this.leftFootShadow = new THREE.Mesh(blobGeo, blobMat);
        this.leftFootShadow.rotation.x = -Math.PI / 2;
        this.leftFootShadow.position.set(-3.0, 0.005, 0);
        this.scene.add(this.leftFootShadow);

        this.rightFootShadow = new THREE.Mesh(blobGeo, blobMat);
        this.rightFootShadow.rotation.x = -Math.PI / 2;
        this.rightFootShadow.position.set(3.0, 0.005, 0);
        this.scene.add(this.rightFootShadow);

        const aoGeo = new THREE.RingGeometry(0.6, 1.2, 24);
        const aoMat = new THREE.MeshBasicMaterial({
            color: 0x000000, transparent: true, opacity: 0.06,
            side: THREE.DoubleSide, depthWrite: false
        });
        this.leftAO = new THREE.Mesh(aoGeo, aoMat);
        this.leftAO.rotation.x = -Math.PI / 2;
        this.leftAO.position.set(-3.0, 0.003, 0);
        this.scene.add(this.leftAO);

        this.rightAO = new THREE.Mesh(aoGeo, aoMat);
        this.rightAO.rotation.x = -Math.PI / 2;
        this.rightAO.position.set(3.0, 0.003, 0);
        this.scene.add(this.rightAO);
    }

    // ROPE
    createRope() {
        const leftEnd = new THREE.Vector3(-4.2, 1.45, 0);
        const mid = new THREE.Vector3(0, 1.38, 0);
        const rightEnd = new THREE.Vector3(4.2, 1.45, 0);

        const curve = new THREE.CatmullRomCurve3([leftEnd, mid, rightEnd]);
        // Main rope - thicker core
        const ropeGeo = new THREE.TubeGeometry(curve, 80, 0.072, 16, false);
        const ropeMat = new THREE.MeshStandardMaterial({
            color: 0x9b8365, roughness: 0.78, metalness: 0.02,
            emissive: 0x4a3828, emissiveIntensity: 0.04
        });

        this.ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
        this.ropeMesh.castShadow = true;
        this.ropeMesh.receiveShadow = true;
        this.ropeCurve = curve;
        this.ropeCurvePoints = [leftEnd, mid, rightEnd];
        this.scene.add(this.ropeMesh);
        this.rope = this.ropeMesh;

        // Braided helical strands wrapping around the rope
        const strandMat1 = new THREE.MeshStandardMaterial({
            color: 0xa89070, roughness: 0.80, metalness: 0.01
        });
        const strandMat2 = new THREE.MeshStandardMaterial({
            color: 0x7a6040, roughness: 0.82, metalness: 0.01
        });
        const strandMat3 = new THREE.MeshStandardMaterial({
            color: 0x8b7555, roughness: 0.80, metalness: 0.01
        });
        this.ropeStrands = [];
        // 3 helical strands for braided look
        for (let strand = 0; strand < 3; strand++) {
            const strandPoints = [];
            const strandMats = [strandMat1, strandMat2, strandMat3];
            for (let si = 0; si <= 60; si++) {
                const t = si / 60;
                const pt = curve.getPoint(t);
                const angle = t * Math.PI * 16 + strand * (Math.PI * 2 / 3);
                const r = 0.055;
                strandPoints.push(new THREE.Vector3(
                    pt.x + Math.sin(angle) * r * 0.15,
                    pt.y + Math.cos(angle) * r,
                    pt.z + Math.sin(angle) * r
                ));
            }
            const strandCurve = new THREE.CatmullRomCurve3(strandPoints);
            const strandGeo = new THREE.TubeGeometry(strandCurve, 60, 0.018, 6, false);
            const strandMesh = new THREE.Mesh(strandGeo, strandMats[strand]);
            strandMesh.castShadow = true;
            this.scene.add(strandMesh);
            this.ropeStrands.push({ mesh: strandMesh, offset: strand * (Math.PI * 2 / 3) });
        }

        // Fiber texture bumps along rope
        this.ropeTextureDots = [];
        for (let i = 0; i < 45; i++) {
            const t = i / 45;
            const pt = curve.getPoint(t);
            const fiberMat = i % 3 === 0 ? strandMat1 : (i % 3 === 1 ? strandMat2 : strandMat3);
            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.058, 6, 6), fiberMat
            );
            dot.position.copy(pt);
            dot.scale.set(1, 1, 0.12);
            dot.rotation.y = t * Math.PI * 10;
            this.scene.add(dot);
            this.ropeTextureDots.push({ mesh: dot, t: t });
        }

        // Frayed fiber wisps at ends
        for (let end = 0; end < 2; end++) {
            const endPt = end === 0 ? leftEnd : rightEnd;
            const dir = end === 0 ? -1 : 1;
            for (let fw = 0; fw < 6; fw++) {
                const fiber = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.003, 0.001, 0.08 + Math.random() * 0.05, 4),
                    strandMat2
                );
                fiber.position.set(
                    endPt.x + dir * (0.04 + Math.random() * 0.06),
                    endPt.y + (Math.random() - 0.5) * 0.06,
                    endPt.z + (Math.random() - 0.5) * 0.06
                );
                fiber.rotation.set(
                    Math.random() * 0.4 - 0.2,
                    0,
                    dir * (0.3 + Math.random() * 0.5)
                );
                this.scene.add(fiber);
            }
        }

        const markerGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const markerMat = new THREE.MeshStandardMaterial({
            color: 0xff3333, emissive: 0xff1111, emissiveIntensity: 0.25,
            roughness: 0.45, metalness: 0.0
        });
        this.centerMarker = new THREE.Mesh(markerGeo, markerMat);
        this.centerMarker.position.copy(mid);
        this.centerMarker.castShadow = true;
        this.scene.add(this.centerMarker);

        const lineGeo = new THREE.PlaneGeometry(0.04, 1.0);
        const lineMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false
        });
        const centerLine = new THREE.Mesh(lineGeo, lineMat);
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.position.set(0, 0.01, 0);
        this.scene.add(centerLine);

        // Red boundary line on ground below red rope marker
        const redLineGeo = new THREE.PlaneGeometry(0.08, 2.5);
        const redLineMat = new THREE.MeshBasicMaterial({
            color: 0xff0000, transparent: true, opacity: 0.70, depthWrite: false,
            emissive: 0xff0000, emissiveIntensity: 0.3
        });
        this.redBoundaryLine = new THREE.Mesh(redLineGeo, redLineMat);
        this.redBoundaryLine.rotation.x = -Math.PI / 2;
        this.redBoundaryLine.position.set(0, 0.015, 0);
        this.scene.add(this.redBoundaryLine);
    }

    // HELPERS
    _limb(rTop, rBot, len, mat, segs) {
        segs = segs || 12;
        const g = new THREE.CylinderGeometry(rTop, rBot, len, segs);
        const m = new THREE.Mesh(g, mat);
        m.castShadow = true;
        m.receiveShadow = true;
        return m;
    }
    _joint(r, mat, segs) {
        segs = segs || 12;
        const g = new THREE.SphereGeometry(r, segs, segs);
        const m = new THREE.Mesh(g, mat);
        m.castShadow = true;
        return m;
    }

    // CHARACTER CREATION
    createCharacters() {
        this.characterLeft = this._buildHuman('boy', -3.0);
        this.characterLeft.scale.set(1.3, 1.3, 1.3);
        this.scene.add(this.characterLeft);
        this.characterRight = this._buildHuman('girl', 3.0);
        this.characterRight.scale.set(1.3, 1.3, 1.3);
        this.scene.add(this.characterRight);
    }

    // FULLY REALISTIC ARTICULATED HUMAN BUILDER
    _buildHuman(type, xPos) {
        const char = new THREE.Group();
        char.userData.parts = {};
        const isBoy = type === 'boy';
        const facingRight = xPos < 0;

        // MATERIALS
        const skin = new THREE.MeshStandardMaterial({
            color: isBoy ? 0xffc6a3 : 0xffd4b8, roughness: 0.35, metalness: 0.02,
            emissive: isBoy ? 0xffb088 : 0xffc4a0, emissiveIntensity: 0.08
        });
        const skinDark = new THREE.MeshStandardMaterial({
            color: isBoy ? 0xe8a580 : 0xf0b895, roughness: 0.40, metalness: 0.02,
            emissive: isBoy ? 0xd09060 : 0xe0a080, emissiveIntensity: 0.05
        });
        const hairMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0x2c1a0e : 0x5a3825, roughness: 0.75, metalness: 0.05,
            emissive: isBoy ? 0x1a0e06 : 0x3a2415, emissiveIntensity: 0.04
        });
        const hairHighlight = new THREE.MeshStandardMaterial({
            color: isBoy ? 0x4a3020 : 0x7a5240, roughness: 0.65, metalness: 0.08,
            emissive: isBoy ? 0x2a1810 : 0x4a3228, emissiveIntensity: 0.06
        });
        const shirtMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0xd32f2f : 0xf5f5f5, roughness: 0.55, metalness: 0.0
        });
        const shirtDark = new THREE.MeshStandardMaterial({
            color: isBoy ? 0xa52424 : 0xd0d2d6, roughness: 0.60, metalness: 0.0
        });
        const pantsMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0x0d47a1 : 0x283593, roughness: 0.70, metalness: 0.0
        });
        const shoeMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0xd32f2f : 0x283593, roughness: 0.45, metalness: 0.08
        });
        const soleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.9 });
        const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.10, metalness: 0.05 });
        const irisMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0x4e342e : 0x1e88e5, roughness: 0.15, metalness: 0.15
        });
        const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.05 });
        const browMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0x2c1a0e : 0x4a2c1a, roughness: 0.9
        });
        const lipMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0xc06868 : 0xd88888, roughness: 0.28, metalness: 0.03,
            emissive: isBoy ? 0x803030 : 0xa05050, emissiveIntensity: 0.10
        });
        const lipDarkMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0x8a4040 : 0xb06060, roughness: 0.35,
            emissive: isBoy ? 0x602020 : 0x803838, emissiveIntensity: 0.06
        });
        const teethMat = new THREE.MeshStandardMaterial({
            color: 0xf8f8e8, roughness: 0.15, metalness: 0.05,
            emissive: 0xf0f0d0, emissiveIntensity: 0.03
        });
        const gumMat = new THREE.MeshStandardMaterial({
            color: 0xd06080, roughness: 0.45, metalness: 0.0,
            emissive: 0xa04050, emissiveIntensity: 0.08
        });
        const tongueMat = new THREE.MeshStandardMaterial({
            color: 0xcc6070, roughness: 0.50, metalness: 0.0,
            emissive: 0x904050, emissiveIntensity: 0.06
        });
        const nailMat = new THREE.MeshStandardMaterial({
            color: 0xf8d8c8, roughness: 0.20, metalness: 0.08,
            emissive: 0xe0c0a0, emissiveIntensity: 0.04
        });
        const tendonMat = new THREE.MeshStandardMaterial({
            color: isBoy ? 0xe0a080 : 0xeeb8a0, roughness: 0.38, metalness: 0.02,
            emissive: isBoy ? 0xc08060 : 0xd0a088, emissiveIntensity: 0.05
        });

        // === HEAD ===
        const headGroup = new THREE.Group();

        const skull = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), skin);
        skull.scale.set(1, 1.12, 0.98);
        skull.castShadow = true;
        headGroup.add(skull);

        const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.20, 24, 24), skin);
        jaw.scale.set(0.85, 0.50, 0.88);
        jaw.position.set(0, -0.18, 0.08);
        jaw.castShadow = true;
        headGroup.add(jaw);

        [-1, 1].forEach(function(s) {
            var cheek = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), skin);
            cheek.position.set(s * 0.17, -0.04, 0.19);
            cheek.scale.set(1, 0.7, 0.6);
            headGroup.add(cheek);
        });

        [-1, 1].forEach(function(s) {
            var ear = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), skin);
            ear.position.set(s * 0.30, 0.02, -0.02);
            ear.scale.set(0.5, 1, 0.5);
            headGroup.add(ear);
            var inner = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), skinDark);
            inner.position.set(s * 0.29, 0.02, 0.01);
            inner.scale.set(0.4, 0.8, 0.3);
            headGroup.add(inner);
        });

        var noseBridge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.05), skin);
        noseBridge.position.set(0, 0.01, 0.29);
        headGroup.add(noseBridge);
        var noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10), skin);
        noseTip.position.set(0, -0.05, 0.33);
        noseTip.scale.set(1.2, 0.8, 1);
        headGroup.add(noseTip);
        [-1, 1].forEach(function(s) {
            var nostril = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), skinDark);
            nostril.position.set(s * 0.023, -0.07, 0.32);
            headGroup.add(nostril);
        });

        [-1, 1].forEach(function(s) {
            var eyeSocket = new THREE.Group();
            eyeSocket.position.set(s * 0.10, 0.06, 0.23);

            var white = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), eyeWhite);
            white.scale.set(1.1, 0.70, 1);
            eyeSocket.add(white);

            var iris = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), irisMat);
            iris.position.z = 0.032;
            iris.scale.set(1, 0.88, 1);
            eyeSocket.add(iris);

            var pupil2 = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), pupilMat);
            pupil2.position.z = 0.050;
            eyeSocket.add(pupil2);

            var upperLid = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 16), skin);
            upperLid.scale.set(1.15, 0.48, 1.05);
            upperLid.position.set(0, 0.018, 0);
            eyeSocket.add(upperLid);

            var lowerLid = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), skinDark);
            lowerLid.scale.set(1.1, 0.22, 1);
            lowerLid.position.set(0, -0.022, 0.005);
            eyeSocket.add(lowerLid);

            headGroup.add(eyeSocket);
        });

        [-1, 1].forEach(function(s) {
            var browGroup = new THREE.Group();
            var brow = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.026, 0.032), browMat);
            browGroup.add(brow);
            var ridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.014, 0.022), skin);
            ridge.position.y = -0.014;
            browGroup.add(ridge);
            browGroup.position.set(s * 0.10, 0.155, 0.25);
            browGroup.rotation.z = s * -0.38;
            browGroup.rotation.x = -0.12;
            headGroup.add(browGroup);
        });

        for (var wi = 0; wi < 3; wi++) {
            var wrinkle = new THREE.Mesh(
                new THREE.BoxGeometry(0.14, 0.004, 0.008), skinDark
            );
            wrinkle.position.set(0, 0.21 + wi * 0.028, 0.27);
            headGroup.add(wrinkle);
        }

        var mouthGroup = new THREE.Group();
        // Upper lip with Cupid's bow shape
        var upperLipM = new THREE.Mesh(
            new THREE.TorusGeometry(0.052, 0.013, 12, 24, Math.PI), lipMat
        );
        upperLipM.rotation.z = Math.PI;
        upperLipM.position.y = 0.010;
        mouthGroup.add(upperLipM);
        // Cupid's bow center dip
        var cupidBow = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), lipDarkMat);
        cupidBow.position.set(0, 0.018, 0.006);
        cupidBow.scale.set(1.2, 0.5, 0.8);
        mouthGroup.add(cupidBow);
        // Cupid's bow peaks
        [-1, 1].forEach(function(s) {
            var peak = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), lipMat);
            peak.position.set(s * 0.018, 0.020, 0.004);
            mouthGroup.add(peak);
        });
        // Fuller lower lip
        var lowerLipM = new THREE.Mesh(
            new THREE.TorusGeometry(0.046, 0.016, 12, 24, Math.PI), lipMat
        );
        lowerLipM.position.y = -0.010;
        mouthGroup.add(lowerLipM);
        // Lower lip fullness bulge
        var lowerBulge = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), lipMat);
        lowerBulge.position.set(0, -0.014, 0.005);
        lowerBulge.scale.set(1.4, 0.5, 0.6);
        mouthGroup.add(lowerBulge);
        // Lip crease/separation line
        var lipLine = new THREE.Mesh(
            new THREE.BoxGeometry(0.07, 0.003, 0.014), lipDarkMat
        );
        lipLine.position.set(0, 0, 0.006);
        mouthGroup.add(lipLine);
        // Corner creases
        [-1, 1].forEach(function(s) {
            var corner = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 6), lipDarkMat);
            corner.position.set(s * 0.048, -0.002, 0.002);
            mouthGroup.add(corner);
        });
        // Upper teeth row - individual teeth visible
        for (var ti = -3; ti <= 3; ti++) {
            var tooth = new THREE.Mesh(
                new THREE.BoxGeometry(0.008, 0.012, 0.010, 1, 1, 1), teethMat
            );
            tooth.position.set(ti * 0.009, 0.003, 0.010);
            // Slight rounding on front face
            mouthGroup.add(tooth);
        }
        // Lower teeth row
        for (var ti2 = -3; ti2 <= 3; ti2++) {
            var lTooth = new THREE.Mesh(
                new THREE.BoxGeometry(0.007, 0.010, 0.008), teethMat
            );
            lTooth.position.set(ti2 * 0.009, -0.007, 0.010);
            mouthGroup.add(lTooth);
        }
        // Upper gum line
        var upperGum = new THREE.Mesh(
            new THREE.BoxGeometry(0.062, 0.006, 0.012), gumMat
        );
        upperGum.position.set(0, 0.012, 0.008);
        mouthGroup.add(upperGum);
        // Tongue hint inside mouth
        var tongue = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), tongueMat);
        tongue.position.set(0, -0.008, -0.004);
        tongue.scale.set(1.4, 0.5, 1.2);
        mouthGroup.add(tongue);
        // Mouth interior darkness
        var mouthInterior = new THREE.Mesh(
            new THREE.BoxGeometry(0.055, 0.018, 0.010),
            new THREE.MeshStandardMaterial({ color: 0x301818, roughness: 0.9 })
        );
        mouthInterior.position.set(0, -0.001, -0.002);
        mouthGroup.add(mouthInterior);
        mouthGroup.position.set(0, -0.155, 0.26);
        headGroup.add(mouthGroup);

        // Nasolabial folds (smile/strain lines)
        [-1, 1].forEach(function(s) {
            var fold = new THREE.Mesh(
                new THREE.CylinderGeometry(0.005, 0.003, 0.13, 6), skinDark
            );
            fold.position.set(s * 0.07, -0.06, 0.27);
            fold.rotation.z = s * 0.28;
            headGroup.add(fold);
            // Secondary crease line
            var fold2 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.003, 0.002, 0.08, 4), skinDark
            );
            fold2.position.set(s * 0.06, -0.08, 0.265);
            fold2.rotation.z = s * 0.35;
            headGroup.add(fold2);
        });
        // Chin dimple/crease
        var chinDimple = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), skinDark);
        chinDimple.position.set(0, -0.21, 0.22);
        chinDimple.scale.set(1, 0.4, 0.5);
        headGroup.add(chinDimple);

        // === HAIR - highly detailed with strand groups ===
        if (isBoy) {
            // Main hair volume
            var hairTop = new THREE.Mesh(
                new THREE.SphereGeometry(0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55),
                hairMat
            );
            hairTop.position.set(0, 0.15, -0.02);
            hairTop.castShadow = true;
            headGroup.add(hairTop);
            // Highlight layer on top
            var hairTopHL = new THREE.Mesh(
                new THREE.SphereGeometry(0.33, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.38),
                hairHighlight
            );
            hairTopHL.position.set(0, 0.18, 0.02);
            headGroup.add(hairTopHL);
            // Side volume with layers
            [-1, 1].forEach(function(s) {
                var side = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), hairMat);
                side.position.set(s * 0.23, 0.10, -0.06);
                side.scale.set(0.85, 1.15, 0.75);
                headGroup.add(side);
                // Sideburn detail
                var sideburn = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.02), hairMat);
                sideburn.position.set(s * 0.27, -0.06, 0.06);
                headGroup.add(sideburn);
            });
            // Textured fringe bangs with individual strands
            for (var bi = -3; bi <= 3; bi++) {
                var bang = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12),
                    bi % 2 === 0 ? hairMat : hairHighlight);
                bang.position.set(bi * 0.052, 0.19, 0.22);
                bang.scale.set(1.1, 0.8, 0.5);
                headGroup.add(bang);
            }
            // Strand groups on top for texture
            for (var si = 0; si < 8; si++) {
                var strandAngle = (si / 8) * Math.PI * 2;
                var strand = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.015, 0.008, 0.14, 6),
                    si % 2 === 0 ? hairMat : hairHighlight
                );
                strand.position.set(
                    Math.sin(strandAngle) * 0.18,
                    0.28,
                    Math.cos(strandAngle) * 0.12 - 0.04
                );
                strand.rotation.z = Math.sin(strandAngle) * 0.4;
                strand.rotation.x = Math.cos(strandAngle) * 0.3;
                headGroup.add(strand);
            }
            // Flyaway effort strands
            for (var fi2 = 0; fi2 < 5; fi2++) {
                var flyaway = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.004, 0.002, 0.10 + Math.random() * 0.06, 4),
                    hairHighlight
                );
                flyaway.position.set(
                    (Math.random() - 0.5) * 0.30,
                    0.30 + Math.random() * 0.06,
                    (Math.random() - 0.5) * 0.14
                );
                flyaway.rotation.set(Math.random() * 0.6, 0, Math.random() * 0.8 - 0.4);
                headGroup.add(flyaway);
            }
        } else {
            // Girl: fuller voluminous hair
            var hairTopG = new THREE.Mesh(
                new THREE.SphereGeometry(0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6),
                hairMat
            );
            hairTopG.position.set(0, 0.13, -0.02);
            hairTopG.castShadow = true;
            headGroup.add(hairTopG);
            // Highlight sheen layer
            var hairTopGHL = new THREE.Mesh(
                new THREE.SphereGeometry(0.34, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.42),
                hairHighlight
            );
            hairTopGHL.position.set(0, 0.16, 0.02);
            headGroup.add(hairTopGHL);

            var self = this;
            // Side curtains with layered strands
            [-1, 1].forEach(function(s) {
                var curtain = self._limb(0.11, 0.06, 0.52, hairMat);
                curtain.position.set(s * 0.26, -0.10, -0.02);
                curtain.rotation.z = s * 0.12;
                headGroup.add(curtain);
                // Layered strand over curtain
                var curtainHL = self._limb(0.08, 0.04, 0.46, hairHighlight);
                curtainHL.position.set(s * 0.24, -0.08, 0.02);
                curtainHL.rotation.z = s * 0.14;
                headGroup.add(curtainHL);
                // Individual strand wisps
                for (var ws = 0; ws < 3; ws++) {
                    var wisp = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.006, 0.003, 0.16 + ws * 0.04, 4),
                        ws % 2 === 0 ? hairMat : hairHighlight
                    );
                    wisp.position.set(s * (0.22 + ws * 0.03), -0.14 - ws * 0.06, 0.04);
                    wisp.rotation.z = s * (0.10 + ws * 0.05);
                    headGroup.add(wisp);
                }
            });

            // Ponytail with more segments
            var ptBase = this._limb(0.11, 0.09, 0.26, hairMat);
            ptBase.position.set(0, -0.02, -0.31);
            ptBase.rotation.x = 0.4;
            headGroup.add(ptBase);
            var ptBaseHL = this._limb(0.08, 0.06, 0.22, hairHighlight);
            ptBaseHL.position.set(0, -0.02, -0.30);
            ptBaseHL.rotation.x = 0.4;
            headGroup.add(ptBaseHL);
            var ptMid = this._limb(0.09, 0.07, 0.26, hairMat);
            ptMid.position.set(0, -0.20, -0.44);
            ptMid.rotation.x = 0.6;
            headGroup.add(ptMid);
            var ptMidHL = this._limb(0.06, 0.04, 0.22, hairHighlight);
            ptMidHL.position.set(0.02, -0.20, -0.43);
            ptMidHL.rotation.x = 0.6;
            headGroup.add(ptMidHL);
            var ptTipH = this._joint(0.060, hairMat);
            ptTipH.position.set(0, -0.38, -0.56);
            headGroup.add(ptTipH);
            // Ponytail strand details
            for (var ps = 0; ps < 4; ps++) {
                var ptStrand = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.008, 0.004, 0.20, 4),
                    ps % 2 === 0 ? hairMat : hairHighlight
                );
                var psAngle = (ps / 4) * Math.PI * 2;
                ptStrand.position.set(
                    Math.sin(psAngle) * 0.04,
                    -0.28,
                    -0.48 + Math.cos(psAngle) * 0.03
                );
                ptStrand.rotation.x = 0.5;
                headGroup.add(ptStrand);
            }
            // Flyaway effort strands from ponytail
            for (var fg = 0; fg < 4; fg++) {
                var flyG = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.004, 0.002, 0.08 + Math.random() * 0.05, 4),
                    hairHighlight
                );
                flyG.position.set(
                    (Math.random() - 0.5) * 0.16,
                    -0.10 - Math.random() * 0.20,
                    -0.34 - Math.random() * 0.10
                );
                flyG.rotation.set(Math.random() * 0.5 - 0.25, 0, Math.random() * 0.6 - 0.3);
                headGroup.add(flyG);
            }

            // Bow - more detailed with ribbon folds
            var bowMat = new THREE.MeshStandardMaterial({
                color: 0xe53935, roughness: 0.30, metalness: 0.05,
                emissive: 0xaa2020, emissiveIntensity: 0.08
            });
            [-1, 1].forEach(function(s) {
                var wing = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 12), bowMat);
                wing.position.set(s * 0.058, 0.06, -0.29);
                wing.scale.set(1.5, 0.75, 0.55);
                headGroup.add(wing);
                // Ribbon fold detail
                var ribbonFold = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.01), bowMat);
                ribbonFold.position.set(s * 0.07, 0.05, -0.29);
                ribbonFold.rotation.z = s * 0.3;
                headGroup.add(ribbonFold);
            });
            var knotH = this._joint(0.024, bowMat);
            knotH.position.set(0, 0.06, -0.29);
            headGroup.add(knotH);
            // Ribbon tails hanging down
            [-1, 1].forEach(function(s) {
                var tail = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.012, 0.006, 0.10, 6), bowMat
                );
                tail.position.set(s * 0.03, 0.01, -0.30);
                tail.rotation.z = s * 0.25;
                headGroup.add(tail);
            });
        }

        headGroup.position.set(0, 2.05, 0);
        headGroup.rotation.x = 0.18;
        char.add(headGroup);
        char.userData.parts.head = headGroup;

        // === NECK with strain tendons ===
        var neckGroup = new THREE.Group();
        var neckMain = this._limb(0.08, 0.10, 0.15, skin);
        neckGroup.add(neckMain);
        var selfRef = this;
        [-1, 1].forEach(function(s) {
            var tendon = new THREE.Mesh(
                new THREE.CylinderGeometry(0.010, 0.007, 0.16, 6), skinDark
            );
            tendon.position.set(s * 0.045, 0, 0.04);
            neckGroup.add(tendon);
        });
        neckGroup.position.set(0, 1.82, 0);
        char.add(neckGroup);
        char.userData.parts.neck = neckGroup;

        // === TORSO with muscle definition ===
        var torsoGroup = new THREE.Group();

        var chest = new THREE.Mesh(
            new THREE.CylinderGeometry(0.30, 0.34, 0.52, 16), shirtMat
        );
        chest.position.set(0, 0.26, 0);
        chest.castShadow = true;
        chest.receiveShadow = true;
        torsoGroup.add(chest);

        [-1, 1].forEach(function(s) {
            var deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), shirtMat);
            deltoid.position.set(s * 0.34, 0.38, 0);
            deltoid.scale.set(1, 0.8, 0.9);
            deltoid.castShadow = true;
            torsoGroup.add(deltoid);
        });

        [-1, 1].forEach(function(s) {
            for (var si = 0; si < 3; si++) {
                var wrk = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.003, 0.003, 0.07, 4), shirtDark
                );
                wrk.position.set(s * 0.22, 0.30 - si * 0.07, 0.14);
                wrk.rotation.z = s * 0.4 + si * 0.15;
                torsoGroup.add(wrk);
            }
        });
        for (var ci = 0; ci < 2; ci++) {
            var cw = new THREE.Mesh(
                new THREE.CylinderGeometry(0.003, 0.003, 0.12, 4), shirtDark
            );
            cw.position.set(0, 0.20 - ci * 0.10, 0.18);
            cw.rotation.z = Math.PI / 2;
            torsoGroup.add(cw);
        }

        var belly = this._limb(0.34, 0.30, 0.28, shirtMat);
        belly.position.set(0, -0.08, 0);
        torsoGroup.add(belly);

        var hips = new THREE.Mesh(new THREE.SphereGeometry(0.30, 16, 16), pantsMat);
        hips.scale.set(1.1, 0.55, 0.85);
        hips.position.set(0, -0.28, 0);
        hips.castShadow = true;
        torsoGroup.add(hips);

        var beltMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.6, metalness: 0.1 });
        var belt = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.02, 8, 24), beltMat);
        belt.position.set(0, -0.15, 0);
        belt.rotation.x = Math.PI / 2;
        belt.scale.set(1, 1, 0.85);
        torsoGroup.add(belt);
        var buckle = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.04, 0.02),
            new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.7 })
        );
        buckle.position.set(0, -0.15, 0.26);
        torsoGroup.add(buckle);

        if (!isBoy) {
            var skirtMat2 = new THREE.MeshStandardMaterial({ color: 0x283593, roughness: 0.65 });
            var skirt = new THREE.Mesh(new THREE.ConeGeometry(0.40, 0.38, 24), skirtMat2);
            skirt.position.set(0, -0.42, 0);
            skirt.rotation.x = Math.PI;
            skirt.castShadow = true;
            torsoGroup.add(skirt);
            for (var fi = 0; fi < 8; fi++) {
                var angle = (fi / 8) * Math.PI * 2;
                var foldS = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.004, 0.004, 0.34, 4),
                    new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.7 })
                );
                foldS.position.set(Math.sin(angle) * 0.30, -0.40, Math.cos(angle) * 0.30);
                foldS.rotation.x = Math.PI + Math.sin(angle) * 0.12;
                torsoGroup.add(foldS);
            }
            var vestMat = new THREE.MeshStandardMaterial({ color: 0x42a5f5, roughness: 0.65 });
            var vest = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.44, 0.12), vestMat);
            vest.position.set(0, 0.14, -0.24);
            vest.castShadow = true;
            torsoGroup.add(vest);
        }

        if (isBoy) {
            var bpMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.85 });
            var bp = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.18), bpMat);
            bp.position.set(0, 0.12, -0.28);
            bp.castShadow = true;
            torsoGroup.add(bp);
            [-1, 1].forEach(function(s) {
                var strap = selfRef._limb(0.025, 0.025, 0.50, bpMat);
                strap.position.set(s * 0.14, 0.28, -0.16);
                strap.rotation.x = -0.12;
                torsoGroup.add(strap);
            });
            var pocket = new THREE.Mesh(
                new THREE.BoxGeometry(0.20, 0.14, 0.04),
                new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 })
            );
            pocket.position.set(0, -0.06, -0.37);
            torsoGroup.add(pocket);
        }

        torsoGroup.position.set(0, 1.26, 0);
        char.add(torsoGroup);
        char.userData.parts.body = torsoGroup;

        // === ARMS ===
        var buildArm = function(side) {
            var s = side === 'left' ? -1 : 1;
            var armGroup = new THREE.Group();

            var shoulderBall = selfRef._joint(0.11, shirtMat);
            armGroup.add(shoulderBall);

            var upperArm = selfRef._limb(0.084, 0.068, 0.36, shirtMat);
            upperArm.position.set(0, -0.22, 0);
            armGroup.add(upperArm);

            var bicep = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 10), shirtMat);
            bicep.position.set(0, -0.14, 0.04);
            bicep.scale.set(1, 1.4, 1);
            armGroup.add(bicep);

            var elbow = selfRef._joint(0.058, skin);
            elbow.position.set(0, -0.40, 0);
            armGroup.add(elbow);

            var forearm = selfRef._limb(0.060, 0.046, 0.32, skin);
            forearm.position.set(0, -0.58, 0);
            armGroup.add(forearm);

            var flexor = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), skin);
            flexor.position.set(0, -0.48, 0.03);
            flexor.scale.set(0.9, 1.5, 0.8);
            armGroup.add(flexor);

            var vein = new THREE.Mesh(
                new THREE.CylinderGeometry(0.005, 0.004, 0.18, 4), skinDark
            );
            vein.position.set(0.02, -0.52, 0.03);
            vein.rotation.z = 0.1;
            armGroup.add(vein);

            var wrist = selfRef._joint(0.040, skin, 8);
            wrist.position.set(0, -0.75, 0);
            armGroup.add(wrist);

            // HAND - highly detailed with realistic grip
            var handGroup = new THREE.Group();
            // Wider, more anatomical palm
            var palm = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.040, 0.095), skin);
            palm.castShadow = true;
            handGroup.add(palm);
            // Palm pad (thenar eminence - thumb side)
            var thenar = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), skin);
            thenar.position.set(s * 0.028, -0.005, -0.020);
            thenar.scale.set(1, 0.6, 1.3);
            handGroup.add(thenar);
            // Hypothenar pad (pinky side)
            var hypothenar = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), skin);
            hypothenar.position.set(-s * 0.025, -0.005, -0.010);
            hypothenar.scale.set(1, 0.5, 1.2);
            handGroup.add(hypothenar);
            // Back of hand tendons
            for (var ht = 0; ht < 4; ht++) {
                var handTendon = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.004, 0.003, 0.06, 4), tendonMat
                );
                handTendon.position.set(-0.028 + ht * 0.019, 0.016, 0.010);
                handTendon.rotation.x = -0.15;
                handGroup.add(handTendon);
            }
            // Palm creases
            var palmCrease1 = new THREE.Mesh(
                new THREE.BoxGeometry(0.06, 0.002, 0.003), skinDark
            );
            palmCrease1.position.set(0, -0.018, 0.015);
            handGroup.add(palmCrease1);
            var palmCrease2 = new THREE.Mesh(
                new THREE.BoxGeometry(0.055, 0.002, 0.003), skinDark
            );
            palmCrease2.position.set(0.005, -0.018, -0.005);
            palmCrease2.rotation.y = 0.3;
            handGroup.add(palmCrease2);

            // Realistic 4 fingers with joints, creases, nails
            var fingerLengths = [0.036, 0.042, 0.040, 0.034];
            var fingerRadii = [0.012, 0.013, 0.012, 0.011];
            for (var fi = 0; fi < 4; fi++) {
                var fingerGroup = new THREE.Group();
                var fLen = fingerLengths[fi];
                var fRad = fingerRadii[fi];
                // Proximal phalanx
                var seg1 = new THREE.Mesh(
                    new THREE.CylinderGeometry(fRad, fRad * 0.92, fLen, 8), skin
                );
                seg1.position.y = -fLen * 0.5;
                fingerGroup.add(seg1);
                // Joint crease ring 1
                var jc1 = new THREE.Mesh(
                    new THREE.TorusGeometry(fRad * 0.95, 0.002, 4, 8), skinDark
                );
                jc1.position.set(0, -fLen, 0);
                jc1.rotation.x = Math.PI / 2;
                fingerGroup.add(jc1);
                // Middle phalanx
                var seg2 = new THREE.Mesh(
                    new THREE.CylinderGeometry(fRad * 0.92, fRad * 0.85, fLen * 0.80, 8), skin
                );
                seg2.position.set(0, -fLen * 1.1, fLen * 0.35);
                seg2.rotation.x = 0.9;
                fingerGroup.add(seg2);
                // Joint crease ring 2
                var jc2 = new THREE.Mesh(
                    new THREE.TorusGeometry(fRad * 0.88, 0.002, 4, 8), skinDark
                );
                jc2.position.set(0, -fLen * 1.35, fLen * 0.60);
                jc2.rotation.x = Math.PI / 2 + 0.9;
                fingerGroup.add(jc2);
                // Distal phalanx
                var seg3 = new THREE.Mesh(
                    new THREE.CylinderGeometry(fRad * 0.85, fRad * 0.75, fLen * 0.60, 8), skin
                );
                seg3.position.set(0, -fLen * 1.42, fLen * 0.82);
                seg3.rotation.x = 1.4;
                fingerGroup.add(seg3);
                // Fingertip pad
                var fpad = new THREE.Mesh(new THREE.SphereGeometry(fRad * 0.80, 6, 6), skin);
                fpad.position.set(0, -fLen * 1.55, fLen * 1.10);
                fpad.scale.set(1, 0.6, 0.8);
                fingerGroup.add(fpad);
                // Fingernail
                var nail = new THREE.Mesh(
                    new THREE.BoxGeometry(fRad * 1.6, 0.004, fRad * 1.2), nailMat
                );
                nail.position.set(0, -fLen * 1.50, fLen * 1.15);
                nail.rotation.x = 1.6;
                fingerGroup.add(nail);
                fingerGroup.position.set(-0.032 + fi * 0.021, -0.020, 0.036);
                fingerGroup.rotation.x = -0.3;
                handGroup.add(fingerGroup);
            }

            // Thumb with realistic 2-segment + nail
            var thumbGroup = new THREE.Group();
            var t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.014, 0.038, 8), skin);
            t1.position.y = -0.019;
            thumbGroup.add(t1);
            // Thumb joint crease
            var tjc = new THREE.Mesh(
                new THREE.TorusGeometry(0.014, 0.002, 4, 8), skinDark
            );
            tjc.position.set(0, -0.036, 0);
            tjc.rotation.x = Math.PI / 2;
            thumbGroup.add(tjc);
            var t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.032, 8), skin);
            t2.position.set(0, -0.038, -0.012);
            t2.rotation.x = -0.7;
            thumbGroup.add(t2);
            // Thumb pad
            var thumbPad = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), skin);
            thumbPad.position.set(0, -0.052, -0.022);
            thumbPad.scale.set(1, 0.7, 1);
            thumbGroup.add(thumbPad);
            // Thumb nail
            var thumbNail = new THREE.Mesh(
                new THREE.BoxGeometry(0.018, 0.004, 0.014), nailMat
            );
            thumbNail.position.set(0, -0.048, -0.026);
            thumbNail.rotation.x = -0.8;
            thumbGroup.add(thumbNail);
            thumbGroup.position.set(s * 0.042, -0.010, -0.032);
            thumbGroup.rotation.x = 0.4;
            thumbGroup.rotation.z = s * -0.5;
            handGroup.add(thumbGroup);

            // Prominent knuckles with wrinkles
            for (var ki = 0; ki < 4; ki++) {
                var kn = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 8), skin);
                kn.position.set(-0.032 + ki * 0.021, -0.008, 0.036);
                handGroup.add(kn);
                // Knuckle wrinkle lines
                var kwrinkle = new THREE.Mesh(
                    new THREE.BoxGeometry(0.016, 0.002, 0.003), skinDark
                );
                kwrinkle.position.set(-0.032 + ki * 0.021, -0.002, 0.036);
                handGroup.add(kwrinkle);
            }
            // Wrist bone bump (ulna)
            var wristBump = new THREE.Mesh(new THREE.SphereGeometry(0.010, 6, 6), skin);
            wristBump.position.set(s * 0.030, 0.012, 0);
            handGroup.add(wristBump);

            handGroup.position.set(0, -0.82, 0);
            armGroup.add(handGroup);
            armGroup.userData.hand = handGroup;

            armGroup.position.set(s * 0.38, 1.68, 0);
            armGroup.rotation.x = -0.80;
            armGroup.rotation.z = s * -0.30;
            char.add(armGroup);
            return armGroup;
        };

        char.userData.parts.leftArm = buildArm('left');
        char.userData.parts.rightArm = buildArm('right');

        // === LEGS - asymmetric tug-of-war stance ===
        var buildLeg = function(side, isFront) {
            var s = side === 'left' ? -1 : 1;
            var legGroup = new THREE.Group();

            var thigh = selfRef._limb(0.13, 0.10, 0.42, pantsMat);
            thigh.position.set(0, -0.21, 0);
            legGroup.add(thigh);

            var quad = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), pantsMat);
            quad.position.set(0, -0.14, 0.06);
            quad.scale.set(0.8, 1.5, 0.7);
            legGroup.add(quad);

            var knee = selfRef._joint(0.088, pantsMat, 10);
            knee.position.set(0, -0.44, 0);
            legGroup.add(knee);

            var shin = selfRef._limb(0.085, 0.062, 0.40, pantsMat);
            shin.position.set(0, -0.66, 0);
            legGroup.add(shin);

            var calfMuscle = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10), pantsMat);
            calfMuscle.position.set(0, -0.58, -0.04);
            calfMuscle.scale.set(0.8, 1.6, 0.9);
            legGroup.add(calfMuscle);

            var ankle = selfRef._joint(0.052, skin, 8);
            ankle.position.set(0, -0.86, 0);
            legGroup.add(ankle);

            var shoeGroup = new THREE.Group();
            var shoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.26), shoeMat);
            shoeBody.castShadow = true;
            shoeGroup.add(shoeBody);
            var toeCap = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), shoeMat);
            toeCap.position.set(0, -0.01, 0.10);
            toeCap.scale.set(1, 0.6, 0.8);
            shoeGroup.add(toeCap);
            var sole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.28), soleMat);
            sole.position.y = -0.05;
            shoeGroup.add(sole);
            var heel = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, 0.08), soleMat);
            heel.position.set(0, -0.04, -0.10);
            shoeGroup.add(heel);
            for (var li = 0; li < 3; li++) {
                var lace = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.003, 0.003, 0.09, 4),
                    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
                );
                lace.rotation.z = Math.PI / 2;
                lace.position.set(0, 0.02, -0.04 + li * 0.055);
                shoeGroup.add(lace);
            }
            shoeGroup.position.set(0, -0.92, 0.04);
            legGroup.add(shoeGroup);

            var frictionMark = new THREE.Mesh(
                new THREE.PlaneGeometry(0.16, 0.06),
                new THREE.MeshBasicMaterial({
                    color: 0x8b7355, transparent: true, opacity: 0.12, depthWrite: false
                })
            );
            frictionMark.rotation.x = -Math.PI / 2;
            frictionMark.position.set(0, -0.97, 0.04);
            legGroup.add(frictionMark);

            legGroup.position.set(s * 0.17, 0.98, 0);
            if (isFront) {
                legGroup.rotation.x = 0.30;
                shin.rotation.x = 0.50;
            } else {
                legGroup.rotation.x = -0.40;
                shin.rotation.x = 0.12;
            }
            legGroup.rotation.z = s * 0.05;
            char.add(legGroup);
            return legGroup;
        };

        if (facingRight) {
            char.userData.parts.leftLeg = buildLeg('left', true);
            char.userData.parts.rightLeg = buildLeg('right', false);
        } else {
            char.userData.parts.leftLeg = buildLeg('left', false);
            char.userData.parts.rightLeg = buildLeg('right', true);
        }

        // FINAL POSE - face each other front-to-front
        char.rotation.order = 'YXZ';
        char.position.set(xPos, -0.08, 0);
        if (facingRight) {
            char.rotation.y = Math.PI / 2;
            char.rotation.x = -0.22;
        } else {
            char.rotation.y = -Math.PI / 2;
            char.rotation.x = -0.22;
        }

        return char;
    }

    // ANIMATION LOOP
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        var time = Date.now() * 0.001;

        // Characters remain completely still (no breathing animation)

        // Handle snap-back animation
        this._updateSnapBack();

        // Lifted character gentle sway
        if (this.isDragging && this.draggedCharacter) {
            var dragObj = this.draggedCharacter.obj;
            dragObj.rotation.x += Math.sin(time * 3) * 0.001;
            // Scale pulse "picked up" effect
            var pulse = 1.3 + Math.sin(time * 4) * 0.02;
            dragObj.scale.set(pulse, pulse, pulse);
        }

        this.updatePhysics();
        this.renderer.render(this.scene, this.camera);
    }

    isDraggingChar(key) {
        return this.isDragging && this.draggedCharacter && this.draggedCharacter.key === key;
    }

    _updateSnapBack() {
        var chars = { left: this.characterLeft, right: this.characterRight };
        var shadows = { left: this.leftFootShadow, right: this.rightFootShadow };
        var aos = { left: this.leftAO, right: this.rightAO };

        for (var key in chars) {
            if (!this.isSnappingBack[key] || !chars[key] || !this.snapTargets[key]) continue;

            var obj = chars[key];
            var target = this.snapTargets[key];
            var speed = this.snapBackSpeed;

            // Lerp toward target
            obj.position.x += (target.x - obj.position.x) * speed;
            obj.position.y += (target.y - obj.position.y) * speed;
            obj.position.z += (target.z - obj.position.z) * speed;
            obj.rotation.z += (0 - obj.rotation.z) * speed;

            // Restore scale
            obj.scale.x += (1.3 - obj.scale.x) * speed;
            obj.scale.y += (1.3 - obj.scale.y) * speed;
            obj.scale.z += (1.3 - obj.scale.z) * speed;

            // Track shadow
            if (shadows[key]) shadows[key].position.x = obj.position.x;
            if (aos[key]) aos[key].position.x = obj.position.x;

            // Check if close enough to finish
            var dist = obj.position.distanceTo(target);
            if (dist < 0.02) {
                obj.position.copy(target);
                obj.rotation.z = 0;
                obj.scale.set(1.3, 1.3, 1.3);
                this.isSnappingBack[key] = false;
                this.snapTargets[key] = null;
            }
        }
    }

    // SPRING PHYSICS
    updatePhysics() {
        if (this.gameOver) return;

        var forceDifference = this.teamAStrength - this.teamBStrength;
        // Reduced force factor for more gradual movement
        this.ropeTarget += forceDifference * 0.0005;

        var force = (this.ropeTarget - this.ropePosition) * this.springStrength;
        this.velocity += force;
        this.velocity *= this.damping;
        this.ropePosition += this.velocity;

        this.ropePosition = Math.max(-this.maxPullDistance, Math.min(this.maxPullDistance, this.ropePosition));
        this.ropeTarget = Math.max(-this.maxPullDistance, Math.min(this.maxPullDistance, this.ropeTarget));

        this.updateRopeCurve();
        this.updateCharacters();
        this.checkWinner();
    }

    // ROPE CURVE - dynamic sag & tension
    updateRopeCurve() {
        if (!this.ropeCurvePoints || !this.ropeMesh) return;

        // Entire rope shifts smoothly toward winning side
        var leftX = -4.2 + this.ropePosition;
        var centerX = this.ropePosition;
        var rightX = 4.2 + this.ropePosition;

        var tension = Math.abs(this.velocity) * 3 + 0.3;
        var sagAmount = Math.max(0.015, 0.15 - tension * 0.035 + Math.abs(this.ropePosition) * 0.06);
        var centerY = 1.38 - sagAmount;

        this.ropeCurvePoints[0].set(leftX, 1.45, 0);
        this.ropeCurvePoints[1].set(centerX, centerY, 0);
        this.ropeCurvePoints[2].set(rightX, 1.45, 0);

        // Store rope endpoint positions for hand attachment
        this.ropeLeftEndX = leftX;
        this.ropeRightEndX = rightX;
        this.ropeEndY = 1.45;

        var curve = new THREE.CatmullRomCurve3(this.ropeCurvePoints);
        var newGeo = new THREE.TubeGeometry(curve, 80, 0.072, 16, false);
        this.ropeMesh.geometry.dispose();
        this.ropeMesh.geometry = newGeo;

        // Update braided helical strands
        if (this.ropeStrands) {
            for (var si = 0; si < this.ropeStrands.length; si++) {
                var strandData = this.ropeStrands[si];
                var strandPoints = [];
                for (var sj = 0; sj <= 60; sj++) {
                    var t2 = sj / 60;
                    var pt2 = curve.getPoint(t2);
                    var angle = t2 * Math.PI * 16 + strandData.offset;
                    var r = 0.055;
                    strandPoints.push(new THREE.Vector3(
                        pt2.x + Math.sin(angle) * r * 0.15,
                        pt2.y + Math.cos(angle) * r,
                        pt2.z + Math.sin(angle) * r
                    ));
                }
                var strandCurve = new THREE.CatmullRomCurve3(strandPoints);
                var strandGeo = new THREE.TubeGeometry(strandCurve, 60, 0.018, 6, false);
                strandData.mesh.geometry.dispose();
                strandData.mesh.geometry = strandGeo;
            }
        }

        // Update rope texture dots
        if (this.ropeTextureDots) {
            for (var i = 0; i < this.ropeTextureDots.length; i++) {
                var d = this.ropeTextureDots[i];
                var pt = curve.getPoint(d.t);
                d.mesh.position.copy(pt);
            }
        }

        if (this.centerMarker) {
            this.centerMarker.position.set(centerX, centerY, 0);
        }
    }

    // CHARACTER POSITION + LEAN + ANIMATION
    updateCharacters() {
        if (!this.characterLeft || !this.characterRight) return;
        var t = Date.now() * 0.001;
        var vel = Math.abs(this.velocity);

        // Characters stay at fixed positions - only show effort animations
        if (!this.isDraggingChar('left') && !this.isSnappingBack.left) {
            // Left character stays completely still at starting position
            this.characterLeft.position.x = -3.0;
            this.characterLeft.position.y = -0.08;
            this.characterLeft.position.z = 0;
            this.characterLeft.rotation.x = -0.22; // Fixed lean angle
            if (this.leftFootShadow) this.leftFootShadow.position.x = this.characterLeft.position.x;
            if (this.leftAO) this.leftAO.position.x = this.characterLeft.position.x;
            // Update snap target to current physics position
            this.originalPositions['left'] = this.characterLeft.position.clone();
        }

        if (!this.isDraggingChar('right') && !this.isSnappingBack.right) {
            // Right character stays completely still at starting position
            this.characterRight.position.x = 3.0;
            this.characterRight.position.y = -0.08;
            this.characterRight.position.z = 0;
            this.characterRight.rotation.x = -0.22; // Fixed lean angle
            if (this.rightFootShadow) this.rightFootShadow.position.x = this.characterRight.position.x;
            if (this.rightAO) this.rightAO.position.x = this.characterRight.position.x;
            this.originalPositions['right'] = this.characterRight.position.clone();
        }

        // Always update parts animation
        if (!this.isDraggingChar('left')) this.updateCharacterParts(this.characterLeft, 'left');
        if (!this.isDraggingChar('right')) this.updateCharacterParts(this.characterRight, 'right');
    }

    // ARTICULATED ANIMATION
    updateCharacterParts(character, side) {
        if (!character || !character.userData || !character.userData.parts) return;
        var p = character.userData.parts;
        var t = Date.now() * 0.001;
        var vel = Math.abs(this.velocity);
        var pull = this.ropePosition * (side === 'left' ? 1 : -1);

        // Update both arms to grip rope
        var charX = character.position.x;
        var charY = character.position.y;
        
        if (side === 'left' && this.ropeLeftEndX !== undefined) {
            // Left character - both arms grip left rope end
            var ropeRelativeX = this.ropeLeftEndX - charX;
            var ropeRelativeY = this.ropeEndY - charY - 1.68; // subtract arm base Y
            
            if (p.leftArm) {
                // Left arm reaches forward to rope
                p.leftArm.position.x = ropeRelativeX + 0.6; // further reach
                p.leftArm.rotation.x = -0.70 + pull * 0.05 + Math.sin(t * 14) * vel * 0.03;
                p.leftArm.rotation.y = 0.1;
                p.leftArm.rotation.z = -0.10 + Math.sin(t * 3.2) * 0.01;
            }
            if (p.rightArm) {
                // Right arm also reaches forward to rope (behind left)
                p.rightArm.position.x = ropeRelativeX + 0.4; // slightly closer grip
                p.rightArm.rotation.x = -0.75 + pull * 0.05 + Math.sin(t * 14 + 1.5) * vel * 0.03;
                p.rightArm.rotation.y = -0.1;
                p.rightArm.rotation.z = 0.10 - Math.sin(t * 3.2) * 0.01;
            }
        } else if (side === 'right' && this.ropeRightEndX !== undefined) {
            // Right character - both arms grip right rope end
            var ropeRelativeX2 = this.ropeRightEndX - charX;
            var ropeRelativeY2 = this.ropeEndY - charY - 1.68;
            
            if (p.leftArm) {
                // Left arm reaches forward to rope (behind right)
                p.leftArm.position.x = ropeRelativeX2 - 0.4; // slightly closer grip
                p.leftArm.rotation.x = -0.75 + pull * 0.05 + Math.sin(t * 14) * vel * 0.03;
                p.leftArm.rotation.y = 0.1;
                p.leftArm.rotation.z = -0.10 + Math.sin(t * 3.2) * 0.01;
            }
            if (p.rightArm) {
                // Right arm reaches forward to rope
                p.rightArm.position.x = ropeRelativeX2 - 0.6; // further reach
                p.rightArm.rotation.x = -0.70 + pull * 0.05 + Math.sin(t * 14 + 1.5) * vel * 0.03;
                p.rightArm.rotation.y = -0.1;
                p.rightArm.rotation.z = 0.10 - Math.sin(t * 3.2) * 0.01;
            }
        } else {
            // Default arm positions if rope not yet initialized
            if (p.leftArm) {
                p.leftArm.rotation.x = -0.80 + pull * 0.05 + Math.sin(t * 14) * vel * 0.04;
                p.leftArm.rotation.y = Math.sin(t * 12) * vel * 0.03;
                p.leftArm.rotation.z = -0.30 + Math.sin(t * 3.2) * 0.015;
            }
            if (p.rightArm) {
                p.rightArm.rotation.x = -0.80 + pull * 0.05 + Math.sin(t * 14 + 1.5) * vel * 0.04;
                p.rightArm.rotation.y = Math.sin(t * 12 + 1.5) * vel * 0.03;
                p.rightArm.rotation.z = 0.30 - Math.sin(t * 3.2) * 0.015;
            }
        }

        if (p.head) {
            p.head.rotation.x = Math.sin(t * 2.5) * vel * 0.035 + pull * 0.02;
            p.head.rotation.z = Math.sin(t * 1.6) * 0.018;
        }

        if (p.neck) {
            p.neck.rotation.x = Math.sin(t * 3.0) * vel * 0.02;
            p.neck.rotation.z = Math.sin(t * 2.0) * 0.01;
        }

        if (p.body) {
            var breathScale = 1 + Math.sin(t * 1.8) * 0.008;
            p.body.scale.set(breathScale, 1, breathScale);
            p.body.rotation.y = Math.sin(t * 2.2) * vel * 0.02;
            p.body.rotation.x = Math.sin(t * 3.5) * vel * 0.008;
        }

        if (p.leftLeg) {
            var baseL = side === 'left' ? 0.30 : -0.40;
            p.leftLeg.rotation.x = baseL - Math.sin(t * 2.6) * 0.05;
        }
        if (p.rightLeg) {
            var baseR = side === 'left' ? -0.40 : 0.30;
            p.rightLeg.rotation.x = baseR - Math.sin(t * 2.6 + Math.PI) * 0.04;
        }
    }

    // GAME LOGIC
    checkWinner() {
        if (this.ropePosition >= this.maxPullDistance) {
            this.gameOver = true;
            this.winnerTeam = 'B';
            this.announceWinner('B');
        }
        if (this.ropePosition <= -this.maxPullDistance) {
            this.gameOver = true;
            this.winnerTeam = 'A';
            this.announceWinner('A');
        }
    }
    announceWinner(team) {
        console.log('GAME OVER! Team ' + team + ' wins!');
        setTimeout(function() { alert('TEAM ' + team + ' WINS THE TUG-OF-WAR!'); }, 500);
    }
    setTeamStrength(teamA, teamB) {
        this.teamAStrength = teamA;
        this.teamBStrength = teamB;
    }
    
    updateTeamStrengthFromScores(scoreA, scoreB) {
        // Calculate score difference
        var scoreDiff = scoreA - scoreB;
        
        // Base strength is equal
        var baseStrength = 5;
        
        // If scores are equal, both teams have equal strength (rope stays centered)
        if (scoreDiff === 0) {
            this.teamAStrength = baseStrength;
            this.teamBStrength = baseStrength;
        } else if (scoreDiff > 0) {
            // Team A has more correct answers, they pull stronger
            // Reduced multipliers for more gradual step-by-step movement
            this.teamAStrength = baseStrength + (scoreDiff * 0.35);
            this.teamBStrength = baseStrength - (scoreDiff * 0.25);
        } else {
            // Team B has more correct answers, they pull stronger
            var absDiff = Math.abs(scoreDiff);
            this.teamBStrength = baseStrength + (absDiff * 0.35);
            this.teamAStrength = baseStrength - (absDiff * 0.25);
        }
        
        // Ensure strengths stay positive
        this.teamAStrength = Math.max(1, this.teamAStrength);
        this.teamBStrength = Math.max(1, this.teamBStrength);
    }
    resetGame() {
        this.ropePosition = 0;
        this.velocity = 0;
        this.ropeTarget = 0;
        this.gameOver = false;
        this.winnerTeam = null;
        this.teamAStrength = 5;
        this.teamBStrength = 5;
    }
    updateRopePosition(position) {
        this.stopAutoPull();
        if (position > 0) {
            this.teamBStrength = 5 + position * 3;
            this.teamAStrength = 5 - position * 2;
        } else if (position < 0) {
            this.teamAStrength = 5 + Math.abs(position) * 3;
            this.teamBStrength = 5 - Math.abs(position) * 2;
        } else {
            this.teamAStrength = 5;
            this.teamBStrength = 5;
        }
    }
    onWindowResize() {
        var container = document.querySelector('.tug-arena');
        if (!container) return;
        var w = container.clientWidth;
        var h = container.clientHeight;
        if (w === 0 || h === 0) return;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (typeof THREE !== 'undefined') {
            window.tugScene3D = new TugOfWar3D();
            console.log('3D Tug of War - Fully Realistic Mode initialized');
        } else {
            console.error('Three.js library not loaded!');
        }
    }, 500);
});
