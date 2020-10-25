import React from 'react';

import { render, fireEvent, wait } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  it('should be able to render an input field', async () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highligth on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    wait(async () => {
      await expect(containerElement).toHaveStyle('border-color: #ff9000');
      await expect(containerElement).toHaveStyle('color: #ff9000');
    });

    fireEvent.blur(inputElement);

    wait(async () => {
      await expect(containerElement).not.toHaveStyle('border-color: #ff9000');
      await expect(containerElement).not.toHaveStyle('color: #ff9000');
    });
  });

  it('should keep input border highligth when input filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'jhon@doe.com' },
    });

    fireEvent.blur(inputElement);

    wait(async () => {
      await expect(containerElement).toHaveStyle('color: #ff9000');
    });
  });
});
