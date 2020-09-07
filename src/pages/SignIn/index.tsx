import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Container, Content, Background } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface SignInFormDate {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const handleSubmit = useCallback(
    async (data: SignInFormDate): Promise<void> => {
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

          password: Yup.string().required(messageRequired('Senha')),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        const { ValidationError } = Yup;

        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Error autenticação',
            description: 'Erro ao fazer login, verifique os dados inseridos',
          });
        }
      }
    },
    [signIn, addToast],
  );

  return (
    <Container>
      <Content className="appear-from-left">
        <img src={logoImg} alt="Logo - GoBarber" />

        <Form onSubmit={handleSubmit} ref={formRef}>
          <h1>Faça seu logon</h1>

          <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Entrar</Button>

          <a href="/"> Esqueci minha senha </a>
        </Form>

        <Link to="/signup">
          <FiLogIn />
          Criar conta
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
