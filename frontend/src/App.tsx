import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

const TILE_SIZE = 48;
const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const ROBOT_SPEED = 1; // Logical units per key press

// Simple tilemap: 0 = grass, 1 = dirt
const tilemap = Array.from({ length: MAP_HEIGHT }, (_, y) =>
  Array.from({ length: MAP_WIDTH }, (_, x) => ((x + y) % 2))
);

const tileColors = [0x88cc88, 0xccb97e];
const robotSpriteColor = 0x3366ff;
const backendUrl = 'http://localhost:8000/api/robot/next_action';

function App() {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const worldContainerRef = useRef<PIXI.Container | null>(null);
  const robotGfxRef = useRef<PIXI.Graphics | null>(null);

  // State for the robot's logical position in the world grid
  const [robotWorldPos, setRobotWorldPos] = useState({ x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2, facing: 'right' });
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize/Re-initialize PixiJS application on dimension change
  useEffect(() => {
    if (!pixiContainer.current) return;

    let app: PIXI.Application;
    let worldContainer: PIXI.Container;
    let robotGfx: PIXI.Graphics;

    const setupPixi = async () => {
      try {
        // Destroy previous app instance if it exists
        if (appRef.current) {
          appRef.current.destroy(true, { children: true, texture: true });
          appRef.current = null;
          worldContainerRef.current = null;
          robotGfxRef.current = null;
          while (pixiContainer.current?.firstChild) {
            pixiContainer.current.removeChild(pixiContainer.current.firstChild);
          }
        }

        // Make canvas slightly smaller than window to avoid scrollbars
        const canvasWidth = dimensions.width * 0.95;
        const canvasHeight = dimensions.height * 0.8;

        app = new PIXI.Application();
        await app.init({
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: 0x111111, // Darker background
          antialias: true,
        });

        if (pixiContainer.current) {
          pixiContainer.current.appendChild(app.renderer.canvas);
          appRef.current = app;

          // Create the container for world elements (tiles, red box)
          worldContainer = new PIXI.Container();
          worldContainerRef.current = worldContainer;
          app.stage.addChild(worldContainer);

          // Draw tiles inside the world container
          for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
              const g = new PIXI.Graphics();
              g.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
              g.fill(tileColors[tilemap[y][x]]);
              worldContainer.addChild(g);
            }
          }

          // Draw red box in the center of the logical map, inside world container
          const mapCenterX = Math.floor(MAP_WIDTH / 2);
          const mapCenterY = Math.floor(MAP_HEIGHT / 2);
          const redBox = new PIXI.Graphics();
          redBox.rect(mapCenterX * TILE_SIZE + TILE_SIZE * 0.1, mapCenterY * TILE_SIZE + TILE_SIZE * 0.1, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
          redBox.fill(0xff0000);
          worldContainer.addChild(redBox);

          // Draw the robot centered on the STAGE (outside world container)
          robotGfx = new PIXI.Graphics();
          robotGfx.circle(0, 0, TILE_SIZE / 2.5); // Draw centered at its own origin
          robotGfx.fill(robotSpriteColor);
          robotGfx.x = canvasWidth / 2; // Center horizontally on canvas
          robotGfx.y = canvasHeight / 2; // Center vertically on canvas
          robotGfxRef.current = robotGfx;
          app.stage.addChild(robotGfx); // Add directly to stage

          // Initial positioning of the world based on robot start pos
          const initialWorldX = -(robotWorldPos.x * TILE_SIZE) + canvasWidth / 2 - TILE_SIZE / 2;
          const initialWorldY = -(robotWorldPos.y * TILE_SIZE) + canvasHeight / 2 - TILE_SIZE / 2;
          worldContainer.x = initialWorldX;
          worldContainer.y = initialWorldY;

          console.log('PixiJS Initialized. Robot centered, world container ready.');
        }
      } catch (error) {
        console.error("Error initializing PixiJS:", error);
      }
    };

    setupPixi();

    // Store current ref value for cleanup
    const currentPixiContainer = pixiContainer.current;

    // Cleanup
    return () => {
      appRef.current?.destroy(true, { children: true, texture: true });
      appRef.current = null;
      worldContainerRef.current = null;
      robotGfxRef.current = null;
      // Use the stored ref value in cleanup
      if (currentPixiContainer) {
        while (currentPixiContainer.firstChild) {
          currentPixiContainer.removeChild(currentPixiContainer.firstChild);
        }
      }
    };
  }, [dimensions]); // Re-run setup on resize

  // Update World Container position based on robot's logical world position
  useEffect(() => {
    if (!appRef.current || !worldContainerRef.current) return;

    const canvasWidth = appRef.current.renderer.width;
    const canvasHeight = appRef.current.renderer.height;

    // Calculate the target X/Y for the world container to keep the robot centered
    const targetWorldX = -(robotWorldPos.x * TILE_SIZE) + canvasWidth / 2 - TILE_SIZE / 2;
    const targetWorldY = -(robotWorldPos.y * TILE_SIZE) + canvasHeight / 2 - TILE_SIZE / 2;

    // Smoothly move the world container (optional, simple direct set for now)
    worldContainerRef.current.x = targetWorldX;
    worldContainerRef.current.y = targetWorldY;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [robotWorldPos]); // Re-run when robot's logical position changes


  // Keyboard controls - Update logical robot position, world scrolls via useEffect
  useEffect(() => {
    const handleKey = async (e: KeyboardEvent) => {
      // Prevent default browser scroll behavior for arrow keys and WASD
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      const newRobotPos = { ...robotWorldPos };
      let moved = false;

      if (e.key === 'ArrowUp' || e.key === 'w') {
        newRobotPos.y = Math.max(0, robotWorldPos.y - ROBOT_SPEED);
        moved = true;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        newRobotPos.y = Math.min(MAP_HEIGHT - 1, robotWorldPos.y + ROBOT_SPEED);
        moved = true;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        newRobotPos.x = Math.max(0, robotWorldPos.x - ROBOT_SPEED);
        moved = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        newRobotPos.x = Math.min(MAP_WIDTH - 1, robotWorldPos.x + ROBOT_SPEED);
        moved = true;
      }

      if (moved && (newRobotPos.x !== robotWorldPos.x || newRobotPos.y !== robotWorldPos.y)) {
        setRobotWorldPos(newRobotPos); // Update logical position

        // Call backend with the new logical position
        try {
          const res = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: newRobotPos.x, y: newRobotPos.y, facing: newRobotPos.facing }),
          });
          const data = await res.json();
          console.log('Backend action:', data.action);
        } catch (err) {
          // Log error or handle it appropriately
          console.warn('Backend API call failed:', err);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [robotWorldPos]); // Depend on robotWorldPos to ensure access to current state

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#333',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'hidden' // Prevent browser scrollbars
    }}>
      <h2 style={{ color: '#fff', textAlign: 'center', marginTop: '10px', flexShrink: 0 }}>React + PixiJS Tile Engine Demo</h2>
      <p style={{ color: '#fff', textAlign: 'center', marginBottom: '10px', flexShrink: 0 }}>Use WASD or arrow keys to move. World scrolls around the centered robot.</p>
      {/* Container for Pixi canvas */}
      <div ref={pixiContainer} style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    </div>
  );
}

export default App;
