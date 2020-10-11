import React, { useRef, useCallback, useState } from 'react';

import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Container, Content, Background } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormDate {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormDate): Promise<void> => {
      setLoading(true);

      const messageRequired = (fieldDescription: string) =>
        `${fieldDescription} é obrigatório(a)`;

      const messageInvalid = (fieldDescription: string) =>
        `${fieldDescription} está inválido(a), confira os dados preenchidos`;

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required(messageRequired('E-mail'))
            .email(messageInvalid('E-mail')),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description: 'Confira sua caixa de mensagem',
        });
      } catch (err) {
        const { ValidationError } = Yup;

        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Error',
            description: 'Erro ao tentar recuperar senha, tente',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast, setLoading],
  );

  return (
    <Container>
      <Content className="appear-from-left">
        <img src={logoImg} alt="Logo - GoBarber" />

        <Form onSubmit={handleSubmit} ref={formRef}>
          <h1>Recuperar senha</h1>

          <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

          <Button type="submit" loading={loading}>
            Recuperar
          </Button>
        </Form>

        <Link to="/signin">
          <FiLogIn />
          Voltar ao login
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
