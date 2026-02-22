// ===================================
// Brain Tug - 3D Tug of War Scene
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
        
        // 🔥 PHYSICS SYSTEM VARIABLES
        this.teamAStrength = 5;        // Team A pulling force
        this.teamBStrength = 5;        // Team B pulling force
        this.ropePosition = 0;         // Current rope position (-2 to +2)
        this.maxPullDistance = 2;      // Win threshold
        this.gameOver = false;         // Game state
        this.winnerTeam = null;        // Winner ('A' or 'B')
        
        // 🔥 SPRING PHYSICS VARIABLES (ULTRA REAL)
        this.velocity = 0;             // Rope movement velocity
        this.springStrength = 0.02;    // Spring force (higher = snappier)
        this.damping = 0.92;           // Velocity damping (lower = more friction)
        this.ropeTarget = 0;           // Target position for rope
        
        this.init();
    }

    // STEP 1: Initialize Scene - PROPER RENDERER SETUP
    init() {
        // 1️⃣ Select the container element
        const container = document.querySelector('.tug-arena');
        if (!container) {
            console.error('❌ Container .tug-arena not found!');
            return;
        }

        // Set container dimensions explicitly
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 400;
        
        console.log('📏 Container dimensions:', width, 'x', height);
        
        if (width === 0 || height === 0) {
            console.error('❌ Container has 0 width or height! Scene will not show.');
            return;
        }

        // Create Scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background

        // 2️⃣ Create PerspectiveCamera
        this.camera = new THREE.PerspectiveCamera(
            75,                    // FOV
            width / height,        // Aspect ratio
            0.1,                   // Near
            1000                   // Far
        );

        // 5️⃣ IMPROVED CAMERA - Lower angle, more dramatic
        this.camera.position.set(0, 2.5, 7);  // Lower, closer
        this.camera.lookAt(0, 1, 0);  // Look at rope level
        
        console.log('📷 Camera positioned at:', this.camera.position);

        // Create WebGLRenderer (NOT using existing canvas)
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true           // Transparent background
        });

        // Set renderer size to container dimensions
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Enable shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // IMPORTANT: Append renderer to container
        const canvas = document.getElementById('tugCanvas');
        if (canvas) {
            canvas.remove(); // Remove old canvas if exists
        }
        container.appendChild(this.renderer.domElement);
        this.renderer.domElement.id = 'tugCanvas';
        this.renderer.domElement.className = 'tug-canvas-3d';

        console.log('✅ Renderer attached to container');
        console.log('✅ Renderer size:', width, 'x', height);

        // 4️⃣ Add Proper Lighting (CRITICAL - Without light nothing shows)
        this.setupLighting();

        // 3️⃣ Add visible test object (DEBUG STEP)
        this.addTestCube();
        
        // Remove test cube after 3 seconds (once we confirm scene works)
        setTimeout(() => {
            this.removeTestCube();
        }, 3000);

        // Add ground plane
        this.createGround();

        // Add rope
        this.createRope();

        // Add two characters
        this.createCharacters();

        // 5️⃣ Start Animation Loop (VERY IMPORTANT)
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // 🎮 KEYBOARD CONTROLS (Interactive Pulling)
        this.setupKeyboardControls();

        // 🔥 START AUTO PULL SIMULATION (Demo Mode)
        this.startAutoPull();

        console.log('✅ 3D Scene Ready!');
        console.log('🎮 Physics system initialized');
        console.log('⚡ Auto-pull demo mode active');
    }

    // 🔥 AUTO PULL SIMULATION - Creates natural pulling variation
    startAutoPull() {
        this.autoPullInterval = setInterval(() => {
            if (!this.gameOver) {
                // Random strength variation (4-7 range for realistic competition)
                this.teamAStrength = 4 + Math.random() * 3;
                this.teamBStrength = 4 + Math.random() * 3;
                
                // Occasional burst of strength (dramatic moments)
                if (Math.random() > 0.9) {
                    this.teamAStrength += 2;
                }
                if (Math.random() > 0.9) {
                    this.teamBStrength += 2;
                }
                
                // Log strength changes
                // console.log(`💪 Team A: ${this.teamAStrength.toFixed(1)} | Team B: ${this.teamBStrength.toFixed(1)}`);
            }
        }, 500); // Update every 500ms
    }

    // 🔥 STOP AUTO PULL (when manual control needed)
    stopAutoPull() {
        if (this.autoPullInterval) {
            clearInterval(this.autoPullInterval);
            this.autoPullInterval = null;
            console.log('⏸️ Auto-pull stopped');
        }
    }

    // 🎮 KEYBOARD CONTROLS (Interactive Pulling)
    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            if (this.gameOver) return;

            // Press 'A' → Team A pulls LEFT
            if (e.key === 'a' || e.key === 'A') {
                this.ropeTarget -= 0.3;
                console.log('⬅️ Team A PULLS!');
            }

            // Press 'L' → Team B pulls RIGHT
            if (e.key === 'l' || e.key === 'L') {
                this.ropeTarget += 0.3;
                console.log('➡️ Team B PULLS!');
            }

            // Press 'R' → Reset game
            if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            }
        });

        console.log('🎮 Keyboard controls enabled:');
        console.log('   Press A → Team A pulls');
        console.log('   Press L → Team B pulls');
        console.log('   Press R → Reset game');
    }

    // 3️⃣ DEBUG: Add test cube to verify scene is working
    addTestCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,    // Red
            roughness: 0.5
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0.5, 0);  // Center, slightly above ground
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);
        
        // Store reference to remove later
        this.testCube = cube;
        
        console.log('🔴 DEBUG: Red test cube added at (0, 0.5, 0)');
        console.log('   If you see a red cube, renderer and camera are working!');
    }

    // STEP 2: Add Lighting (REALISTIC CARTOON LIGHTING)
    setupLighting() {
        // Add HemisphereLight for realistic sky/ground ambient lighting
        // Sky color (soft blue-white), Ground color (warm beige), Intensity
        const hemisphereLight = new THREE.HemisphereLight(
            0xffffff,     // Sky color - bright white
            0xf0e6d2,     // Ground color - warm beige
            0.6           // Intensity
        );
        this.scene.add(hemisphereLight);

        // Add DirectionalLight with shadows (main sun-like light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 10, 7);  // Top-right for natural look
        directionalLight.castShadow = true;       // Enable shadows

        // Configure shadow properties for soft, realistic shadows
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -8;
        directionalLight.shadow.camera.right = 8;
        directionalLight.shadow.camera.top = 8;
        directionalLight.shadow.camera.bottom = -8;
        directionalLight.shadow.bias = -0.0001;   // Reduce shadow acne

        this.scene.add(directionalLight);

        // Add fill light (soft light from opposite side)
        const fillLight = new THREE.DirectionalLight(0xe8f4ff, 0.3);
        fillLight.position.set(-5, 5, -3);
        this.scene.add(fillLight);

        console.log('✅ Realistic cartoon lighting added (Hemisphere + Directional + Fill)');
    }

    // STEP 3: Add Soft Shadow Plane Under Characters
    createGround() {
        // Create a large plane geometry as ground - soft shadow receiver
        const groundGeometry = new THREE.PlaneGeometry(20, 12);
        
        // Soft shadow receiving material (transparent, only shows shadows)
        const groundMaterial = new THREE.ShadowMaterial({
            opacity: 0.25,      // Soft, subtle shadows
            color: 0x000000     // Black shadows
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        
        // Rotate it properly (horizontal) - rotate -90 degrees on X axis
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true; // Receive shadows from all objects

        this.scene.add(ground);

        console.log('✅ Soft shadow plane added under characters');
    }

    // STEP 4: Add Rope - ONE continuous TENSE rope showing competition
    createRope() {
        // Create ONE single continuous rope using TubeGeometry with curve
        // This creates a rope that bends to show tension
        
        // Define curve points for TENSE rope (less sag = more tension)
        const leftHandPos = new THREE.Vector3(-2.5, 1.3, 0);
        const rightHandPos = new THREE.Vector3(2.5, 1.3, 0);
        const middlePos = new THREE.Vector3(0, 1.25, 0); // HIGHER middle = tight rope
        
        // Create a smooth curve through these points
        const curve = new THREE.CatmullRomCurve3([
            leftHandPos,
            middlePos,
            rightHandPos
        ]);
        
        // Create tube geometry along the curve - ONE continuous rope
        const ropeGeometry = new THREE.TubeGeometry(
            curve,      // The curve path
            64,         // Number of segments (smooth)
            0.09,       // Thicker radius (under tension)
            16,         // Radial segments (roundness)
            false       // Not closed
        );
        
        // Apply rope-like material with smooth cartoon shading
        const ropeMaterial = new THREE.MeshStandardMaterial({
            color: 0xA0826D,      // Soft brown rope color (pastel)
            roughness: 0.8,       // Smooth but textured
            metalness: 0.0        // No metallic look
        });

        this.ropeMesh = new THREE.Mesh(ropeGeometry, ropeMaterial);
        this.ropeMesh.castShadow = true;
        this.ropeMesh.receiveShadow = true;

        // Store curve for later tension updates
        this.ropeCurve = curve;
        this.ropeCurvePoints = [leftHandPos, middlePos, rightHandPos];

        this.scene.add(this.ropeMesh);
        this.rope = this.ropeMesh;

        // 6️⃣ ROPE CENTER MARKER - Red cloth (competition marker)
        const centerMarkerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const centerMarkerMaterial = new THREE.MeshStandardMaterial({
            color: 0xff4444,      // Bright red (competition marker)
            emissive: 0xff2222,   // Red glow
            emissiveIntensity: 0.3,
            roughness: 0.5,
            metalness: 0.0
        });
        const centerMarker = new THREE.Mesh(centerMarkerGeometry, centerMarkerMaterial);
        centerMarker.position.copy(middlePos);
        centerMarker.castShadow = true;
        this.centerMarker = centerMarker;
        this.scene.add(centerMarker);

        console.log('✅ ONE continuous curved rope added with tension');
    }

    // STEP 5: Add TWO Large Pixar-Style 3D Characters (Soft Pastel Colors)
    createCharacters() {
        // Create left character (Team A) - LARGE detailed character with soft pastel color
        this.characterLeft = this.createCharacter(-2.8, 0xffb3ba, 'left');  // Soft coral/pink
        this.scene.add(this.characterLeft);

        // Create right character (Team B) - LARGE detailed character with soft pastel color
        this.characterRight = this.createCharacter(2.8, 0xbae1ff, 'right');  // Soft sky blue
        this.scene.add(this.characterRight);

        console.log('✅ TWO large Pixar-style characters added with soft pastel colors');
    }

    createCharacter(xPosition, color, side) {
        const character = new THREE.Group();

        // Determine facing direction
        const faceRotation = side === 'left' ? 0.2 : -0.2;

        // ====== PIXAR-STYLE CHARACTER ======
        // Larger proportions, more details
        
        // HEAD → Large sphere with FOCUSED LOOK (looking at opponent)
        const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffe4c4,      // Soft peach skin color (pastel)
            roughness: 0.4,       // Smooth cartoon surface
            metalness: 0.0        // No metallic look
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 2.2, -0.05);  // Slightly forward (focused)
        head.castShadow = true;
        head.receiveShadow = true;
        
        // SLIGHT HEAD TILT (determined, competitive)
        head.rotation.y = side === 'left' ? 0.1 : -0.1;  // Looking at opponent
        head.rotation.z = side === 'left' ? -0.05 : 0.05;  // Slight tilt
        
        character.add(head);

        // HAIR → Hemisphere on top of head (soft pastel colors)
        const hairGeometry = new THREE.SphereGeometry(0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = new THREE.MeshStandardMaterial({
            color: side === 'left' ? 0x8B6F47 : 0xD4A574,  // Soft brown tones
            roughness: 0.7        // Smooth but with some texture
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.set(0, 2.5, 0);
        hair.castShadow = true;
        character.add(hair);

        // EYES → Larger white spheres with pupils (smooth cartoon shading)
        const eyeWhiteGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.0
        });
        
        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        leftEyeWhite.position.set(-0.18, 2.25, 0.42);
        character.add(leftEyeWhite);
        
        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        rightEyeWhite.position.set(0.18, 2.25, 0.42);
        character.add(rightEyeWhite);

        // PUPILS → Soft blue pupils
        const pupilGeometry = new THREE.SphereGeometry(0.06, 16, 16);
        const pupilMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a7ba7,      // Soft blue (pastel)
            roughness: 0.3,
            metalness: 0.0
        });
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.18, 2.25, 0.52);
        character.add(leftPupil);
        
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.18, 2.25, 0.52);
        character.add(rightPupil);

        // SMILE → Small curved cylinder
        const smileGeometry = new THREE.TorusGeometry(0.15, 0.02, 8, 16, Math.PI);
        const smileMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const smile = new THREE.Mesh(smileGeometry, smileMaterial);
        smile.position.set(0, 2.0, 0.48);
        smile.rotation.x = Math.PI;
        character.add(smile);

        // BODY → Rounded capsule-like shape with smooth cartoon shading
        const bodyGeometry = new THREE.BoxGeometry(0.9, 1.2, 0.5, 2, 2, 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: color,         // Soft pastel team color
            roughness: 0.5,       // Smooth cartoon surface
            metalness: 0.0        // No metallic look
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 1.2, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        character.add(body);
        
        // Add rounded shoulders (small spheres) for better capsule effect
        const shoulderGeometry = new THREE.SphereGeometry(0.18, 16, 16);
        const shoulderMaterial = new THREE.MeshStandardMaterial({
            color: color,         // Matches body color
            roughness: 0.5,
            metalness: 0.0
        });
        
        const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        leftShoulder.position.set(-0.45, 1.7, 0);
        leftShoulder.castShadow = true;
        character.add(leftShoulder);
        
        const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        rightShoulder.position.set(0.45, 1.7, 0);
        rightShoulder.castShadow = true;
        character.add(rightShoulder);

        // ARMS → FULLY STRETCHED FORWARD gripping rope (competitive pose)
        const armGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 16);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xffe4c4,      // Soft peach skin color (matches head)
            roughness: 0.4,       // Smooth cartoon shading
            metalness: 0.0
        });
        
        // Left arm - FULLY EXTENDED toward rope (straight)
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.4, 1.4, 0.35);  // Extended forward
        leftArm.rotation.z = side === 'left' ? 0.7 : -0.5;
        leftArm.rotation.x = 0.5;  // MORE forward reach
        leftArm.castShadow = true;
        character.add(leftArm);

        // Right arm - FULLY EXTENDED toward rope (straight)
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.4, 1.4, 0.35);  // Extended forward
        rightArm.rotation.z = side === 'left' ? -0.7 : 0.5;
        rightArm.rotation.x = 0.5;  // MORE forward reach
        rightArm.castShadow = true;
        character.add(rightArm);

        // HANDS → Spheres positioned EXACTLY on the rope endpoints (smooth cartoon skin)
        const handGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const handMaterial = new THREE.MeshStandardMaterial({
            color: 0xffe4c4,      // Soft peach skin color
            roughness: 0.4,
            metalness: 0.0
        });

        // Calculate hand positions to touch rope at endpoints
        // Rope ends: left at (-2.5, 1.3, 0), right at (2.5, 1.3, 0)
        // Character positions: left at -2.8, right at 2.8
        // So hands need offset of +0.3 for left char, -0.3 for right char
        
        const handOffset = side === 'left' ? 0.3 : -0.3;
        
        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(handOffset - 0.15, 1.3, 0);  // Both hands near rope center
        leftHand.castShadow = true;
        character.add(leftHand);

        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        rightHand.position.set(handOffset + 0.15, 1.3, 0);  // Both hands near rope center
        rightHand.castShadow = true;
        character.add(rightHand);

        // LEGS → CylinderGeometry with BENT KNEES (wide stance)
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.9, 16);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a5a6e,      // Soft gray-blue pants (pastel)
            roughness: 0.7,       // Cloth-like texture
            metalness: 0.0
        });

        // WIDE STANCE - feet apart for stability
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.28, 0.45, 0.15);  // Wider, forward for pulling
        leftLeg.rotation.x = -0.25;  // MORE knee bend
        leftLeg.rotation.z = side === 'left' ? -0.15 : 0.1;  // Wider stance
        leftLeg.castShadow = true;
        character.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.28, 0.45, 0.15);  // Wider, forward for pulling
        rightLeg.rotation.x = -0.25;  // MORE knee bend
        rightLeg.rotation.z = side === 'left' ? 0.15 : -0.1;  // Wider stance
        rightLeg.castShadow = true;
        character.add(rightLeg);

        // SHOES → Cartoon shoes (WIDER STANCE - feet firmly planted)
        const shoeGeometry = new THREE.BoxGeometry(0.25, 0.12, 0.35);
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: color,         // Uses soft pastel team color (0xffb3ba or 0xbae1ff)
            roughness: 0.6,
            metalness: 0.0
        });

        const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        leftShoe.position.set(-0.28, 0.04, 0.12);  // Wider stance, forward
        leftShoe.castShadow = true;
        character.add(leftShoe);

        const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        rightShoe.position.set(0.28, 0.04, 0.12);  // Wider stance, forward
        rightShoe.castShadow = true;
        character.add(rightShoe);

        // 1️⃣ REAL TUG-OF-WAR COMPETITIVE POSE
        
        // Position character (move body backward slightly)
        character.position.set(xPosition, 0, side === 'left' ? -0.3 : 0.3);
        
        // Face each other (looking at opponent)
        character.rotation.y = side === 'left' ? 0.15 : -0.15;
        
        // LEAN BACKWARD (pulling stance) - dramatic backward tilt
        character.rotation.z = side === 'left' ? -0.3 : 0.3;  // Increased from 0.25
        
        // Torso lean backward (rotate entire upper body)
        character.rotation.x = -0.2;  // Backward body tilt
        
        // Wide stance - feet apart for stability
        const leftLegMesh = character.children.find(c => c.position.x < 0 && c.position.y < 0.5);
        const rightLegMesh = character.children.find(c => c.position.x > 0 && c.position.y < 0.5);
        
        // Store reference for animations
        character.userData.side = side;
        
        return character;
    }

    // 3️⃣ ANIMATION LOOP - Physics-based movement
    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;
        
        // Note: Character X movement and rotation.z are now handled by updateCharacters()
        // in the physics system. We only add Z-axis pulling motion and Y-axis breathing here.
        
        // LEFT CHARACTER - Z-axis pulling motion (forward/backward)
        if (this.characterLeft) {
            // Backward/forward pulling motion
            const pullOffset = Math.sin(time * 1.2) * 0.15;
            this.characterLeft.position.z = -0.3 + pullOffset;
            
            // Add slight strain movement (overrides physics y movement slightly)
            const strain = Math.abs(this.velocity) * 2;
            this.characterLeft.position.y = Math.sin(time * 2) * strain * 0.05;
        }
        
        // RIGHT CHARACTER - Z-axis pulling motion (opposite phase)
        if (this.characterRight) {
            // Opposite pulling motion
            const pullOffset = Math.sin(time * 1.2 + Math.PI) * 0.15;
            this.characterRight.position.z = 0.3 + pullOffset;
            
            // Slight strain movement
            const strain = Math.abs(this.velocity) * 2;
            this.characterRight.position.y = Math.sin(time * 2 + Math.PI) * strain * 0.05;
        }

        // Note: Rope curve points are now fully controlled by updateRopeCurve()
        // in the physics system for accurate spring-based movement

        // 🔥 UPDATE PHYSICS SYSTEM (handles rope and character X/rotation updates)
        this.updatePhysics();

        // Render scene with camera
        this.renderer.render(this.scene, this.camera);
    }

    // 🔥 SPRING PHYSICS UPDATE (ULTRA REALISTIC)
    updatePhysics() {
        if (this.gameOver) return;

        // Add team strength influence to target position
        const forceDifference = this.teamAStrength - this.teamBStrength;
        this.ropeTarget += forceDifference * 0.001; // Continuous force application

        // 🌀 SPRING PHYSICS - Creates realistic bounce and inertia
        const force = (this.ropeTarget - this.ropePosition) * this.springStrength;
        this.velocity += force;
        this.velocity *= this.damping; // Apply damping (friction)
        this.ropePosition += this.velocity;

        // Clamp to max pull distance
        this.ropePosition = Math.max(
            -this.maxPullDistance,
            Math.min(this.maxPullDistance, this.ropePosition)
        );

        // Clamp target to prevent infinite acceleration
        this.ropeTarget = Math.max(
            -this.maxPullDistance,
            Math.min(this.maxPullDistance, this.ropeTarget)
        );

        // Update rope curve with SAG effect
        this.updateRopeCurve();

        // Update character positions and LEAN animation
        this.updateCharacters();

        // Check for winner
        this.checkWinner();
    }

    // 🌊 UPDATE ROPE CURVE (Dynamic Sag + Stretch)
    updateRopeCurve() {
        if (!this.ropeCurvePoints || !this.ropeMesh) return;

        // Update rope curve points with movement
        const leftX = -2.5 + this.ropePosition;
        const centerX = this.ropePosition;
        const rightX = 2.5 + this.ropePosition;

        // 🔥 ROPE SAG - Middle point drops based on tension
        const sagAmount = Math.abs(this.ropePosition) * 0.2; // More pull = more sag
        const centerY = 1.2 - sagAmount; // Rope drops when pulled

        this.ropeCurvePoints[0].set(leftX, 1, 0);
        this.ropeCurvePoints[1].set(centerX, centerY, 0);
        this.ropeCurvePoints[2].set(rightX, 1, 0);

        // Rebuild rope geometry
        const curve = new THREE.CatmullRomCurve3(this.ropeCurvePoints);
        const newGeometry = new THREE.TubeGeometry(curve, 40, 0.08, 16, false);

        this.ropeMesh.geometry.dispose();
        this.ropeMesh.geometry = newGeometry;

        // Update center marker
        if (this.centerMarker) {
            this.centerMarker.position.set(centerX, centerY, 0);
        }
    }

    // 🤸 UPDATE CHARACTERS (Movement + Lean Animation)
    updateCharacters() {
        if (!this.characterLeft || !this.characterRight) return;

        // Move characters with rope (half speed for realistic effect)
        this.characterLeft.position.x = -2.8 + this.ropePosition * 0.5;
        this.characterRight.position.x = 2.8 + this.ropePosition * 0.5;

        // 🔥 CHARACTER LEAN - They lean based on pull direction
        // When pulled right, left character leans forward (pulling hard)
        // When pulled left, right character leans forward
        this.characterLeft.rotation.z = 0.3 + this.ropePosition * 0.15;
        this.characterRight.rotation.z = 0.3 - this.ropePosition * 0.15;

        // Slight vertical movement (straining)
        const strain = Math.abs(this.velocity) * 2;
        this.characterLeft.position.y = Math.sin(Date.now() * 0.01) * strain * 0.05;
        this.characterRight.position.y = Math.sin(Date.now() * 0.01 + Math.PI) * strain * 0.05;
    }

    // 🔥 WINNER DETECTION
    checkWinner() {
        if (this.ropePosition >= this.maxPullDistance) {
            console.log('🏆 TEAM B WINS!');
            this.gameOver = true;
            this.winnerTeam = 'B';
            this.announceWinner('B');
        }

        if (this.ropePosition <= -this.maxPullDistance) {
            console.log('🏆 TEAM A WINS!');
            this.gameOver = true;
            this.winnerTeam = 'A';
            this.announceWinner('A');
        }
    }

    // 🔥 ANNOUNCE WINNER (visual feedback)
    announceWinner(team) {
        console.log(`🎉 GAME OVER! Team ${team} is the winner!`);
        console.log(`Final rope position: ${this.ropePosition.toFixed(2)}`);
        console.log(`Team A Strength: ${this.teamAStrength}`);
        console.log(`Team B Strength: ${this.teamBStrength}`);
        
        // Optional: Show winner message in UI
        setTimeout(() => {
            alert(`🏆 TEAM ${team} WINS THE TUG-OF-WAR!`);
        }, 500);
    }

    // 🔥 SET TEAM STRENGTHS (called from game logic)
    setTeamStrength(teamA, teamB) {
        this.teamAStrength = teamA;
        this.teamBStrength = teamB;
        console.log(`Strength updated: Team A=${teamA}, Team B=${teamB}`);
    }

    // 🔥 RESET GAME
    resetGame() {
        this.ropePosition = 0;
        this.velocity = 0;
        this.ropeTarget = 0;
        this.gameOver = false;
        this.winnerTeam = null;
        this.teamAStrength = 5;
        this.teamBStrength = 5;
        console.log('🔄 Game reset! Press A or L to pull!');
    }

    // Update rope position based on game score - INTEGRATED WITH PHYSICS
    updateRopePosition(position) {
        // Position ranges from -1 (Team A winning) to 1 (Team B winning)
        // Stop auto-pull and use game-based strength control
        this.stopAutoPull();
        
        // Convert position to team strengths
        // Positive position = Team B winning, needs more strength
        // Negative position = Team A winning, needs more strength
        
        if (position > 0) {
            // Team B is winning
            this.teamBStrength = 5 + position * 3;  // 5-8 range
            this.teamAStrength = 5 - position * 2;  // 5-3 range
        } else if (position < 0) {
            // Team A is winning
            this.teamAStrength = 5 + Math.abs(position) * 3;  // 5-8 range
            this.teamBStrength = 5 - Math.abs(position) * 2;  // 5-3 range
        } else {
            // Equal
            this.teamAStrength = 5;
            this.teamBStrength = 5;
        }
        
        console.log(`Game score updated: Team A=${this.teamAStrength.toFixed(1)}, Team B=${this.teamBStrength.toFixed(1)}`);
    }

    // Handle window resize
    onWindowResize() {
        const container = document.querySelector('.tug-arena');
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width === 0 || height === 0) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        console.log('📐 Resized to:', width, 'x', height);
    }
    
    // Remove test cube after confirming scene works
    removeTestCube() {
        if (this.testCube) {
            this.scene.remove(this.testCube);
            this.testCube.geometry.dispose();
            this.testCube.material.dispose();
            this.testCube = null;
            console.log('✅ Test cube removed - scene is working!');
        }
    }
}

// Initialize 3D scene when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the container to be properly sized
    setTimeout(() => {
        if (typeof THREE !== 'undefined') {
            window.tugScene3D = new TugOfWar3D();
            console.log('🎮 3D Tug of War scene initialized successfully!');
        } else {
            console.error('❌ Three.js library not loaded!');
        }
    }, 500);
});
