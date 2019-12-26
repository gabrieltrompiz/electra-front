import React, { useState, useRef, useEffect } from 'react';
import ToolBar from '../components/ToolBar';
import Login from './Login';
import Register from './Register';
import bezier from '../utils/bezier';

/**
 * Login and register views
 * @visibleName Authentication View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Authentication: React.FC = () => {
  const [view, setView] = useState<string>('Login');
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  /** Points to make a Bezier curve animation in the background of the authentication view */
  let point1 = 0.2,
      point2 = 0.6,
      point3 = 0.6,
      point4 = 0.7,
      point5 = 0.75,
      point6 = 0.81,
      pointFlow1 = false,
      pointFlow2 = true,
      pointFlow3 = false,
      pointFlow4 = true,
      pointFlow5 = false;
  /** Reference to the current ID of animation frame */
  let AF = useRef(-1);

  /** Canvas ref to access context and draw on it */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    cancelAnimationFrame(AF.current);
    AF.current = requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [width, height])

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
    AF.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(AF.current)
    // eslint-disable-next-line
  }, []);

  /** Animates a bezier curve smoothly using basic math. This is what gets called by animation frame */
  const animate = () => {  
    point1 = (!pointFlow1 ? point1 - 0.0001 : point1 + 0.00008);
    point2 = (!pointFlow2 ? point2 - 0.00009 : point2 + 0.00007);
    point3 = (!pointFlow3 ? point3 - 0.00008 : point3 + 0.00006);
    point4 = (!pointFlow4 ? point4 - 0.0001 : point4 + 0.00007);
    point5 = (!pointFlow5 ? point5 - 0.0001 : point5 + 0.00008);
    if(point1 <= 0.21) pointFlow1 = true;
    else if(point1 >= 0.35) pointFlow1 = false;
    if(point2 <= 0.55) pointFlow2 = true;
    else if(point2 >= 0.65) pointFlow2 = false;
    if(point3 <= 0.55) pointFlow3 = true;
    else if(point3 >= 0.65) pointFlow3 = false;
    if(point4 <= 0.65) pointFlow4 = true;
    else if(point4 >= 0.75) pointFlow4 = false;
    if(point5 <= 0.75) pointFlow5 = true;
    else if(point5 >= 0.78) pointFlow5 = false;
    if(canvasRef && canvasRef.current) {
      const ctx: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
      if(ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.lineTo(width * 0.4, height)
        const points = [
          [width * point1, height * 0.8],
          [width * point2, height * 0.75],
          [width * point3, height * 0.4],
          [width * point4, height * 0.2],
          [width * point5, height * 0.05],
          [width * point6, 0],
        ];
        bezier(ctx, points);
        ctx.lineTo(0, 0);
        ctx.fillStyle = '#2F3136';
        ctx.fill();
      }
    }
    AF.current = requestAnimationFrame(animate);
  }

  /** View that be rendered, either Login or Register. */
  const activeView = view === 'Login' ? <Login setView={setView} /> : <Register setView={setView} />

  return (
    <div id='authorization'>
      <canvas ref={canvasRef} width={width} height={height}/>
      <ToolBar transparent={true} />
      <div id='authorization-content'>
        {activeView}
      </div>
    </div>
  );
};

export default Authentication;