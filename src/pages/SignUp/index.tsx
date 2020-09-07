import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, Background } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: object): Promise<void> => {
      const messageRequired = (fieldDescription: string) =>
        `${fieldDescription} é obrigatório(a)`;

      const messageInvalid = (fieldDescription: string) =>
        `${fieldDescription} está inválido(a), confira os dados preenchidos`;

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(messageRequired('Nome')),
          email: Yup.string()
            .required(messageRequired('E-mail'))
            .email(messageInvalid('E-mail')),
          password: Yup.string().min(
            6,
            'Preencha a senha com no mínimo 6 digitos',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Seu cadastro foi criado',
        });

        history.push('/');
      } catch (err) {
        const { ValidationError } = Yup;

        if (err instanceof ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao cadastrar',
            description: 'Verifique os dados preenchidos ou tente mais tarde',
          });
        }
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content className="appear-from-right">
        <img src={logoImg} alt="Logo - GoBarber" />

        <Form onSubmit={handleSubmit} ref={formRef}>
          <h1>Faça seu cadastro</h1>
          <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
          <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft />
          Voltar para logon
        </Link>
      </Content>
    </Container>
  );
};

export default SignUp;
