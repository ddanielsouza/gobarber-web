import React, { useCallback } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { Container, Content, Background } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as Yup from 'yup';

const SignUp: React.FC = () => {
  const handleSubmit = useCallback(async (data: object): Promise<void> => {
    const messageRequired = (fieldDescription: string) => `${fieldDescription} é obrigatório(a)`;
    const messageInvalid = (fieldDescription: string) => `${fieldDescription} está inválido(a), confira os dados preenchidos`;

    try{
      const schema = Yup.object().shape({
        name: Yup.string()
          .required(messageRequired('Nome')),
        email: Yup.string()
          .required(messageRequired('E-mail'))
          .email(messageInvalid('E-mail')),
        password: Yup.string()
          .min(6, "Preencha a senha com no mínimo 6 digitos"),
      })

      await schema.validate(data, {
        abortEarly: false,
      });
    }catch(err){
      console.log(err);
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="Logo - GoBarber" />

        <Form onSubmit={handleSubmit}>
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

        <a href="/">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
