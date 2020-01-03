import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { connect } from 'react-redux';
import ToolBar from '../components/ToolBar';
import Login from './Login';
import Register from './Register';
import bezier from '../utils/bezier';
import { State } from '../types';

/**
 * Login and register views
 * @visibleName Authentication View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Authentication: React.RefForwardingComponent<HTMLDivElement, AuthenticationProps> = ({ loggedIn }, ref) => {
  const [view, setView] = useState<string>('Login');
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  /** Points to make a Bezier curve animation in the background of the authentication view */
  let point0 = 0.4, point1 = 0.15, point2 = 0.55, point3 = 0.55, point4 = 0.65, point5 = 0.70, point6 = 0.76,
      pointFlow1 = false, pointFlow2 = true, pointFlow3 = false, pointFlow4 = true, pointFlow5 = false;
      
  /** Reference to the current ID of animation frame */
  let AF = useRef(-1);
  const [initialW, initialH] = [useRef(window.innerWidth), useRef(window.innerHeight)];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(width !== initialW.current || height !== initialH.current) {
      cancelAnimationFrame(AF.current);
      AF.current = requestAnimationFrame(animate);
      initialW.current = -1;
      initialH.current = -1;
    }
    // eslint-disable-next-line
  }, [width, height]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(!loggedIn) AF.current = requestAnimationFrame(animate);
    else {
      cancelAnimationFrame(AF.current);
      AF.current = requestAnimationFrame(finish);
    }
    // eslint-disable-next-line
  }, [loggedIn]);

  const toggleView = () => {
    if(contentRef.current) {
      contentRef.current.classList.toggle('opacityIn');
      contentRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setView(view === 'Login' ? 'Register' : 'Login');
        contentRef.current.classList.toggle('opacityOut');
        contentRef.current.classList.toggle('opacityIn');
      }, 300);
    }
  };

  /** Expands the bezier curves to the edges. */
  const finish = () => {
    if(canvasRef && canvasRef.current) {
      point0 = point0 + 0.025;
      point1 = point1 + 0.025;
      point2 = point2 + 0.025;
      point3 = point3 + 0.025;
      point4 = point4 + 0.025;
      point5 = point5 + 0.025;
      point6 = point6 + 0.025;
      const ctx: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
      if(ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.lineTo(width * point0, height);
        const points = [
          [width * point1, height * 0.8],
          [width * point2, height * 0.75],
          [width * point3, height * 0.4],
          [width * point4, height * 0.2],
          [width * point5, height * 0.05],
          [width * point6, 0]
        ];
        bezier(ctx, points);
        ctx.lineTo(0, 0);
        ctx.fillStyle = '#2F3136';
        ctx.fill();
      };
      if(point1 >= 1) cancelAnimationFrame(AF.current);
      else AF.current = requestAnimationFrame(finish);
    } else {
      cancelAnimationFrame(AF.current);
    }
  };

  /** Animates a bezier curve smoothly using basic math. This is what gets called by animation frame */
  const animate = () => {
    point1 = (!pointFlow1 ? point1 - 0.0001 : point1 + 0.00008);
    point2 = (!pointFlow2 ? point2 - 0.00009 : point2 + 0.00007);
    point3 = (!pointFlow3 ? point3 - 0.00008 : point3 + 0.00006);
    point4 = (!pointFlow4 ? point4 - 0.0001 : point4 + 0.00007);
    point5 = (!pointFlow5 ? point5 - 0.0001 : point5 + 0.00008);
    if(point1 <= 0.16) pointFlow1 = true;
    else if(point1 >= 0.30) pointFlow1 = false;
    if(point2 <= 0.50) pointFlow2 = true;
    else if(point2 >= 0.60) pointFlow2 = false;
    if(point3 <= 0.50) pointFlow3 = true;
    else if(point3 >= 0.60) pointFlow3 = false;
    if(point4 <= 0.60) pointFlow4 = true;
    else if(point4 >= 0.70) pointFlow4 = false;
    if(point5 <= 0.70) pointFlow5 = true;
    else if(point5 >= 0.73) pointFlow5 = false;
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
  };

  /** View that be rendered, either Login or Register. */
  const activeView = view === 'Login' ? <Login toggleView={toggleView} /> : <Register toggleView={toggleView} />

  return (
    <div id='authorization' className='opacityIn' ref={ref}>
      <canvas ref={canvasRef} width={width} height={height}/>
      <ToolBar transparent={true} />
      <div id='authorization-content' className='opacityIn' ref={contentRef}>
        {activeView}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    loggedIn: userReducer.loggedIn
  }
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(forwardRef<HTMLDivElement, AuthenticationProps>(Authentication));

interface AuthenticationProps {
  /** Wether the user is authenticated or not */
  loggedIn: boolean
}