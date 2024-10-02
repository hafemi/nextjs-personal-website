'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { FaGear } from 'react-icons/fa6';
import {
  MazeGenerator,
  handleGenerationButtonClicked
} from './maze-button-handler';
import styles from './page.module.css';

const minValues: Record<string, number> = {
  width: 5,
  height: 5,
  innerWidth: 0,
  innerHeight: 0,
};

const maxValues: Record<string, number> = {
  width: 150,
  height: 150,
  innerWidth: 145,
  innerHeight: 145,
};

export default function Home() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [innerWidth, setInnerWidth] = useState('');
  const [innerHeight, setInnerHeight] = useState('');
  const [startingPoint, setStartingPoint] = useState('top');
  const [animateCheckbox, setAnimateCheckbox] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(0);
  const [showSolutionCheckbox, setShowSolutionCheckbox] = useState(false);
  const [pathColor, setPathColor] = useState('#ff0000');
  const [wallColor, setWallColor] = useState('#000000');
  const [solutionColor, setSolutionColor] = useState('#00ff00');
  const [invalidElements, setInvalidElements] = useState<string[]>([]);
  const [maze, setMaze] = useState<MazeGenerator | null>(null);

  const validateElement = ({
    value,
    min,
    max,
    elementId,
  }: {
    value: number;
    min: number;
    max: number;
    elementId: string;
  }): void => {
    if ((!isNaN(value) && value < min) || value > max) {
      setInvalidElements([...invalidElements, elementId]);
      return;
    }

    setInvalidElements(invalidElements.filter((id) => id !== elementId));
  };
  
  const createColorInput = (
    id: string,
    text: string,
    setFunc: Dispatch<SetStateAction<string>>
  ): JSX.Element => {
    return (
      <div>
        <label htmlFor={id}>{text}</label>
        <input
          type="color"
          id={id}
          name={id}
          defaultValue="#ff0000"
          onChange={(e) => {
            console.log(e.target.value);
            setFunc(e.target.value);
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.heading}>MAZE GENERATOR</h1>
        <div>
          <label htmlFor="width">Width</label>
          <input
            className={`
              ${invalidElements.includes('width') ? styles.invalid : ''}
              ${styles.input}
            `}
            id="width"
            type="number"
            placeholder={`${minValues.width}-${maxValues.width}`}
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              validateElement({
                value: parseInt(e.target.value),
                min: minValues.width,
                max: maxValues.width,
                elementId: 'width',
              });
            }}
          />
          <br />
          <label htmlFor="height">Height</label>
          <input
            className={`
              ${invalidElements.includes('height') ? styles.invalid : ''}
              ${styles.input}
            `}
            id="height"
            type="number"
            placeholder={`${minValues.height}-${maxValues.height}`}
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              validateElement({
                value: parseInt(e.target.value),
                min: minValues.height,
                max: maxValues.height,
                elementId: 'height',
              });
            }}
          />
          <br />
          <label htmlFor="innerWidth">Inner Width</label>
          <input
            className={`
              ${invalidElements.includes('innerWidth') ? styles.invalid : ''}
              ${styles.input}
            `}
            id="innerWidth"
            type="number"
            placeholder={`${minValues.innerWidth}-${maxValues.innerWidth}`}
            value={innerWidth}
            onChange={(e) => {
              setInnerWidth(e.target.value);
              validateElement({
                value: parseInt(e.target.value),
                min: minValues.innerWidth,
                max: maxValues.innerWidth,
                elementId: 'innerWidth',
              });
            }}
          />
          <br />
          <label htmlFor="innerHeight">Inner Height</label>
          <input
            className={`
              ${invalidElements.includes('innerHeight') ? styles.invalid : ''}
              ${styles.input}
            `}
            id="innerHeight"
            type="number"
            placeholder={`${minValues.innerHeight}-${maxValues.innerHeight}`}
            value={innerHeight}
            onChange={(e) => {
              setInnerHeight(e.target.value);
              validateElement({
                value: parseInt(e.target.value),
                min: minValues.innerHeight,
                max: maxValues.innerHeight,
                elementId: 'innerHeight',
              });
            }}
          />
          <br />
          <label htmlFor="startingPoint">Starting Point</label>
          <select id="startingPoint" value={startingPoint} onChange={(e) => setStartingPoint(e.target.value)}>
            <option value="top">Top</option>
            <option value="side">Side</option>
            <option value="topleft">Top Left</option>
            <option value="lefttop">Left Top</option>
            <option value="none">None</option>
          </select>
          <br />
          <label htmlFor="animationSpeedCheckbox">Animation Speed</label>
          <input
            id="animationSpeedCheckbox"
            type="checkbox"
            onChange={() => {
              setAnimateCheckbox(!animateCheckbox);
            }}
          />
          {animateCheckbox && (
            <div>
              <label htmlFor="speedInMS">Speed (ms) </label>
              <input
                id="speedInMS"
                type="number"
                placeholder="100"
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              />
            </div>
          )}
          <br />
          <label htmlFor="showSolutionCheckbox">Show Solution</label>
          <input
            id="showSolutionCheckbox"
            type="checkbox"
            onChange={(e) => {
              setShowSolutionCheckbox(e.target.checked);
              if (!maze || maze.isGenerating) return;

              if (e.target.checked) {
                maze.updateMazeCanvas(true);
              } else {
                maze.updateMazeCanvas(false);
              }
            }}
          />
        </div>
        <div>
          {createColorInput('wallColor', 'Wall Color', setWallColor)}
          {createColorInput('pathColor', 'Path Color', setPathColor)}
          {createColorInput('solutionColor', 'Solution Color', setSolutionColor)}
        </div>
        <div>
          <button
            onClick={() =>
              handleGenerationButtonClicked({
                width: getNumber(width),
                height: getNumber(height),
                innerWidth: getNumber(innerWidth) ?? 0,
                innerHeight: getNumber(innerHeight) ?? 0,
                invalidElements,
                minValues,
                maxValues,
                startingPoint,
                animateCheckbox,
                animationSpeed,
                showSolutionCheckbox,
                pathColor,
                wallColor,
                solutionColor,
                maze,
                setMaze,
              })
            }
          >
            <FaGear /> Generate
          </button>
        </div>
        <canvas id="mazeCanvas" width="0" height="0"></canvas>
      </main>
    </div>
  );
}

function getNumber(value: string): number {
  return isNaN(parseInt(value)) ? 0 : parseInt(value);
}