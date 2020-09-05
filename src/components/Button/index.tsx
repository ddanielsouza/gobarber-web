import React, { InputHTMLAttributes } from 'react';
import { Container } from './styles';

interface ButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  type: 'button' | 'submit' | 'reset' | undefined;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container type="button" {...rest}>
    {children}
  </Container>
);

export default Button;
