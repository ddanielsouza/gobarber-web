import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Content, Background } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormDate {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  if (!token) {
    history.push('/signin');
  }

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormDate): Promise<void> => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Campo incorreto'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), ''],
            'As senhas não confere',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        addToast({
          type: 'success',
          title: 'Senha alterada',
          description: 'Nova senha já pode ser usada',
        });

        history.push('/signin');
      } catch (err) {
        const { ValidationError } = Yup;

        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Error',
            description:
              'Erro ao fazer reset da senha, verifique os dados inseridos',
          });
        }
      }
    },
    [addToast, history, token],
  );

  return (
    <Container>
      <Content className="appear-from-left">
        <img src={logoImg} alt="Logo - GoBarber" />

        <Form onSubmit={handleSubmit} ref={formRef}>
          <h1>Reset de senha</h1>

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirme sua senha"
          />
          <Button type="submit">Alterar senha</Button>
        </Form>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
