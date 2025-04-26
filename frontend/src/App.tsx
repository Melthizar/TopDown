import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

const TILE_SIZE = 48;
const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const ROBOT_SPEED = 1;

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
  const [robot, setRobot] = useState({ x: 2, y: 2, facing: 'right' });

  // Draw the tilemap and robot
  useEffect(() => {
    if (!pixiContainer.current) return;
    if (appRef.current) return;
    const app = new PIXI.Application({
      width: TILE_SIZE * MAP_WIDTH,
      height: TILE_SIZE * MAP_HEIGHT,
      backgroundColor: 0x222222,
      antialias: true,
    });
    pixiContainer.current.appendChild(app.view as any);
    appRef.current = app;

    // Draw tiles
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const g = new PIXI.Graphics();
        g.beginFill(tileColors[tilemap[y][x]]);
        g.drawRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        g.endFill();
        app.stage.addChild(g);
      }
    }

    // Draw robot
    const robotG = new PIXI.Graphics();
    robotG.beginFill(robotSpriteColor);
    robotG.drawCircle(0, 0, TILE_SIZE / 2.5);
    robotG.endFill();
    robotG.x = robot.x * TILE_SIZE + TILE_SIZE / 2;
    robotG.y = robot.y * TILE_SIZE + TILE_SIZE / 2;
    robotG.name = 'robot';
    app.stage.addChild(robotG);

    return () => {
      app.destroy(true, { children: true });
      appRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  // Update robot position
  useEffect(() => {
    if (!appRef.current) return;
    const robotG = appRef.current.stage.getChildByName('robot') as PIXI.Graphics;
    if (robotG) {
      robotG.x = robot.x * TILE_SIZE + TILE_SIZE / 2;
      robotG.y = robot.y * TILE_SIZE + TILE_SIZE / 2;
    }
  }, [robot]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = async (e: KeyboardEvent) => {
      let newRobot = { ...robot };
      if (e.key === 'ArrowUp' || e.key === 'w') newRobot.y = Math.max(0, robot.y - ROBOT_SPEED);
      if (e.key === 'ArrowDown' || e.key === 's') newRobot.y = Math.min(MAP_HEIGHT - 1, robot.y + ROBOT_SPEED);
      if (e.key === 'ArrowLeft' || e.key === 'a') newRobot.x = Math.max(0, robot.x - ROBOT_SPEED);
      if (e.key === 'ArrowRight' || e.key === 'd') newRobot.x = Math.min(MAP_WIDTH - 1, robot.x + ROBOT_SPEED);
      setRobot(newRobot);

      // Call backend for next action (demo)
      try {
        const res = await fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newRobot, facing: newRobot.facing }),
        });
        const data = await res.json();
        // Optionally, use data.action to update robot
        // For now, just log it
        console.log('Backend action:', data.action);
      } catch (err) {
        // Ignore errors if backend is not running
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [robot]);

  return (
    <div>
      <h2 style={{ color: '#fff' }}>React + PixiJS Tile Engine Demo</h2>
      <div ref={pixiContainer} />
      <p style={{ color: '#fff' }}>Use arrow keys or WASD to move the robot. Backend action is logged in the console.</p>
    </div>
  );
}

export default App;
