import { useContext, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useRouter } from 'next/router';
import gsap from 'gsap/dist/gsap';
import styled from "styled-components"

import TransitionContext from '../context/TransitionContext';

const MainComponent = styled.div`
${'' /* transform-style: preserve-3d; */}
&.page-enter-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  z-index: 4;

  ${'' /* flip animation */}
  ${'' /* animation: 500ms ${transitionInFlip} 250ms cubic-bezier(0.37, 0, 0.63, 1) both; */}
  backface-visibility: hidden;
}

${'' /* flip animation */}
&.page-enter-active,
&.page-exit-active {
  .page-transition-inner {
    height: 100vh;
    overflow: hidden;
    ${'' /* animation: 1000ms ${transitionZoom} cubic-bezier(0.45, 0, 0.55, 1) both; */}
    background: white;
  }
}

${'' /* &.page-exit {
  ~ .wipe {
    transform: translateY(100%);
  }
} */}

&.page-exit-active {
  ${'' /* ~ .wipe {
    transform: translateY(0);
    transition: transform 1000ms ease;
  } */}

  main {
    transform: translateY(-${(props) => props.routingPageOffset}px);
  }
  ${'' /* flip animation */}
  ${'' /* animation: 500ms ${transitionOutFlip} 250ms cubic-bezier(0.37, 0, 0.63, 1) both; */}

  ${'' /* backface-visibility: hidden; */}
}

${'' /* &.page-enter-done {
  ~ .wipe {
    transform: translateY(-100%);
    transition: transform 1000ms ease;
  }
} */}
`

const Grid = styled.div`
width: 100%;
height: 100vh;
top: 0;
left: 0;
position: fixed;
display: grid;
grid-template-rows: repeat(10, 1fr);
grid-template-columns: repeat(10, 1fr);

  div {
    background: #444;
    visibility: hidden;
  }
`

const TransitionComponent = ({ children, route, routingPageOffset }) => {
  // const router = useRouter();
  const { toggleCompleted } = useContext(TransitionContext);
  const [transitioning, setTransitioning] = useState()
  const tl = useRef()
  const transitionRef = useRef()
  const playTransition = () => {
    toggleCompleted(false)
    setTransitioning(true)
    // gsap animation run
    tl.current.play(0)
  }
  const stopTransition = () => {
    toggleCompleted(true)
    setTransitioning('')
  }

  // gsap animation
  useEffect(() => {
    if (!transitionRef.current) {
      return
    }
      const squares = transitionRef.current.children
      gsap.set(squares, {
        autoAlpha: 1
      })
      tl.current = gsap.timeline({
        repeat: 1,
        repeatDelay: 0.2,
        yoyo: true,
        paused: true
      })
      .fromTo(squares, 
        {
          scale: 0,
          borderRadius: '100'
        },
        {
          scale: 1,
          borderRadius: 0,
          stagger: {
            grid: 'auto',
            from: 'edges',
            ease: 'sine.inOut',
            amount: 0.5
          }
        })
      
        return () => {
          tl.current.kill()
        };
  }, []);

  return (
    <>
    <TransitionGroup className={transitioning ? 'transitioning' : ''}>
    {/* <TransitionGroup> */}
      <CSSTransition
        key={route} 
        classNames='page' 
        timeout={500}
        onEnter={playTransition}
        onExit={stopTransition}
        // onEnter={(node) => {
        //   toggleCompleted(false);
        //   gsap.set(node, { autoAlpha: 0, scale: 0.8, xPercent: -100 });
        //   gsap
        //     .timeline({
        //       paused: true,
        //       onComplete: () => toggleCompleted(true),
        //     })
        //     .to(node, { autoAlpha: 1, xPercent: 0, duration: 0.25 })
        //     .to(node, { scale: 1, duration: 0.25 })
        //     .play();
        // }}
        // onExit={(node) => {
        //   gsap
        //     .timeline({ paused: true })
        //     .to(node, { scale: 0.8, duration: 0.2 })
        //     .to(node, { xPercent: 100, autoAlpha: 0, duration: 0.2 })
        //     .play();
        // }}
      >
        <MainComponent routingPageOffset={routingPageOffset}>
          {children}
        </MainComponent>
        {/* {children} */}
      </CSSTransition>
    </TransitionGroup>
    <Grid ref={transitionRef}>
      {[...Array(100)].map((_, i) => (
        <div key={i} />
      ))}
    </Grid>
    </>
  );
};

export default TransitionComponent;