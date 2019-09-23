import Mail from '../../lib/Mail';

class NewUser {
  get key() {
    return 'NewUser';
  }

  async handle({ data }) {
    const { name, email } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Bem vindo ao Node Blog',
      template: 'newuser',
      context: {
        user: name,
        email,
      },
    });
  }
}

export default new NewUser();
