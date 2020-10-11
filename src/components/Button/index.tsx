import React, { InputHTMLAttributes } from 'react';
import { Container } from './styles';

interface ButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  type: 'button' | 'submit' | 'reset' | undefined;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? 'Carregando ...' : children}
  </Container>
);

export default Button;
