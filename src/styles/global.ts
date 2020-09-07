import { createGlobalStyle, keyframes } from 'styled-components';

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px)
  }

  to {
    opacity: 1;
    transform: translateX(0)
  }
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px)
  }

  to {
    opacity: 1;
    transform: translateX(0)
  }
`;

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: #312E38;
    color: #FFF;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button, a {
    cursor: pointer;
  }

  .appear-from-left > * {
    animation: ${appearFromLeft} 1s
  }

  .appear-from-right > * {
    animation: ${appearFromRight} 1s
  }
`;
